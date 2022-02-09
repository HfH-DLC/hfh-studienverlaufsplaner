<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rule extends Model
{
    use HasFactory;

    public static $types = [
        'ExcludeSemester'
    ];

    protected $casts = [
        'params' => 'array'
    ];
}
