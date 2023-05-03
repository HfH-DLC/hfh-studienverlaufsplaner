<?php

namespace App\Http\Controllers;

use App\Http\Resources\DayTimeResource;
use App\Http\Resources\EventResource;
use App\Http\Resources\LocationResource;
use App\Http\Resources\PlanerResource;
use App\Models\Import;
use App\Models\Planer;

use Inertia\Inertia;

class ModuleFilterController extends Controller
{
    function show(Planer $planer)
    {
        return Inertia::render('ModuleFilter', ['planerResource' => new PlanerResource($planer), 'dayTimeResource' => DayTimeResource::collection($planer->getDayTimes()), 'eventsResource' => EventResource::collection($planer->getEvents()), 'locationsResource' => LocationResource::collection($planer->getLocations()), 'year' => Import::getNewestImportedYear()]);
    }
}
