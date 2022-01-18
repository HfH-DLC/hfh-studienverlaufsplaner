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
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule as ValidationRule;
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
        return Inertia::render(
            'Plan',
            array('planerName'=> $planer->name,
            'planerSlug'=> $planer->slug,
            'plan' => $plan,
            'categories' => $catogries,
            'timeSlots' => $timeSlots,
            'modules' => $modules,
            'rules' => $rules,
            'requiredCredits' => $planer->required_credits,
            'optionsWeek' => $planer->options_week,
            'optionsDay' => $planer->options_day,
            'optionsTime' => $planer->options_time)
        );
    })->name('plan');
    
    Route::post('/plans', function (Request $request, Planer $planer) {
        $attributes = $request->validate([
            'startYear' => ['required', 'integer']
        ]);
        $plan = new Plan();
        $plan->start_year = $attributes['startYear'];
        $planer->plans()->save($plan);
        return Redirect::route('plan', array('planer' => new PlanerResource($planer), 'plan' => $plan->slug));
    });
    
    Route::put('/plans/{plan:slug}', function (Request $request, Planer $planer, Plan $plan) {
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
        return redirect()->route('admin-planers');
    })->name('admin');

    Route::post('/logout', function (Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('login');
    });

    Route::get('/planers', function () {
        $planers = PlanerResource::collection(Planer::all());
        return Inertia::render('Admin/Planers', ['planersResource' => $planers]);
    })->name('admin-planers');

    Route::post('/planers', function (Request $request) {
        $attributes = $request->validate([
            'name' => ['required', 'unique:planers'],
            'requiredCredits' => ['required','numeric', 'integer', 'min:0'],
            'optionsDay' => ['required', 'array', 'min:1', Illuminate\Validation\Rule::in(['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'])]
        ]);
        
        $planer = new Planer();
        $planer->name = $attributes['name'];
        $planer->required_credits = $attributes['requiredCredits'];
        $planer->options_day = $attributes['optionsDay'];
        $planer->save();
        return redirect()->route('admin-planers');
    });
    
    Route::prefix('planers/{planer:slug}')->scopeBindings()->group(function () {
        
        Route::get('/', function (Request $request, Planer $planer) {
            return redirect()->route('admin-categories', ['planer' => $planer]);
        })->name('admin-planer');

        Route::put('/', function (Request $request, Planer $planer) {
            $attributes = $request->validate([
                'name' => ['required','unique:planers,'.$planer->id],
                'requiredCredits' => ['required','numeric', 'integer', 'min:0'],
                'optionsDay' => ['required', 'array', Illuminate\Validation\Rule::in(['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'])]
            ]);
            
            $planer->name = $attributes['name'];
            $planer->required_credits = $attributes['requiredCredits'];
            $planer->options_day = $attributes['optionsDay'];
            $planer->save();
            return redirect()->route('admin');
        });

        Route::delete('/', function (Request $request, Planer $planer) {
            $planer->delete();
            return redirect()->route('admin');
        });
        
        Route::get('/categories', function (Request $request, Planer $planer) {
            $categories = CategoryResource::collection($planer->categories()->get());
            return Inertia::render('Admin/Categories', ['categoriesResource' => $categories, 'planerName' => $planer->name, 'planerSlug'=> $planer->slug]);
        })->name('admin-categories');
        
        Route::post('/categories', function (Request $request, Planer $planer) {
            $attributes = $request->validate([
                'name' => ['required'],
                'requiredNumber' => ['nullable','numeric', 'integer', 'min:0']
            ]);
            
            $category = new Category();
            $category->name = $attributes['name'];
            $category->required_number = $attributes['requiredNumber'];
            $planer->categories()->save($category);
            return redirect()->route('admin-categories', ['planer' => $planer]);
        });
        
        Route::put('/categories/{category}', function (Request $request, Planer $planer, Category $category) {
            $attributes = $request->validate([
                'name' => ['required'],
                'requiredNumber' => ['nullable','numeric', 'integer', 'min:0']
            ]);
            
            $category->name = $attributes['name'];
            $category->required_number = $attributes['requiredNumber'];
            $category->save();
            return redirect()->route('admin-categories', ['planer' => $planer]);
        });
        
        Route::delete('/categories/{category}', function (Request $request, Planer $planer, Category $category) {
            $category->delete();
            return redirect()->route('admin-categories', ['planer' => $planer]);
        });
        
        Route::get('/timeslots', function (Request $request, Planer $planer) {
            $timeSlots = TimeSlotResource::collection($planer->timeSlots()->get());
            return Inertia::render(
                'Admin/TimeSlots',
                [
                'timeSlotsResource' => $timeSlots,
                'planerName' => $planer->name,
                'planerSlug'=> $planer->slug,
                'planerOptionsWeek' => $planer->options_week,
                'planerOptionsDay' => $planer->options_day,
                'planerOptionsTime' => $planer->options_time
                ]
            );
        })->name('admin-timeslots');
        
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
            return redirect()->route('admin-timeslots', ['planer' => $planer]);
        });

        Route::post('/timeslots/generate', function (Request $request, Planer $planer) {
            //todo validation
            $attributes = $request->validate([
                'startYear' => ['required', 'numeric', 'integer'],
                'endYear' => ['required', 'numeric', 'integer', 'gt:startYear'],
            ]);
            $start_year = $attributes['startYear'];
            $end_year = $attributes['endYear'];
            $timeSlots = [];
            $years = range($start_year, $end_year);
            foreach ($years as $year) {
                $semesters = [];
                if ($year !== $end_year) {
                    $semesters[] = 'HS';
                }
                if ($year !== $start_year) {
                    $semesters[] = 'FS';
                }
                foreach ($semesters as $semester) {
                    foreach ($planer->options_week as $week) {
                        foreach ($planer->options_day as $day) {
                            foreach ($planer->options_time as $time) {
                                $timeSlots[] = ['year' => $year, 'semester' => $semester, 'week' => $week, 'day' => $day, 'time' => $time];
                            }
                        }
                    }
                }
            }

            $planer->timeSlots()->createMany($timeSlots);
            return redirect()->route('admin-timeslots', ['planer' => $planer]);
        });
        
        Route::put('/timeslots/{timeSlot}', function (Request $request, Planer $planer, TimeSlot $timeSlot) {
            //todo validation
            $attributes = $request->validate([
                'year' => ['required'],
                'semester' => ['required'],
                'week' => ['required'],
                'day' => ['required'],
                'time' => ['required'],
            ]);
            
            $timeSlot->year = $attributes['year'];
            $timeSlot->semester = $attributes['semester'];
            $timeSlot->week = $attributes['week'];
            $timeSlot->day = $attributes['day'];
            $timeSlot->time = $attributes['time'];
            $timeSlot->save();
            return redirect()->route('admin-timeslots', ['planer' => $planer]);
        });

        Route::delete('/timeslots/{timeSlot}', function (Request $request, Planer $planer, TimeSlot $timeSlot) {
            $timeSlot->delete();
            return redirect()->route('admin-timeslots', ['planer' => $planer]);
        });
        
        Route::get('/modules', function (Request $request, Planer $planer) {
            $modules = ModuleResource::collection($planer->modules()->get());
            $categories = CategoryResource::collection($planer->categories()->get());
            $timeSlots = TimeSlotResource::collection($planer->timeSlots()->get());
            return Inertia::render('Admin/Modules', ['modulesResource' => $modules, 'categoriesResource' => $categories, 'timeSlotsResource' => $timeSlots, 'planerName' => $planer->name, 'planerSlug'=> $planer->slug]);
        })->name('admin-modules');
        
        Route::post('/modules', function (Request $request, Planer $planer) {
            $attributes = $request->validate([
                'number' => ['required'],
                'name' => ['required'],
                'category' => ['required', 'exists:categories,id'],
                'credits' => ['required', 'numeric', 'integer', 'min:0'],
                'timeSlots' => ['required', 'exists:time_slots,id'],
                'prerequisites' => ['nullable', 'array'],
                'prerequisites.*.id' => ['exists:modules,id']
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
            return redirect()->route('admin-modules', ['planer' => $planer]);
        });
        
        Route::put('/modules/{module}', function (Request $request, Planer $planer, Module $module) {
            $attributes = $request->validate([
                'number' => ['required'],
                'name' => ['required'],
                'category' => ['required', 'exists:categories,id'],
                'credits' => ['required', 'numeric', 'integer', 'min:0'],
                'timeSlots' => ['required', 'exists:time_slots,id'],
                'prerequisites' => ['nullable', 'array'],
                'prerequisites.*.id' => ['exists:modules,id']
            ]);
            
            $module->number = $attributes['number'];
            $module->name = $attributes['name'];
            $module->category()->associate($attributes['category']);
            $module->credits = $attributes['credits'];
            $planer->modules()->save($module);
            $module->timeSlots()->sync($attributes['timeSlots']);
            $module->prerequisites()->sync($attributes['prerequisites']);
            $module->save();
            return redirect()->route('admin-modules', ['planer' => $planer]);
        });

        Route::delete('/modules/{modul}', function (Request $request, Planer $planer, Module $module) {
            $module->delete();
            return redirect()->route('admin-modules', ['planer' => $planer]);
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
