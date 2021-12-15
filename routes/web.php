<?php

use App\Http\Resources\CategoryResource;
use App\Http\Resources\ModuleResource;
use App\Http\Resources\PlanerResource;
use App\Http\Resources\PlanResource;
use App\Http\Resources\RuleResource;
use App\Http\Resources\TimeSlotResource;
use App\Models\Category;
use App\Models\Module;
use App\Models\Placement;
use App\Models\Plan;
use App\Models\Planer;
use App\Models\Rule;
use App\Models\TimeSlot;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
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
Route::name('login')->get('/login', '\\'.Route::getRoutes()->getByName('shibboleth-login')->getActionName());

Route::get('/', function () {
    return Inertia::render('Home', []);
})->name('home');

Route::prefix('/planers/{planer:slug}')->scopeBindings()->group(function () {
    Route::get('/', function (Planer $planer) {
        return Inertia::render('Planer', ['slug' => $planer->slug]);
    })->name('planer');

    Route::get('/plans/{plan}', function (Planer $planer, Plan $plan) {
        $plan = new PlanResource($plan);
        $catogries = CategoryResource::collection($planer->categories()->get());
        $timeSlots = TimeSlotResource::collection($planer->timeSlots()->where('year', '>', $plan->start_year)->orWhere(function ($query) use ($plan) {
            $query->where('year', $plan->start_year);
            $query->where('semester', 'HS');
        })->get());
        $modules = ModuleResource::collection($planer->modules()->whereHas('timeSlots', function ($query) use ($timeSlots) {
            $query->whereIn('id', $timeSlots->pluck('id'));
        })->get());
        $rules = RuleResource::collection($planer->rules()->get());
        return Inertia::render('Plan', array('planerSlug'=> $planer->slug, 'plan' => $plan, 'categories' => $catogries, 'timeSlots' => $timeSlots, 'modules' => $modules, 'rules' => $rules, 'requiredCredits' => $planer->required_credits));
    })->name('plan');
    
    Route::post('/plans', function (Request $request, Planer $planer) {
        $attributes = $request->validate([
            'startYear' => ['required', 'integer']
        ]);
        $plan = new Plan();
        $plan->start_year = $attributes['startYear'];
        $planer->plans()->save($plan);
        return Redirect::route('plan', array('planer' => new PlanerResource($planer), 'plan' => $plan->id));
    });
    
    Route::put('/plans/{plan}', function (Request $request, Planer $planer, Plan $plan) {
        $attributes = $request->validate([
            'placements' => ['present','array'],
            'placements.*.timeSlotId' => ['required', 'exists:time_slots,id'],
            'placements.*.moduleId' => ['required', 'exists:modules,id']
        ]);
    
        $placements = $attributes['placements'];
    
        $placements_without_id = collect($placements)->where('id', '');
        $placements_with_id = (clone collect($placements))->where('id', '!=', '');
        $placements_ids = $placements_with_id->pluck('id');
    
        foreach ($placements_with_id as $placement) {
            $obj = $plan->placements()->find($placement['id']);
            if ($obj) {
                $obj->module()->associate($placement['moduleId']);
                $obj->save();
            }
        }
    
        $plan->placements()->whereNotIn('id', $placements_ids)->delete();
    
        $placements_without_id->each(function ($placement) use ($plan) {
            $obj = new Placement();
            $obj->timeSlot()->associate($placement['timeSlotId']);
            $obj->module()->associate($placement['moduleId']);
            $plan->placements()->save($obj);
        });
        return new PlanResource($plan);
    });
});

Route::middleware('auth')->prefix('admin')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Admin');
    })->name('admin');

    Route::prefix('planers/{planer:slug}')->scopeBindings()->group(function () {

        Route::get('/', function (Request $request, Planer $planer) {
            return Inertia::render('AdminPlaner', ['planer' => new PlanerResource($planer)]);
        })->name('admin-planer');

        Route::post('/categories', function (Request $request, Planer $planer) {
            //todo validation
            $attributes = $request->validate([
                'name' => ['required'],
                'requiredNumber' => ['nullable','numeric', 'integer', 'min:0']
            ]);
    
            $category = new Category();
            $category->name = $attributes['name'];
            $category->required_number = $attributes['requiredNumber'];
            $planer->categories()->save($category);
            return redirect()->route('admin-planer', ['planer' => $planer]);
        });
    
        Route::post('/timeslots', function (Request $request, Planer $planer) {
            //todo validation
            $attributes = $request->validate([
                'year' => ['required'],
                'semester' => ['required'],
                'week' => ['required'],
                'day' => ['required'],
                'time' => ['required'],
            ]);
    
            $timeSlot = new TimeSlot();
            $timeSlot->year = $attributes['year'];
            $timeSlot->semester = $attributes['semester'];
            $timeSlot->week = $attributes['week'];
            $timeSlot->day = $attributes['day'];
            $timeSlot->time = $attributes['time'];
            $planer->timeSlots()->save($timeSlot);
            return redirect()->route('admin-planer', ['planer' => $planer]);
        });
    
        Route::post('/modules', function (Request $request, Planer $planer) {
            //todo validation
            $attributes = $request->validate([
                'number' => ['required'],
                'name' => ['required'],
                'category' => ['required', 'exists:categories,id'],
                'credits' => ['required', 'numeric', 'integer', 'min:0'],
                'timeSlots' => ['required', 'exists:time_slots,id'],
                'prerequisites' => ['nullable', 'array'],
            ]);
    
            $module = new Module();
            $module->number = $attributes['number'];
            $module->name = $attributes['name'];
            $module->category()->associate($attributes['category']);
            $module->credits = $attributes['credits'];
            $planer->modules()->save($module);
            $module->timeSlots()->sync($attributes['timeSlots']);
            $module->prerequisites()->sync($attributes['prerequisites']);
            $module->save();
            return redirect()->route('admin-planer', ['planer' => $planer]);
        });
    
        Route::post('/rules', function (Request $request, Planer $planer) {
            $attributes = $request->validate([
                'type' => ['required', ValidationRule::in(Rule::$types)],
                'params' => ['nullable', 'array']
            ]);
    
            $rule = new Rule();
            $rule->type = $attributes['type'];
            $rule->params = $attributes['params'];
            $planer->rules()->save($rule);
            return redirect()->route('admin-planer', ['planer' => $planer]);
        });
    });
});
