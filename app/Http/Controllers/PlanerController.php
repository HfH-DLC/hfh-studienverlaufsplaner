<?php

namespace App\Http\Controllers;

use App\Models\Import;
use App\Models\Planer;
use Inertia\Inertia;

class PlanerController extends Controller
{
    public function show(Planer $planer)
    {
        $allowedYears = range(Import::getOldestImportYear(), Import::getNewestImportedYear());

        $props =  array(
            'slug' => $planer->id,
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
