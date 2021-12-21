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

    public function plans()
    {
        return $this->hasMany(Plan::class);
    }

    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    public function modules()
    {
        return $this->hasMany(Module::class);
    }

    public function timeSlots()
    {
        return $this->hasMany(TimeSlot::class);
    }

    public function rules()
    {
        return $this->hasMany(Rule::class);
    }


    /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions() : SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }
}
