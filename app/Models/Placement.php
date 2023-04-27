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
        return $this->belongsTo(Module::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function dayTime()
    {
        return $this->belongsTo(DayTime::class);
    }

    protected $casts = ['plan_id' => 'integer', 'year' => 'integer'];
}
