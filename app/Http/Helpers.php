<?php

use App\Http\Resources\CategoryResource;
use App\Http\Resources\FocusResource;
use App\Http\Resources\PlanResource;
use App\Http\Resources\RuleResource;
use App\Http\Resources\TodoResource;
use App\Models\Plan;
use App\Models\Planer;

function getScheduleData(Planer $planer, Plan $plan)
{
    $plan->load(
        'locations',
        'dayTimes',
        'placements',
        'placements.dayTime',
        'placements.location',
        'focusSelections',
        'focusSelections.focus',
        'focusSelections.focus.requiredModules',
        'focusSelections.focus.requiredModules.events',
        'focusSelections.focus.requiredModules.events.location',
        'focusSelections.focus.requiredModules.events.dayTime',
        'focusSelections.focus.optionalModules.events',
        'focusSelections.focus.optionalModules.events',
        'focusSelections.focus.optionalModules.events.location',
        'focusSelections.focus.optionalModules.events.dayTime'
    );
    $planResource = new PlanResource($plan);
    $categoriesResource = CategoryResource::collection($plan->getCategoriesWithAllModules());
    $rulesResource = RuleResource::collection($planer->getScheduleRules());
    $todosResource = TodoResource::collection($planer->getScheduleTodos());
    $fociResource = FocusResource::collection($planer->getFoci());
    $tour = $planer->getScheduleTour();

    $props = [
        'planerName' => $planer->name,
        'planerSlug' => $planer->id,
        'planResource' => $planResource,
        'categoriesResource' => $categoriesResource,
        'focusSelectionEnabled' => $planer->focus_selection_enabled,
        'fociResource' => $fociResource,
        'rulesResource' => $rulesResource,
        'todosResource' => $todosResource,
        'requiredECTS' => $planer->required_ects,
        'tourData' => $tour,
    ];

    return $props;
}
