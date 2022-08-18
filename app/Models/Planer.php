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
        }])->get()->sortBy('position');
    }

    public function getCategoriesWithActiveModules(Plan $plan)
    {
        $filter = $this->getYearFilterForPlan($plan);
        $selectedModuleIds = $plan->selectedModules()->pluck('id')->toArray();
        $focusModuleIds = $plan->getFocusModules()->pluck('id')->toArray();

        $categoriesWithVariableModules = $this->categories()->where('module_selection_enabled', true)->with(['modules' => function ($query) use ($selectedModuleIds, $focusModuleIds, $filter) {
            $query->whereIn('id', array_merge($selectedModuleIds, $focusModuleIds))->whereHas('events', $filter);
        }, 'modules.events', 'modules.prerequisites'])->get();

        $categoriesWithFixModules = $this->categories()->where('module_selection_enabled', false)->with(['modules' => function ($query) use ($filter) {
            $query->whereHas('events', $filter);
        }, 'modules.events', 'modules.prerequisites'])->get();

        return $categoriesWithVariableModules->merge($categoriesWithFixModules)->filter(function ($value) {
            return $value->modules->count() > 0;
        })->sortBy('position');
    }

    public function foci()
    {
        return $this->hasMany(Focus::class);
    }
}
