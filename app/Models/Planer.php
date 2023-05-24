<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Planer extends Model
{
    use HasFactory;

    protected $casts = [
        'required_ects' => 'integer',
        'focus_selection_enabled' => 'boolean',
        'tour' => 'array',
        'meta' => 'array'
    ];

    public function plans()
    {
        return $this->hasMany(Plan::class);
    }

    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    public function foci()
    {
        return $this->hasMany(Focus::class);
    }

    public function rules()
    {
        return $this->hasMany(Rule::class);
    }

    public function todos()
    {
        return $this->hasMany(Todo::class);
    }


    public function getModules($query = NULL)
    {
        $key = $this->getCacheKey("modules");
        if (!Cache::has($key)) {
            $modules = collect();
            $withParam = ['modules'];
            if ($query !== NULL) {
                $withParam = ['modules' => $query];
            }
            foreach ($this->categories()->with($withParam)->get() as $category) {
                $modules = $modules->merge($category->modules);
            }
            Cache::put($key, $modules);
            return $modules;
        }
        return Cache::get($key);
    }

    public function getEvents()
    {
        $key = $this->getCacheKey("events");
        if (!Cache::has($key)) {
            $modules = $this->getModules();
            $events = collect();
            foreach ($modules->all() as $module) {
                $events = $events->merge($module->events);
            }
            Cache::put($key, $events);
            return $events;
        }
        return Cache::get($key);
    }

    public function getLocations()
    {
        $key = $this->getCacheKey("locations");
        if (!Cache::has($key)) {
            $events = $this->getEvents();
            $locations = [];
            foreach ($events->all() as $event) {
                if (!in_array($event->location, $locations)) {
                    array_push($locations, $event->location);
                }
            }
            Cache::put($key, $locations);
            return $locations;
        }
        return Cache::get($key);
    }

    public function getDayTimes()
    {
        $key = $this->getCacheKey("dayTimes");
        if (!Cache::has($key)) {
            $events = $this->getEvents();
            $dayTimes = [];
            foreach ($events->all() as $event) {
                if (!in_array($event->dayTime, $dayTimes)) {
                    array_push($dayTimes, $event->dayTime);
                }
            }
            Cache::put($key, $dayTimes);
            return $dayTimes;
        }
        return Cache::get($key);
    }

    public function getScheduleRules()
    {
        $key = $this->getCacheKey("ScheduleRules");
        if (!Cache::has($key)) {
            $rules = $this->rules()->where('type', 'Schedule')->get();
            Cache::put($key, $rules);
            return $rules;
        }
        return Cache::get($key);
    }

    public function getScheduleTodos()
    {
        $key = $this->getCacheKey("ScheduleTodos");
        if (!Cache::has($key)) {
            $todos = $this->todos()->where('type', 'Schedule')->get();
            Cache::put($key, $todos);
            return $todos;
        }
        return Cache::get($key);
    }

    public function getCreditTodos()
    {
        $key = $this->getCacheKey("CreditTodos");
        if (!Cache::has($key)) {
            $todos = $this->todos()->where('type', 'Credit')->get();
            Cache::put($key, $todos);
            return $todos;
        }
        return Cache::get($key);
    }

    public function getFoci()
    {
        $key = $this->getCacheKey("Foci");
        if (!Cache::has($key)) {
            $foci = $this->foci()->with('requiredModules', 'optionalModules')->get();
            Cache::put($key, $foci);
            return $foci;
        }
        return Cache::get($key);
    }

    public function getScheduleTour()
    {
        $key = $this->getCacheKey("ScheduleTour");
        if (!Cache::has($key)) {
            $tour = isset($this->tour["schedule"]) ? $this->tour["schedule"] : null;
            Cache::put($key, $tour);
            return $tour;
        }
        return Cache::get($key);
    }

    private function getCacheKey($name)
    {
        return "planer/" . $this->slug . "/" . $name;
    }
}
