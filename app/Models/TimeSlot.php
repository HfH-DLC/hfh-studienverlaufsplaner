<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimeSlot extends Model
{
    use HasFactory;

    protected $fillable = ['year', 'semester', 'week', 'day', 'time'];

    public function planer()
    {
        return $this->belongsTo(Planer::class);
    }

    public function modules()
    {
        $this->belongsToMany(Module::class);
    }
}
