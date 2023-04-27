<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        $modules = collect();
        $withParam = ['modules'];
        if ($query !== NULL) {
            $withParam = ['modules' => $query];
        }
        foreach ($this->categories()->with($withParam)->get() as $category) {
            $modules = $modules->merge($category->modules);
        }
        return $modules;
    }

    public function getEvents()
    {
        $modules = $this->getModules();

        $events = collect();
        foreach ($modules->all() as $module) {
            $events = $events->merge($module->events);
        }
        return $events;
    }

    public function getLocations()
    {
        $events = $this->getEvents();
        $locations = collect();
        foreach ($events->all() as $event) {
            $locations->add($event->location);
        }
        return $locations->unique('id');
    }
}
