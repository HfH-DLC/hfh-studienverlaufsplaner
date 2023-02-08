<?php

namespace App\Http\Controllers;

use App\Models\Import;
use App\Models\Planer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlanerController extends Controller
{
    public function show(Planer $planer)
    {
        $years = Import::orderBy('year', 'asc')->groupBy('year')->pluck('year')->toArray();
        $minYear = min($years);
        $maxYear = max($years);
        $allowedYears = range($minYear, $maxYear);

        $props =  array(
            'slug' => $planer->slug,
            'name' => $planer->name,
            'allowedYears' => $allowedYears
        );

        if (isset($planer->meta)) {
            if (isset($planer->meta['brochureUrl'])) {

                $props['brochureUrl'] = $planer->meta['brochureUrl'];
            }
            if (isset($planer->meta['moduleDirectoryUrl'])) {
                $props['moduleDirectoryUrl'] = $planer->meta['moduleDirectoryUrl'];
            }
        }

        return Inertia::render(
            'Planer',
            $props
        );
    }
}
