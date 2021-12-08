<?php

use App\Http\Resources\CategoryResource;
use App\Http\Resources\ModuleResource;
use App\Http\Resources\PlanResource;
use App\Http\Resources\RuleResource;
use App\Http\Resources\TimeSlotResource;
use App\Models\Category;
use App\Models\Module;
use App\Models\Placement;
use App\Models\Plan;
use App\Models\Rule;
use App\Models\TimeSlot;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
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

Route::get('/plans/{plan}', function (Plan $plan) {
    $plan = new PlanResource($plan);
    $catogries = CategoryResource::collection(Category::all());
    $timeSlots = TimeSlotResource::collection(TimeSlot::all());
    $modules = ModuleResource::collection(Module::all());
    $rules = RuleResource::collection(Rule::all());
    return Inertia::render('Plan', array('plan' => $plan, 'categories' => $catogries, 'timeSlots' => $timeSlots, 'modules' => $modules, 'rules' => $rules));
})->name('plan');

Route::post('/plans', function () {
    $plan = new Plan();
    $plan->save();
    return Redirect::route('plan', array('plan' => $plan->id));
});

Route::put('/plans/{plan}', function (Request $request, Plan $plan) {
    $attributes = $request->validate([
        'placements' => ['present','array'],
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

Route::middleware('auth')->group(function () {

    Route::get('/admin', function () {
        //todo get values for current planer instead and map to response objects
        $catogries = Category::all();
        $timeSlots = TimeSlot::all();
        $modules = Module::all();
        return Inertia::render('Admin', ['categories' => $catogries, 'timeSlots' => $timeSlots, 'modules' => $modules]);
    })->name('admin');

    Route::post('/categories', function (Request $request) {
        //todo validation
        $attributes = $request->validate([
            'name' => ['required'],
            'requiredNumber' => ['nullable','numeric', 'integer', 'min:0']
        ]);

        $category = new Category();
        $category->name = $attributes['name'];
        $category->required_number = $attributes['requiredNumber'];
        $category->save();
        return redirect()->route('admin');
    });

    Route::post('/timeslots', function (Request $request) {
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
        $timeSlot->save();
        return redirect()->route('admin');
    });

    Route::post('/modules', function (Request $request) {
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
        $module->save();
        $module->timeSlots()->sync($attributes['timeSlots']);
        $module->prerequisites()->sync($attributes['prerequisites']);
        $module->save();
        return redirect()->route('admin');
    });
});
