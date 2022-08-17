<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Hashids\Hashids;
use Illuminate\Database\Eloquent\Collection;

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

    public function selectedModules()
    {
        return $this->belongsToMany(Module::class);
    }

    public function setSlug($value)
    {
        if (empty($value)) {
            $this->attributes['slug'] = null;
        } else {
            $this->attributes['slug'] = $value;
        }
    }

    public function getFocusModules()
    {
        $focusModules = collect();
        foreach ($this->focusSelections as $focusSelection) {
            $focusModules = $focusModules->merge($focusSelection->getAllModules());
        }
        return $focusModules;
    }

    public function getCreditableModules()
    {
        $flexCreditableModules = collect();
        $flexCreditableModules = $flexCreditableModules->merge($this->selectedModules);
        $categories = $this->planer->getCategoriesForPlan($this)->where('module_selection_enabled', false)->all();
        foreach ($categories as $category) {
            $flexCreditableModules = $flexCreditableModules->merge($category->modules);
        }
        foreach ($flexCreditableModules as $module) {
            $focusSelection = $this->focusSelections()->whereRelation('creditedModules', 'id', $module->id)->first();
            $module->credited_against = $focusSelection;
            $module->fixed_credit = false;
        }
        $fixedCreditableModules = collect();
        foreach ($this->focusSelections as $focusSelection) {
            $modules = $focusSelection->focus->requiredModules->merge($focusSelection->selectedRequiredModules);
            foreach ($modules as $module) {
                $module->credited_against = $focusSelection;
                $module->fixed_credit = true;
            }
            $fixedCreditableModules = $fixedCreditableModules->merge($modules);
        }
        return $flexCreditableModules->merge($fixedCreditableModules);
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
