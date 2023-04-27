<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = ['module_id', 'year', 'semester', 'time_window', 'day_time_id', 'location_id', 'planer'];
    protected $casts = ['year' => 'integer'];

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
}
