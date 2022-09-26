<?php

use App\Http\Requests\StorePlanRequest;
use App\Http\Requests\UpdateFocusCreditRequest;
use App\Http\Requests\UpdateScheduleRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\CreditableModuleResource;
use App\Http\Resources\FocusResource;
use App\Http\Resources\PlanerResource;
use App\Http\Resources\PlanResource;
use App\Http\Resources\RuleResource;
use App\Http\Resources\TodoResource;
use App\Imports\JSONImport;
use App\Mail\PlanCreated;
use App\Models\FocusSelection;
use App\Models\Placement;
use App\Models\Plan;
use App\Models\Planer;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Mews\Purifier\Facades\Purifier;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/admin/login', function () {
    return Inertia::render('Admin/Login');
})->name('login');

Route::post('/admin/login', function (Request $request) {
    $credentials = $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required'],
    ]);

    if (Auth::attempt($credentials)) {
        $request->session()->regenerate();
        return Redirect::intended('/admin/planers');
    }
    return back()->withErrors([
        'email' => 'The provided credentials do not match our records.',
    ]);
});

Route::middleware('auth')->prefix('admin')->group(function () {
    Route::get('/', function () {
        return Redirect::route('admin-data');
    })->name('admin');

    Route::post('/logout', function (Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return Redirect::route('login');
    });

    Route::get('/data', function (Request $request) {
        return Inertia::render('Admin/Data');
    })->name('admin-data');

    Route::post('/data', function (Request $request) {
        $attributes = $request->validate([
            'import' => ['required', 'mimes:json'],
        ]);
        $file = $attributes['import'];
        DB::transaction(function () use ($file) {
            $import = new JSONImport($file);
            $import->run();
        });
        return Redirect::route('admin-data');
    });
});

Route::get('/', function (Request $request) {
    return Inertia::render('Home', array(
        'planersResource' => PlanerResource::collection(Planer::all())
    ));
});

