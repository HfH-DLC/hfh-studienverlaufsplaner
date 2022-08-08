<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Credit extends Model
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

    public function focus()
    {
        return $this->belongsTo(Focus::class);
    }

    protected $casts = ['plan_id' => 'integer'];
}
