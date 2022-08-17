<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = ['year', 'semester', 'time_window', 'day', 'time'];
    protected $casts = ['year' => 'integer'];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}
