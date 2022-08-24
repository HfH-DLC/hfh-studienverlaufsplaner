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

    public function focusSelections()
    {
        return $this->hasMany(FocusSelection::class);
    }

    public function foci()
    {
        return $this->focusSelections()->get('focus');
    }

    public function setSlug($value)
    {
        if (empty($value)) {
            $this->attributes['slug'] = null;
        } else {
            $this->attributes['slug'] = $value;
        }
    }

    public function getCreditableModules()
    {
        return Module::whereIn('id', $this->placements->pluck('module_id'))->get();
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
