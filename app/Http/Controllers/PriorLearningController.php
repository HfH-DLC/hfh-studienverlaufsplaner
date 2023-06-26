<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdatePriorLearningsRequest;
use App\Http\Resources\PlanResource;
use App\Models\Plan;
use App\Models\Planer;
use App\Models\PriorLearning;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PriorLearningController extends Controller
{
    function show(Planer $planer, Plan $plan)
    {
        $props = [
            'planerName' => $planer->name,
            'planerSlug' => $planer->id,
            'focusSelectionEnabled' => $planer->focus_selection_enabled,
            'planResource' => new PlanResource($plan),
        ];
        if (isset($planer->meta)) {
            if (isset($planer->meta['brochureUrl'])) {
                $props['brochureUrl'] = $planer->meta['brochureUrl'];
            }
            if (isset($planer->meta['moduleDirectoryUrl'])) {
                $props['moduleDirectoryUrl'] = $planer->meta['moduleDirectoryUrl'];
            }
        }
        return Inertia::render('PriorLearning', $props);
    }

    function update(UpdatePriorLearningsRequest $request, Planer $planer, Plan $plan)
    {
        $validated = $request->validated();
        $priorLearningsData = $validated['priorLearnings'];
        DB::transaction(function () use ($priorLearningsData, $plan) {
            foreach ($priorLearningsData as $data) {
                $id = isset($data['id']) ? $data['id'] : null;
                $priorLearning = $plan->priorLearnings()->firstOrNew(['id' => $id]);
                $priorLearning->name = $data['name'];
                $priorLearning->ects = $data['ects'];
                if (isset($data['countsAsModuleId'])) {
                    $priorLearning->counts_as_module_id = $data['countsAsModuleId'];
                }
                $priorLearning->save();
            }
        });
        return response()->noContent();
    }
}
