<?php

use App\Http\Requests\StorePlanRequest;
use App\Http\Requests\UpdatePlanRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ModuleResource;
use App\Http\Resources\PlanerResource;
use App\Http\Resources\PlanResource;
use App\Http\Resources\RuleResource;
use App\Imports\Import;
use App\Imports\Rules\RuleImport;
use App\Imports\TempImport;
use App\Models\Category;
use App\Models\Module;
use App\Models\Placement;
use App\Models\Plan;
use App\Models\Planer;
use App\Models\Rule;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

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
        return redirect()->intended('/admin/planers');
    }
    return back()->withErrors([
        'email' => 'The provided credentials do not match our records.',
    ]);
});

Route::prefix('/planers/{planer:slug}')->scopeBindings()->group(function () {
    Route::get('/', function (Planer $planer) {
        return Inertia::render('Planer', ['slug' => $planer->slug]);
    })->name('planer');

    Route::get('/plans/{plan:slug}', function (Planer $planer, Plan $plan) {
        $planResource = new PlanResource($plan);
        $categoriesResource = CategoryResource::collection($planer->categories()->get());
        $modulesResource = ModuleResource::collection($planer->getModulesForPlan($plan));
        $rulesResource = RuleResource::collection(Rule::all());
        return Inertia::render(
            'Plan',
            array(
                'planerName' => $planer->name,
                'planerSlug' => $planer->slug,
                'plan' => $planResource,
                'categories' => $categoriesResource,
                'modules' => $modulesResource,
                'rules' => $rulesResource,
                'requiredCredits' => $planer->required_credits,
            )
        );
    })->name('plan');

    Route::post('/plans', function (StorePlanRequest $request, Planer $planer) {
        $validated = $request->validated();
        $plan = new Plan();
        $plan->start_year = $validated['startYear'];
        $planer->plans()->save($plan);
        return Redirect::route('plan', array('planer' => $planer, 'plan' => $plan->slug));
    });

    Route::put('/plans/{plan:slug}', function (UpdatePlanRequest $request, Planer $planer, Plan $plan) {
        $validated = $request->validated();

        $placements = $validated['placements'];
        $placements = collect($placements);

        DB::transaction(function () use ($plan, $placements) {
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
        });

        return new PlanResource($plan);
    });
});

Route::middleware('auth')->prefix('admin')->group(function () {
    Route::get('/', function () {
        return redirect()->route('admin-planers');
    })->name('admin');

    Route::post('/logout', function (Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('login');
    });

    Route::get('/import', function (Request $request) {
        return Inertia::render('Admin/Import');
    })->name('admin-import');

    Route::post('/import', function (Request $request) {
        $attributes = $request->validate([
            'import' => ['required', 'mimes:xlsx'], //todo check mime formats
            'year' => ['required', 'numeric'] //todo validate year range
        ]);
        $file = $attributes['import'];
        $tempImport = new TempImport();
        Excel::import($tempImport, $file);
        $year = $attributes['year'];
        $locations = $tempImport->getLocations();
        $times = $tempImport->getTimes();
        DB::transaction(function () use ($year, $locations, $times, $file) {
            Excel::import(new Import($year, $locations, $times), $file);
        });
        return redirect()->route('admin-import');
    });

    Route::get('/categories', function (Request $request) {
        $categories = CategoryResource::collection(Category::all());
        return Inertia::render('Admin/Categories', ['categoriesResource' => $categories]);
    })->name('admin-categories');

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

    Route::get('/rules/import', function (Request $request) {
        return Inertia::render('Admin/RulesImport');
    })->name('admin-rules-import');

    Route::post('/rules/import', function (Request $request) {
        $attributes = $request->validate([
            'import' => ['required', 'mimes:json'],
        ]);
        $file = $attributes['import'];
        $import = new RuleImport();
        $import->run($file);
        return redirect()->route('admin-rules-import');
    });
});


Route::get('/.well-known/acme-challenge/{token}', function (string $token) {
    return \Illuminate\Support\Facades\Storage::get('public/.well-known/acme-challenge/' . $token);
});
