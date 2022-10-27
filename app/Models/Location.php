<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';


    protected $fillable = ['id', 'name', 'default'];

    protected $casts = [
        'default' => 'boolean',
    ];
}
