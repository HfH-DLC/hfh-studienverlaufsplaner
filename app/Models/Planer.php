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
    ];

    public function plans()
    {
        return $this->hasMany(Plan::class);
    }

    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    private function getYearFilterForPlan($plan)
    {
        $years = array();
        $numberOfYears = 4;
        for ($i = 0; $i < $numberOfYears; $i++) {
            $years[] = $plan->start_year + $i;
        }

        return function ($query) use ($years) {
            $query->whereIn('year', $years);
        };
    }

    public function getCategoriesWithAllModules(Plan $plan)
    {
        $filter = $this->getYearFilterForPlan($plan);
        return $this->categories()->with(['modules' => function ($query) use ($filter) {
            $query->whereHas('events', $filter);
        }, 'modules.events', 'modules.prerequisites'])->get()->sortBy('position');
    }

    public function foci()
    {
        return $this->hasMany(Focus::class);
    }

    public function rules()
    {
        return $this->hasMany(Rule::class);
    }
}
