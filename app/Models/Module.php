<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    use HasFactory;

    protected $casts = ['category_id' => 'integer', 'credits' => 'integer'];

    public function planers()
    {
        return $this->belongsToMany(Planer::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
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
}
