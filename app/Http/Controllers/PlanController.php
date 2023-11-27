<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePlanRequest;
use App\Http\Requests\UpdateFocusCreditRequest;
use App\Http\Requests\UpdateScheduleRequest;
use App\Http\Resources\CreditableModuleResource;
use App\Http\Resources\PlanResource;
use App\Http\Resources\TodoResource;
use App\Mail\PlanCreated;
use App\Models\FocusSelection;
use App\Models\Placement;
use App\Models\Plan;
use App\Models\Planer;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class PlanController extends Controller
{
    public function show(Planer $planer, Plan $plan)
    {
        return Redirect::route('plan-schedule', ['planer' => $planer, 'plan' => $plan->slug]);
    }

    public function showSchedule(Planer $planer, Plan $plan)
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
        return Inertia::render(
            'Schedule',
            $props
        );
    }

    public function showCredit(Planer $planer, Plan $plan)
    {
        if (!$this->isCreditFeatureActive($planer, $plan)) {
            throw new NotFoundHttpException();
        }
        $plan->load('focusSelections.focus');
        $planResource = new PlanResource($plan);
        $modules = $plan->getCreditableModules();
        foreach ($modules as $module) {
            $module->applyModifiers("credit");
        }
        $tour = isset($planer->tour["credit"]) ? $planer->tour["credit"] : null;


        $props = [
            'planerName' => $planer->name,
            'planerSlug' => $planer->id,
            'focusSelectionEnabled' => $planer->focus_selection_enabled,
            'planResource' => $planResource,
            'creditableModulesResource' => CreditableModuleResource::collection($modules),
            'todosResource' => TodoResource::collection($planer->getCreditTodos()),
            'tourData' => $tour,
        ];

        if (isset($planer->meta)) {
            if (isset($planer->meta['brochureUrl'])) {

                $props['brochureUrl'] = $planer->meta['brochureUrl'];
            }
            if (isset($planer->meta['moduleDirectoryUrl'])) {
                $props['moduleDirectoryUrl'] = $planer->meta['moduleDirectoryUrl'];
            }
        }

        return Inertia::render(
            'Credit',
            $props
        );
    }

    public function store(StorePlanRequest $request, Planer $planer)
    {
        $validated = $request->validated();
        $plan = new Plan();
        $plan->email = $validated['email'];
        $plan->start_year = $validated['startYear'];
        DB::transaction(function () use ($plan, $planer) {
            $planer->plans()->save($plan);
            $plan->save();
            $plan->dayTimes()->saveMany(array_filter($planer->getDayTimes(), function ($dayTime) {
                return $dayTime->default;
            }));
            $plan->locations()->saveMany(array_filter($planer->getLocations(), function ($location) {
                return $location->default;
            }));
        });

        Mail::to($validated['email'])
            ->queue(new PlanCreated($plan));
        return Redirect::route('plan', ['planer' => $planer, 'plan' => $plan->slug]);
    }

    public function updateSchedule(UpdateScheduleRequest $request, Planer $planer, Plan $plan)
    {
        DB::transaction(function () use ($request, $planer, $plan) {
            $validated = $request->validated();
            if (Arr::exists($validated, 'placements')) {
                $placements_data = $validated['placements'];
                $placements_data = collect($placements_data);
                $plan->placements()->delete();
                $placements_data->each(function ($placement_data) use ($plan) {
                    $placement = new Placement();
                    $placement->year = $placement_data['year'];
                    $placement->semester = $placement_data['semester'];
                    $placement->time_window = $placement_data['timeWindow'];
                    $placement->day_time_id = $placement_data['dayTimeId'];
                    $placement->location_id = $placement_data['locationId'];
                    $placement->module()->associate($placement_data['moduleId']);
                    $plan->placements()->save($placement);
                });
            }
            if (Arr::exists($validated, 'focusSelections')) {
                $focusSelectionsData = $validated['focusSelections'];
                $plan->focusSelections()->whereNot(function ($q1) use ($focusSelectionsData) {
                    foreach ($focusSelectionsData as $focusSelectionData) {
                        $q1->orWhere(function ($q2) use ($focusSelectionData) {
                            $q2->where('position', $focusSelectionData['position'])->where('focus_id', $focusSelectionData['focusId']);
                        });
                    }
                })->delete();

                foreach ($focusSelectionsData as $focusSelectionData) {
                    $focusSelection = $plan->focusSelections()->where('position', $focusSelectionData['position'])->where('focus_id', $focusSelectionData['focusId'])->first();
                    if (!$focusSelection) {
                        $focusSelection = new FocusSelection();
                        $focusSelection->position = $focusSelectionData['position'];
                        $focusSelection->focus()->associate($planer->foci()->findOrFail($focusSelectionData['focusId']));
                        $plan->focusSelections()->save($focusSelection);
                    }
                    $focusSelection->save();
                }
            }
            $plan->schedule_tour_completed = $validated['tourCompleted'];
            $plan->schedule_valid = $validated['valid'];
            $plan->save();
        });

        return response()->noContent();
    }

    public function updateCredit(UpdateFocusCreditRequest $request, Planer $planer, Plan $plan)
    {
        if (!$this->isCreditFeatureActive($planer, $plan)) {
            throw new NotFoundHttpException();
        }
        $validated = $request->validated();
        $focusCredits = $validated['focusCredits'];
        DB::transaction(function () use ($focusCredits, $validated, $plan) {
            foreach ($focusCredits as $focusCredit) {
                $focusSelection = FocusSelection::findOrFail($focusCredit['focusSelectionId']);
                $focusSelection->creditedModules()->sync($focusCredit['moduleIds']);
                $focusSelection->save();
            }
            $plan->credit_tour_completed = $validated['tourCompleted'];
            $plan->save();
        });
        return response()->noContent();
    }

    private function isCreditFeatureActive(Planer $planer, Plan $plan)
    {
        return $planer->focus_selection_enabled && $plan->start_year < 2024;
    }
}
