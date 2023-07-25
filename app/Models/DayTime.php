<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DayTime extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';


    protected $fillable = ['id', 'day', 'time', 'sort_index', 'default'];

    protected $casts = [
        'default' => 'boolean',
    ];

    public function plans()
    {
        return $this->belongsToMany(Plan::class);
    }
}
