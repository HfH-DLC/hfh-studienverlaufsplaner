<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Hashids\Hashids;

class Plan extends Model
{
    use HasFactory;

    protected $casts = ['start_year' => 'integer', 'tour_completed' => 'boolean'];

    public function planer()
    {
        return $this->belongsTo(Planer::class);
    }

    public function placements()
    {
        return $this->hasMany(Placement::class);
    }

    public function setSlug($value)
    {
        if (empty($value)) {
            $this->attributes['slug'] = null;
        } else {
            $this->attributes['slug'] = $value;
        }
    }

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::created(function ($plan) {
            $hashids = new Hashids(config('app.name'), 6);
            $slug = $hashids->encode($plan->id);
            $plan->slug = $slug;
            $plan->save();
        });
    }
}
