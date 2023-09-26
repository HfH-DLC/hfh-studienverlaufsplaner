<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdatePriorLearningsRequest;
use App\Http\Resources\PriorLearningResource;
use App\Models\Plan;
use App\Models\Planer;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PriorLearningController extends Controller
{
    function show(Planer $planer, Plan $plan)
    {
        $props = getScheduleData($planer, $plan);

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
        $isScheduleValid = $validated['isScheduleValid'];
        DB::transaction(function () use ($priorLearningsData, $isScheduleValid, $plan) {
            $ids = [];
            foreach ($priorLearningsData as $data) {
                $id = isset($data['id']) ? $data['id'] : null;
                $priorLearning = $plan->priorLearnings()->firstOrNew(['id' => $id]);
                if (isset($data['name'])) {
                    $priorLearning->name = $data['name'];
                }
                if (isset($data['countsAsModuleId'])) {
                    $priorLearning->counts_as_module_id = $data['countsAsModuleId'];
                }
                if (isset($data['countsAsCategoryId'])) {
                    $priorLearning->counts_as_category_id = $data['countsAsCategoryId'];
                }
                if (isset($data['ects'])) {
                    $priorLearning->ects = $data['ects'];
                }
                $priorLearning->save();
                $ids[] = $priorLearning->id;
            }
            $plan->priorLearnings()->whereNotIn('id', $ids)->delete();
            $plan->schedule_valid = $isScheduleValid;
            $plan->save();
        });
        return response()->json(PriorLearningResource::collection($plan->priorLearnings));
    }
}
