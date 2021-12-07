<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Placement extends Model
{
    use HasFactory;

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    public function module()
    {
        return $this->hasOne(Module::class);
    }

    public function timeSlot()
    {
        return $this->hasOne(TimeSlot::class);
    }
}
