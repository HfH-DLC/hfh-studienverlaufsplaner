<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Hashids\Hashids;

class Plan extends Model
{
    use HasFactory;

    protected $casts = ['start_year' => 'integer', 'schedule_tour_completed' => 'boolean', 'credit_tour_completed' => 'boolean',  'read_only' => 'boolean', 'schedule_valid' => 'boolean',  'credit_valid' => 'boolean'];

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

    public function locations()
    {
        return $this->belongsToMany(Location::class);
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
        $placedModuleIds = $this->placements()->pluck('module_id')->all();
        $query = function ($query) use ($placedModuleIds) {
            $query->where('creditable', true);
            $query->whereIn('id', $placedModuleIds);
        };
        $modules = $this->planer->getModules($query);
        $modules = $modules->map(function ($module) {
            $focusSelectionId = $this->focusSelections()->whereHas('focus.requiredModules', function ($query) use ($module) {
                $query->where('id', $module->id);
            })->pluck('id')->first();
            if (!$focusSelectionId) {
                $focusSelectionId = $this->focusSelections()->whereHas('creditedModules', function ($query) use ($module) {
                    $query->where('id', $module->id);
                })->pluck('id')->first();
            } else {
                $module->required_credit = true;
            }
            $module->credited_against = $focusSelectionId;
            return $module;
        });
        return $modules;
    }

    public function getCategoriesWithAllModules()
    {
        $filter = $this->getFilter();
        return $this->planer->categories()->with([
            'modules' => function ($query) use ($filter) {
                $query->whereHas('events', $filter);
            },
            'modules.events' => $filter,
            'modules.prerequisites'
        ])->get()->sortBy('position');
    }

    private function getFilter()
    {
        $years = [];
        $numberOfYears = 4;
        for ($i = 0; $i < $numberOfYears; $i++) {
            $years[] = $this->start_year + $i;
        }
        return function ($query) use ($years) {
            $query->where('planer', $this->planer->slug);
            $query->whereIn('year', $years);
        };
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
