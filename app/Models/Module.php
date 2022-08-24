<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $casts = ['category_id' => 'integer', 'ects' => 'integer'];

    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }

    public function events()
    {
        return $this->hasMany(Event::class);
    }

    public function prerequisites()
    {
        return $this->belongsToMany('App\Models\Module', 'module_prerequisite', 'module_id', 'prerequisite_id');
    }

    public function dependencies()
    {
        return $this->belongsToMany('App\Models\Module', 'module_prerequisite', 'prerequisite_id', 'module_id');
    }

    public function plans()
    {
        return $this->belongsToMany(Plan::class);
    }

    public function foci()
    {
        return $this->belongsToMany(Focus::class);
    }
}
