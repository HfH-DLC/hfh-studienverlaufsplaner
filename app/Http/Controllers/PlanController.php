<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePlanRequest;
use App\Http\Requests\UpdateFocusCreditRequest;
use App\Http\Requests\UpdateScheduleRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\CreditableModuleResource;
use App\Http\Resources\FocusResource;
use App\Http\Resources\LocationResource;
use App\Http\Resources\PlanResource;
use App\Http\Resources\RuleResource;
use App\Http\Resources\TodoResource;
use App\Mail\PlanCreated;
use App\Models\FocusSelection;
use App\Models\Location;
use App\Models\Placement;
use App\Models\Plan;
use App\Models\Planer;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class PlanController extends Controller
{
    public function show(Planer $planer, Plan $plan)
    {
        return Redirect::route('plan-schedule', array('planer' => $planer, 'plan' => $plan->slug));
    }

    public function showSchedule(Planer $planer, Plan $plan)
    {
        $planResource = new PlanResource($plan->load('placements'));
        $categoriesResource = CategoryResource::collection($plan->getCategoriesWithAllModules());
        $rulesResource = RuleResource::collection($planer->rules()->where('type', 'Schedule')->get());
        $todosResource = TodoResource::collection($planer->todos()->where('type', 'Schedule')->get());
        $fociResource = FocusResource::collection($planer->foci()->get());
        $locationsResource = LocationResource::collection(Location::all());
        $tour = $tour = isset($planer->tour["schedule"]) ? $planer->tour["schedule"] : null;

        $props = array(
            'planerName' => $planer->name,
            'planerSlug' => $planer->slug,
            'planResource' => $planResource,
            'categoriesResource' => $categoriesResource,
            'focusSelectionEnabled' => $planer->focus_selection_enabled,
            'fociResource' => $fociResource,
            'rulesResource' => $rulesResource,
            'todosResource' => $todosResource,
            'locationsResource' => $locationsResource,
            'requiredECTS' => $planer->required_ects,
            'tourData' => $tour,
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
            'Schedule',
            $props
        );
    }

    public function showCredit(Planer $planer, Plan $plan)
    {
        $plan->load('focusSelections.focus');
        $planResource = new PlanResource($plan);
        $modules = $plan->getCreditableModules();
        foreach ($modules as $module) {
            $module->applyModifiers("credit");
        }
        $tour = isset($planer->tour["credit"]) ? $planer->tour["credit"] : null;


        $props = array(
            'planerName' => $planer->name,
            'planerSlug' => $planer->slug,
            'planResource' => $planResource,
            'creditableModulesResource' => CreditableModuleResource::collection($modules),
            'rulesResource' => RuleResource::collection($planer->rules()->where('type', 'credit')->get()),
            'todosResource' => TodoResource::collection($planer->todos()->where('type', 'credit')->get()),
            'tourData' => $tour,
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
        });

        Mail::to($validated['email'])
            ->queue(new PlanCreated($plan));
        return Redirect::route('plan', array('planer' => $planer, 'plan' => $plan->slug));
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
                    $placement->day = $placement_data['day'];
                    $placement->time = $placement_data['time'];
                    $placement->location = $placement_data['location'];
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
            if (Arr::exists($validated, 'locations')) {
                $plan->locations()->sync($validated['locations']);
            }
            $plan->schedule_tour_completed = $validated['tourCompleted'];
            $plan->schedule_valid = $validated['valid'];
            $plan->save();
        });

        return response()->noContent();
    }

    public function updateCredit(UpdateFocusCreditRequest $request, Planer $planer, Plan $plan)
    {
        $validated = $request->validated();
        $focusCredits = $validated['focusCredits'];
        DB::transaction(function () use ($focusCredits, $validated, $plan) {
            foreach ($focusCredits as $focusCredit) {
                $focusSelection = FocusSelection::findOrFail($focusCredit['focusSelectionId']);
                $focusSelection->creditedModules()->sync($focusCredit['moduleIds']);
                $focusSelection->save();
            }
            $plan->credit_tour_completed = $validated['tourCompleted'];
            $plan->credit_valid = $validated['valid'];
            $plan->save();
        });
        return response()->noContent();
    }
}
