<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PriorLearning extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'name', 'ects', 'counts_as_module_id',  'plan_id'];

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }
}
