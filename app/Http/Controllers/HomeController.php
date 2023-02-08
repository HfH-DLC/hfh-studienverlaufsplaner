<?php

namespace App\Http\Controllers;

use App\Http\Resources\PlanerResource;
use App\Models\Planer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function show()
    {
        return Inertia::render('Home', [
            'planersResource' => PlanerResource::collection(Planer::all())
        ]);
    }
}
