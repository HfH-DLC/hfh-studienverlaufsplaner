<?php

namespace App\Http\Controllers;

use App\Http\Resources\PlanerResource;
use App\Models\Planer;

use Inertia\Inertia;

class OverviewController extends Controller
{
    function show(Planer $planer)
    {
        $planer->load('categories.modules.events');
        return Inertia::render('Overview', ['planerResource' => new PlanerResource($planer)]);
    }
}
