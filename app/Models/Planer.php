<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Planer extends Model
{
    use HasFactory;

    public function plans()
    {
        return $this->hasMany(Plan::class);
    }

    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    public function modules()
    {
        return $this->hasMany(Module::class);
    }

    public function timeSlots()
    {
        return $this->hasMany(TimeSlot::class);
    }

    public function rules()
    {
        return $this->hasMany(Rule::class);
    }
}
