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
        'options_week' => 'array',
        'options_day' => 'array',
        'options_time' => 'array'
    ];

     /**
     * The model's default values for attributes.
     *
     * @var array
     */
    protected $attributes = [
        'options_week' => '["Wo 2, 3, 4, 5, 7, 8, 9, 11, 12, 13", "Wo 1, 6, 10, 14"]',
        'options_day' => '[]',
        'options_time' => '["Vormittag", "Nachmittag"]'
    ];

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
