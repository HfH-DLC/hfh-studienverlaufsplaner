<?php

use App\Http\Requests\StorePlanRequest;
use App\Http\Requests\UpdateFocusCreditRequest;
use App\Http\Requests\UpdateFocusSelectionRequest;
use App\Http\Requests\UpdateModuleSelectionRequest;
use App\Http\Requests\UpdateScheduleRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\CreditableModuleResource;
use App\Http\Resources\FocusResource;
use App\Http\Resources\FocusSelectionResource;
use App\Http\Resources\ModuleResource;
use App\Http\Resources\PlanerResource;
use App\Http\Resources\PlanResource;
use App\Http\Resources\RuleResource;
use App\Imports\JSONImport;
use App\Imports\Rules\RuleImport;
use App\Mail\PlanCreated;
use App\Models\Focus;
use App\Models\FocusSelection;
use App\Models\Module;
use App\Models\Placement;
use App\Models\Plan;
use App\Models\Planer;
use App\Models\Rule;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

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
        return Redirect::route('admin-planers');
    })->name('admin');

    Route::post('/logout', function (Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return Redirect::route('login');
    });

    Route::get('/import', function (Request $request) {
        return Inertia::render('Admin/Import');
    })->name('admin-import');

    Route::post('/import', function (Request $request) {
        $attributes = $request->validate([
            'import' => ['required', 'mimes:json'],
        ]);
        $file = $attributes['import'];
        DB::transaction(function () use ($file) {
            $import = new JSONImport($file);
            $import->run();
        });
        return Redirect::route('admin-import');
    });

    Route::get('/modules', function (Request $request) {
        $modules = ModuleResource::collection(Module::all());
        return Inertia::render('Admin/Modules', ['modulesResource' => $modules]);
    })->name('admin-modules');

    Route::get('/modules/{module}', function (Request $request, Module $module) {
        $moduleResource = new ModuleResource($module);
        return Inertia::render(
            'Admin/Module',
            [
                'moduleResource' => $moduleResource
            ]
        );
    })->name('admin-module');

    Route::get('/planers', function () {
        $planers = PlanerResource::collection(Planer::all());
        return Inertia::render('Admin/Planers', ['planersResource' => $planers]);
    })->name('admin-planers');
});

Route::prefix('/{planer:slug}')->scopeBindings()->group(function () {
    Route::get('/', function (Planer $planer) {
        return Inertia::render('Planer', ['slug' => $planer->slug, 'name' => $planer->name]);
    })->name('planer');


    Route::get('/{plan:slug}', function (Planer $planer, Plan $plan) {
        return Redirect::route('plan-schedule', array('planer' => $planer, 'plan' => $plan->slug));
    })->name('plan');

    Route::get('/{plan:slug}/anrechnung', function (Planer $planer, Plan $plan) {
        $planResource = new PlanResource($plan);
        return Inertia::render(
            'Credit',
            array(
                'planerName' => $planer->name,
                'planerSlug' => $planer->slug,
                'planResource' => $planResource,
                'creditableModulesResource' => CreditableModuleResource::collection($plan->getCreditableModules()),
                'rulesResource' => RuleResource::collection($planer->rules()->where('type', 'FocusCredit')->get())
            )
        );
    })->name('plan-credit');

    Route::put('/{plan:slug}/anrechnung', function (UpdateFocusCreditRequest $request, Planer $planer, Plan $plan) {
        $validated = $request->validated();
        $focusCredits = $validated['focusCredits'];
        DB::transaction(function () use ($focusCredits) {
            foreach ($focusCredits as $focusSelectionId => $moduleIds) {
                $focusSelection = FocusSelection::findOrFail($focusSelectionId);
                $focusSelection->creditedModules()->sync($moduleIds);
                $focusSelection->save();
            }
        });
        return response()->noContent();
    });

    Route::get('/{plan:slug}/zeitplan', function (Planer $planer, Plan $plan) {
        $planResource = new PlanResource($plan->load('placements'));
        $categoriesResource = CategoryResource::collection($planer->getCategoriesWithAllModules($plan));
        $rulesResource = RuleResource::collection($planer->rules()->where('type', 'Placement')->get());
        $fociResource = FocusResource::collection($planer->foci()->get());
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
                'requiredECTS' => $planer->required_ects,
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
        DB::transaction(function () use ($plan, $request) {
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
                    $focusSelection = FocusSelection::where('position', $focusSelectionData['position'])->where('focus_id', $focusSelectionData['focusId'])->first();
                    if (!$focusSelection) {
                        $focusSelection = new FocusSelection();
                        $focusSelection->position = $focusSelectionData['position'];
                        $focusSelection->focus()->associate(Focus::findOrFail($focusSelectionData['focusId']));
                        $plan->focusSelections()->save($focusSelection);
                    }
                    $focusSelection->save();
                }
            }

            if (Arr::exists($validated, 'tourCompleted')) {
                $plan->tour_completed = $validated['tourCompleted'];;
            }
            $plan->save();
        });

        return response()->noContent();
    });
});


Route::get('/.well-known/acme-challenge/{token}', function (string $token) {
    return \Illuminate\Support\Facades\Storage::get('public/.well-known/acme-challenge/' . $token);
});
