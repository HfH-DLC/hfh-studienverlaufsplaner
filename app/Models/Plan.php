<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Hashids\Hashids;
use Illuminate\Support\Facades\Cache;

class Plan extends Model
{
    use HasFactory;

    protected $casts = ['start_year' => 'integer', 'schedule_tour_completed' => 'boolean', 'credit_tour_completed' => 'boolean',  'read_only' => 'boolean', 'schedule_valid' => 'boolean'];

    public function planer()
    {
        return $this->belongsTo(Planer::class);
    }

    public function placements()
    {
        return $this->hasMany(Placement::class);
    }

    public function dayTimes()
    {
        return $this->belongsToMany(DayTime::class);
    }

    public function focusSelections()
    {
        return $this->hasMany(FocusSelection::class);
    }

    public function locations()
    {
        return $this->belongsToMany(Location::class);
    }

    public function priorLearnings()
    {
        return $this->hasMany(PriorLearning::class);
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

        $focus_ids = $this->focusSelections()->get()->pluck('focus_id');
        $focusModuleIds = Module::whereHas('foci', function ($q) use ($focus_ids) {
            $q->whereIn('id', $focus_ids);
        })->pluck('id');
        $allowedPriorLearningModuleIds = $this->priorLearnings()->whereIn('counts_as_module_id', $focusModuleIds)->pluck('counts_as_module_id')->all();
        $query = function ($query) use ($placedModuleIds, $allowedPriorLearningModuleIds) {
            $query->where('creditable', true);
            $query->whereIn('id', array_merge($placedModuleIds, $allowedPriorLearningModuleIds));
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
        $key = $this->getCacheKey("categoriesWithAllModules");
        if (!Cache::has($key)) {
            $filter = $this->getFilter();
            $categories = $this->planer->categories()->with([
                'modules' => function ($query) use ($filter) {
                    $query->whereHas('events', $filter);
                },
                'modules.events' => $filter,
                'modules.events.location',
                'modules.events.dayTime',
                'modules.prerequisites',
            ])->get()->sortBy('position');
            Cache::put($key, $categories);
            return $categories;
        }
        return Cache::get($key);
    }

    private function getFilter()
    {
        $years = [];
        $numberOfYears = 4;
        for ($i = 0; $i < $numberOfYears; $i++) {
            $years[] = $this->start_year + $i;
        }
        return function ($query) use ($years) {
            $query->where('planer_id', $this->planer->id);
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
            $hashids = new Hashids(config('app.name'), 7, 'abcdefghijklmnopqrstuvwxyz1234567890');
            $slug = $hashids->encode($plan->id);
            $plan->slug = $slug;
            $plan->save();
        });
    }

    private function getCacheKey($name)
    {
        return "plan/" . $this->id . "/" . $name;
    }
}