Route::prefix('/{planer:slug}')->scopeBindings()->group(function () {
    Route::get('/', function (Planer $planer) {
        $infoTemplatePath = base_path("data/" . $planer->slug . ".html");
        $infoTemplate = file_get_contents($infoTemplatePath);
        $infoTemplate = Purifier::clean($infoTemplate);
        return Inertia::render(
            'Planer',
            array(
                'slug' => $planer->slug,
                'name' => $planer->name,
                'infoTemplate' => $infoTemplate
            )
        );
    })->name('planer');

    Route::get('/{plan:slug}', function (Planer $planer, Plan $plan) {
        return Redirect::route('plan-schedule', array('planer' => $planer, 'plan' => $plan->slug));
    })->name('plan');

    Route::get('/{plan:slug}/anrechnung', function (Planer $planer, Plan $plan) {
        $plan->load('focusSelections.focus');
        $planResource = new PlanResource($plan);
        $modules = $plan->getCreditableModules();
        foreach ($modules as $module) {
            $module->applyModifiers("credit");
        }
        $tour = isset($planer->tour["credit"]) ? $planer->tour["credit"] : null;
        return Inertia::render(
            'Credit',
            array(
                'planerName' => $planer->name,
                'planerSlug' => $planer->slug,
                'planResource' => $planResource,
                'creditableModulesResource' => CreditableModuleResource::collection($modules),
                'rulesResource' => RuleResource::collection($planer->rules()->where('type', 'credit')->get()),
                'todosResource' => TodoResource::collection($planer->todos()->where('type', 'credit')->get()),
                'tourData' => $tour,
            )
        );
    })->name('plan-credit');

    Route::put('/{plan:slug}/anrechnung', function (UpdateFocusCreditRequest $request, Planer $planer, Plan $plan) {
        $validated = $request->validated();
        $focusCredits = $validated['focusCredits'];
        DB::transaction(function () use ($focusCredits, $validated, $plan) {
            foreach ($focusCredits as $focusCredit) {
                $focusSelection = FocusSelection::findOrFail($focusCredit['focusSelectionId']);
                $focusSelection->creditedModules()->sync($focusCredit['moduleIds']);
                $focusSelection->save();
            }
            $plan->credit_tour_completed = $validated['tourCompleted'];
            $plan->credit_valid = $validated['valid'];
            $plan->save();
        });
        return response()->noContent();
    });

    Route::get('/{plan:slug}/zeitplan', function (Planer $planer, Plan $plan) {
        $planResource = new PlanResource($plan->load('placements'));
        $categoriesResource = CategoryResource::collection($plan->getCategoriesWithAllModules());
        $rulesResource = RuleResource::collection($planer->rules()->where('type', 'Schedule')->get());
        $todosResource = TodoResource::collection($planer->todos()->where('type', 'Schedule')->get());
        $fociResource = FocusResource::collection($planer->foci()->get());
        $tour = $tour = isset($planer->tour["schedule"]) ? $planer->tour["schedule"] : null;
        return Inertia::render(
            'Schedule',
            array(
                'planerName' => $planer->name,
                'planerSlug' => $planer->slug,
                'planResource' => $planResource,
                'categoriesResource' => $categoriesResource,
                'focusSelectionEnabled' => $planer->focus_selection_enabled,
                'fociResource' => $fociResource,
                'rulesResource' => $rulesResource,
                'todosResource' => $todosResource,
                'requiredECTS' => $planer->required_ects,
                'tourData' => $tour,
            )
        );
    })->name('plan-schedule');

    Route::post('/plans', function (StorePlanRequest $request, Planer $planer) {
        $validated = $request->validated();
        $plan = new Plan();
        $plan->email = $validated['email'];
        $plan->start_year = $validated['startYear'];
        DB::transaction(function () use ($plan, $planer) {
            $planer->plans()->save($plan);
            $plan->save();
        });

        Mail::to($validated['email'])
            ->queue(new PlanCreated($plan));
        return Redirect::route('plan', array('planer' => $planer, 'plan' => $plan->slug));
    });

    Route::put('/{plan:slug}/zeitplan', function (UpdateScheduleRequest $request, Planer $planer, Plan $plan) {
        DB::transaction(function () use ($request, $planer, $plan) {
            $validated = $request->validated();
            if (Arr::exists($validated, 'placements')) {
                $placements_data = $validated['placements'];
                $placements_data = collect($placements_data);
                $plan->placements()->delete();
                $placements_data->each(function ($placement_data) use ($plan) {
                    $placement = new Placement();
                    $placement->year = $placement_data['year'];
                    $placement->semester = $placement_data['semester'];
                    $placement->time_window = $placement_data['timeWindow'];
                    $placement->day = $placement_data['day'];
                    $placement->time = $placement_data['time'];
                    $placement->location = $placement_data['location'];
                    $placement->module()->associate($placement_data['moduleId']);
                    $plan->placements()->save($placement);
                });
            }

            if (Arr::exists($validated, 'focusSelections')) {
                $focusSelectionsData = $validated['focusSelections'];
                $plan->focusSelections()->whereNot(function ($q1) use ($focusSelectionsData) {
                    foreach ($focusSelectionsData as $focusSelectionData) {
                        $q1->orWhere(function ($q2) use ($focusSelectionData) {
                            $q2->where('position', $focusSelectionData['position'])->where('focus_id', $focusSelectionData['focusId']);
                        });
                    }
                })->delete();

                foreach ($focusSelectionsData as $focusSelectionData) {
                    $focusSelection = $plan->focusSelections()->where('position', $focusSelectionData['position'])->where('focus_id', $focusSelectionData['focusId'])->first();
                    if (!$focusSelection) {
                        $focusSelection = new FocusSelection();
                        $focusSelection->position = $focusSelectionData['position'];
                        $focusSelection->focus()->associate($planer->foci()->findOrFail($focusSelectionData['focusId']));
                        $plan->focusSelections()->save($focusSelection);
                    }
                    $focusSelection->save();
                }
            }
            $plan->schedule_tour_completed = $validated['tourCompleted'];
            $plan->schedule_valid = $validated['valid'];
            $plan->save();
        });

        return response()->noContent();
    });
});


Route::get('/.well-known/acme-challenge/{token}', function (string $token) {
    return \Illuminate\Support\Facades\Storage::get('public/.well-known/acme-challenge/' . $token);
});
