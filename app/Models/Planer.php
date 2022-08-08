<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Planer extends Model
{
    use HasFactory;

    protected $casts = [
        'required_credits' => 'integer',
    ];

    public function plans()
    {
        return $this->hasMany(Plan::class);
    }

    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    public function getModulesForPlan(Plan $plan)
    {
        $years = array();
        $numberOfYears = 4;
        for ($i = 0; $i < $numberOfYears; $i++) {
            $years[] = $plan->start_year + $i;
        }

        $filter = function ($query) use ($years) {
            $query->whereIn('year', $years);
        };

        $modules = new \Illuminate\Database\Eloquent\Collection;

        foreach ($this->categories()->get() as $category) {
            $categoryModules = $category->modules()->with(['events' => $filter])
                ->whereHas('events', $filter)
                ->get();
            $modules = $modules->merge($categoryModules);
        }

        return $modules;
    }

    public function foci()
    {
        return $this->hasMany(Focus::class);
    }
}
