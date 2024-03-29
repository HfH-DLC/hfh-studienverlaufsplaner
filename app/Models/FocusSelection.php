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

    public function getRequiredModules()
    {
        return $this->selectedRequiredModules->merge($this->focus->requiredModules);
    }

    public function creditedModules()
    {
        return $this->belongsToMany(Module::class, 'focus_selection_credited_module');
    }
}
