<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Planer extends Model
{
    use HasFactory;

    protected $casts = [
        'required_ects' => 'integer',
        'focus_selection_enabled' => 'boolean',
    ];

    public function plans()
    {
        return $this->hasMany(Plan::class);
    }

    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    public function foci()
    {
        return $this->hasMany(Focus::class);
    }

    public function rules()
    {
        return $this->hasMany(Rule::class);
    }

    public function getModules($query)
    {
        $modules = collect();
        foreach ($this->categories()->with(['modules' => $query])->get() as $category) {
            $modules = $modules->merge($category->modules);
        }
        return $modules;
    }
}
