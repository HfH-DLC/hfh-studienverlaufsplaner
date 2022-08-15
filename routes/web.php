<?php

use App\Http\Requests\StorePlanRequest;
use App\Http\Requests\UpdateFocusCreditRequest;
use App\Http\Requests\UpdateFocusSelectionRequest;
use App\Http\Requests\UpdateModuleSelectionRequest;
use App\Http\Requests\UpdateScheduleRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\FocusResource;
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

    Route::get('/rules', function (Request $request) {
        $rules = RuleResource::collection(Rule::all());
        return Inertia::render('Admin/Rules', ['rulesResource' => $rules, 'types' => Rule::$types]);
    })->name('admin-rules');

    Route::post('/rules/import', function (Request $request) {
        $attributes = $request->validate([
            'import' => ['required', 'mimes:json'],
        ]);
        $file = $attributes['import'];
        $import = new RuleImport();
        $import->run($file);
        return Redirect::route('admin-rules');
    });
});

Route::prefix('/{planer:slug}')->scopeBindings()->group(function () {
    Route::get('/', function (Planer $planer) {
        return Inertia::render('Planer', ['slug' => $planer->slug, 'name' => $planer->name]);
    })->name('planer');


    Route::get('/{plan:slug}', function (Planer $planer, Plan $plan) {
        if ($planer->module_selection_enabled) {
            return Redirect::route('plan-focus', array('planer' => $planer, 'plan' => $plan->slug));
        }
        Redirect::route('plan-schedule', array('planer' => $planer, 'plan' => $plan->slug));
    })->name('plan');

    Route::get('/{plan:slug}/schwerpunkte', function (Planer $planer, Plan $plan) {
        $planResource = new PlanResource($plan);
        $fociResource = FocusResource::collection($planer->foci()->get());
        return Inertia::render(
            'FocusSelection',
            array(
                'planerName' => $planer->name,
                'planerSlug' => $planer->slug,
                'planResource' => $planResource,
                'fociResource' => $fociResource
            )
        );
    })->name('plan-focus');

    Route::put('/{plan:slug}/schwerpunkte', function (UpdateFocusSelectionRequest $request, Planer $planer, Plan $plan) {
        $validated = $request->validated();

        $first_focus_selection_data = $validated['firstFocusSelection'];
        $second_focus_selection_data  = $validated['secondFocusSelection'];
        DB::transaction(function () use ($plan, $first_focus_selection_data, $second_focus_selection_data) {
            $plan->focusSelections()->delete();

            $first_focus_selection = new FocusSelection();
            $first_focus_selection->position = 0;
            $first_focus_selection->focus()->associate(Focus::findOrFail($first_focus_selection_data['focus']));
            $plan->focusSelections()->save($first_focus_selection);
            $first_focus_selection->selectedRequiredModules()->sync($first_focus_selection_data['selectedRequiredModules']);

            if ($second_focus_selection_data['focus']) {
                $second_focus_selection = new FocusSelection();
                $second_focus_selection->position = 1;
                $second_focus_selection->focus()->associate(Focus::findOrFail($second_focus_selection_data['focus']));
                $plan->focusSelections()->save($second_focus_selection);
                $second_focus_selection->selectedRequiredModules()->sync($second_focus_selection_data['selectedRequiredModules']);
            }
        });
        return Redirect::route('plan-modules', array('planer' => $planer, 'plan' => $plan->slug));
    });

    Route::get('/{plan:slug}/module', function (Planer $planer, Plan $plan) {
        $planResource = new PlanResource($plan);
        $categoriesResource = CategoryResource::collection($planer->getCategoriesForPlan($plan));
        return Inertia::render(
            'ModuleSelection',
            array(
                'planerName' => $planer->name,
                'planerSlug' => $planer->slug,
                'planResource' => $planResource,
                'categoriesResource' => $categoriesResource
            )
        );
    })->name('plan-modules');

    Route::put('/{plan:slug}/module', function (UpdateModuleSelectionRequest $request, Planer $planer, Plan $plan) {
        $validated = $request->validated();
        $plan->selectedModules()->sync($validated['modules']);
        $plan->save();
        return Redirect::route('plan-credit', array('planer' => $planer, 'plan' => $plan->slug));
    });

    Route::get('/{plan:slug}/anrechnung', function (Planer $planer, Plan $plan) {
        $planResource = new PlanResource($plan);
        $categoriesResource = CategoryResource::collection($planer->getCategoriesForPlan($plan));
        return Inertia::render(
            'FocusCredit',
            array(
                'planerName' => $planer->name,
                'planerSlug' => $planer->slug,
                'planResource' => $planResource,
                'categoriesResource' => $categoriesResource
            )
        );
    })->name('plan-credit');

    Route::put('/{plan:slug}/anrechnung', function (UpdateFocusCreditRequest $request, Planer $planer, Plan $plan) {
        $validated = $request->validated();
        $focusCredits = $validated['focusCredits'];
        DB::transaction(function () use ($focusCredits) {
            foreach ($focusCredits as $focusSelectionId => $moduleIds) {
                var_dump($focusSelectionId);
                $focusSelection = FocusSelection::findOrFail($focusSelectionId);
                $focusSelection->creditedModules()->sync($moduleIds);
                $focusSelection->save();
            }
        });
        return Redirect::route('plan-schedule', array('planer' => $planer, 'plan' => $plan->slug));
    });

    Route::get('/{plan:slug}/zeitplan', function (Planer $planer, Plan $plan) {
        $planResource = new PlanResource($plan);
        $categoriesResource = CategoryResource::collection($planer->getCategoriesForPlan($plan));
        $rulesResource = RuleResource::collection(Rule::all());
        return Inertia::render(
            'Schedule',
            array(
                'planerName' => $planer->name,
                'planerSlug' => $planer->slug,
                'planResource' => $planResource,
                'categoriesResource' => $categoriesResource,
                'rulesResource' => $rulesResource,
                'requiredCredits' => $planer->required_credits,
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

    Route::put('/{plan:slug}/schedule', function (UpdateScheduleRequest $request, Planer $planer, Plan $plan) {
        DB::transaction(function () use ($plan, $request) {
            $validated = $request->validated();
            if (Arr::exists($validated, 'placements')) {
                $placements = $validated['placements'];
                $placements = collect($placements);
                $plan->placements()->delete();
                $placements->each(function ($placement) use ($plan) {
                    $obj = new Placement();
                    $obj->year = $placement['year'];
                    $obj->semester = $placement['semester'];
                    $obj->week = $placement['week'];
                    $obj->day = $placement['day'];
                    $obj->time = $placement['time'];
                    $obj->location = $placement['location'];
                    $obj->module()->associate($placement['moduleId']);
                    $plan->placements()->save($obj);
                });
            }
            if (Arr::exists($validated, 'tourCompleted')) {
                $plan->tour_completed = $validated['tourCompleted'];;
            }
            $plan->save();
        });

        return new PlanResource($plan);
    });
});


Route::get('/.well-known/acme-challenge/{token}', function (string $token) {
    return \Illuminate\Support\Facades\Storage::get('public/.well-known/acme-challenge/' . $token);
});
