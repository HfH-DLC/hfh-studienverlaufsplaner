<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Focus extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $fillable = ['id'];
    protected $keyType = 'string';

    public function planer()
    {
        return $this->belongsTo(Planer::class);
    }

    public function modules()
    {
        return $this->belongsToMany(Module::class)->withPivot('required');
    }

    public function requiredModules()
    {
        return $this->belongsToMany(Module::class)->withPivot('required')->wherePivot('required', true);
    }

    public function optionalModules()
    {
        return $this->belongsToMany(Module::class)->withPivot('required')->wherePivot('required', false);
    }
}
