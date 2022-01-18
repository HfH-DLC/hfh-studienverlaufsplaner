<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    use HasFactory;

    public function planer()
    {
        return $this->belongsTo(Planer::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function timeSlots()
    {
        return $this->belongsToMany(TimeSlot::class);
    }

    public function prerequisites()
    {
        return $this->belongsToMany('App\Models\Module', 'module_prerequisite', 'module_id', 'prerequisite_id');
    }

    public function dependencies()
    {
        return $this->belongsToMany('App\Models\Module', 'module_prerequisite', 'prerequisite_id', 'module_id');
    }

    protected $casts = [ 'category_id' => 'integer', 'credits' => 'integer' ];
}
