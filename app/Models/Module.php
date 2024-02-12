<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['id'];
    protected $casts = ['category_id' => 'integer', 'ects' => 'integer', 'modifiers' => 'array'];

    protected static function booted()
    {
        static::deleting(function ($module) {
            $module->categories()->detach();
            foreach ($module->events as $event) {
                $event->delete();
            }
        });
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }

    public function events()
    {
        return $this->hasMany(Event::class);
    }

    public function plans()
    {
        return $this->belongsToMany(Plan::class);
    }

    public function foci()
    {
        return $this->belongsToMany(Focus::class);
    }

    public function applyModifiers($page)
    {
        if (!isset($this->modifiers)) {
            return;
        }
        foreach ($this->modifiers as $modifier) {
            if (isset($modifier["page"]) && $modifier["page"] == $page) {
                foreach ($modifier["values"] as $key => $value) {
                    $this[$key] = $value;
                }
            }
        }
    }
}
