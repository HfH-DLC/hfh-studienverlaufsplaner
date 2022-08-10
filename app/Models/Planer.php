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

    public function getCategoriesForPlan(Plan $plan)
    {
        $filter = $this->getYearFilterForPlan($plan);
        return $this->categories()->with(['modules' => function ($query) use ($filter, $plan) {
            $query->whereHas('events', $filter);
        }])->get();
    }

    public function foci()
    {
        return $this->hasMany(Focus::class);
    }
}
