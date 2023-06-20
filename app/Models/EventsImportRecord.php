<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventsImportRecord extends Model
{
    use HasFactory;

    public static function getNewestImportedYear()
    {
        return self::getYears()->last();
    }

    public static function getOldestImportYear()
    {
        return self::getYears()->first();
    }

    private static function getYears()
    {
        return EventsImportRecord::orderBy('year', 'asc')->groupBy('year')->pluck('year');
    }
}
