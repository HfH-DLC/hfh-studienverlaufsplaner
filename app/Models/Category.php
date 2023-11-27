<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'position'];

    protected $casts = [
        'selectable_for_prior_learning' => 'boolean',
        'required' =>  'boolean'
    ];

    public function planer()
    {
        return $this->belongsTo(Planer::class);
    }

    public function modules()
    {
        return $this->belongsToMany(Module::class)->withPivot('position');
    }
}
