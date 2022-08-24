<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FocusCredit extends Model
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

    public function creditedModules()
    {
        return $this->belongsToMany(Module::class, 'focus_credit_credited_module');
    }
}
