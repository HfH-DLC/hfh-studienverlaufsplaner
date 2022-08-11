<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FocusSelection extends Model
{
    use HasFactory;

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    public function focus()
    {
        return $this->belongsTo(Focus::class);
    }

    public function selectedOptionalModules()
    {
        return $this->belongsToMany(Module::class);
    }
}
