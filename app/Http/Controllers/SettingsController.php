<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateSettingsRequest;
use App\Http\Resources\DayTimeResource;
use App\Http\Resources\LocationResource;
use App\Http\Resources\PlanResource;
use App\Models\Plan;
use App\Models\Planer;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SettingsController extends Controller
{
    function show(Planer $planer, Plan $plan)
    {
        $props = [
            'planerName' => $planer->name,
            'planerSlug' => $planer->id,
            'planResource' => new PlanResource($plan),
            'locationsResource' => LocationResource::collection($planer->getLocations()),
            'dayTimesResource' => DayTimeResource::collection($planer->getDayTimes())
        ];
        if (isset($planer->meta)) {
            if (isset($planer->meta['brochureUrl'])) {
                $props['brochureUrl'] = $planer->meta['brochureUrl'];
            }
            if (isset($planer->meta['moduleDirectoryUrl'])) {
                $props['moduleDirectoryUrl'] = $planer->meta['moduleDirectoryUrl'];
            }
        }
        return Inertia::render('Settings', $props);
    }

    function update(UpdateSettingsRequest $request, Planer $planer, Plan $plan)
    {
        $validated = $request->validated();
        DB::transaction(function () use ($plan, $validated) {
            if (array_key_exists('dayTimes', $validated)) {
                $plan->dayTimes()->sync($validated["dayTimes"]);
            }
            if (array_key_exists('locations', $validated)) {
                $plan->locations()->sync($validated["locations"]);
            }
        });
        return response()->noContent();
    }
}
