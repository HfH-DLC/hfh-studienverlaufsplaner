<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Planer extends Model
{
    use HasFactory;
    use HasSlug;

    protected $casts = [
        'required_credits' => 'integer',
    ];

    public function plans()
    {
        return $this->hasMany(Plan::class);
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }

    public function modules()
    {
        return $this->belongsToMany(Module::class);
    }


    /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function getModulesForPlan(Plan $plan)
    {
        $years = array();
        $numberOfYears = 4;

        for ($i = 0; $i < $numberOfYears; $i++) {
            $years[] = $plan->start_year + $i;
        }
        return $this->modules()->whereHas('events', function ($q) use ($years) {
            $q->where('year', $years);
        })->get();
    }
}
