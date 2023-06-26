<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PriorLearning extends Model
{
    use HasFactory;

    protected $fillable = ['id'];

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    public function getECTS()
    {
        if ($this->ects) {
            return $this->ects;
        }
        if ($this->counts_as_module_id) {
            $module = Module::findOrFail($this->counts_as_module_id);
            return $module->ects;
        }
        return null;
    }

    public function getCountsAsCategoryId()
    {
        if ($this->counts_as_category_id) {
            return $this->counts_as_category_id;
        }
        if ($this->counts_as_module_id) {
            $module = Module::findOrFail($this->counts_as_module_id);
            $planer = $this->plan->planer;
            $category = $planer->categories()->with([
                'modules' => function ($query) use ($module) {
                    $query->where('id', $module->id);
                }
            ])->first();
            if ($category) {
                return $category->id;
            }
        }
        return null;
    }
}
