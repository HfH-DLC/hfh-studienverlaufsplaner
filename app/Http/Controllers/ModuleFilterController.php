<?php

namespace App\Http\Controllers;

use App\Http\Resources\LocationResource;
use App\Http\Resources\PlanerResource;
use App\Models\Import;
use App\Models\Location;
use App\Models\Planer;

use Inertia\Inertia;

class ModuleFilterController extends Controller
{
    function show(Planer $planer)
    {
        return Inertia::render('ModuleFilter', ['planerResource' => new PlanerResource($planer), 'locationsResource' => LocationResource::collection(Location::all()), 'year' => Import::getNewestImportedYear()]);
    }
}
