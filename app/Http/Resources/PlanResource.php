<?php

namespace App\Http\Resources;

use App\Models\Focus;
use Illuminate\Http\Resources\Json\JsonResource;

class PlanResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return   [
            'slug' => $this->slug,
            'placements' => PlacementResource::collection($this->placements),
            'startYear' => $this->start_year,
            'tourCompleted' => $this->tour_completed,
            'modules' =>  ModuleResource::collection($this->modules),
            'firstFocus' => new FocusResource(Focus::find($this->first_focus)),
            'secondFocus' => new FocusResource(Focus::find($this->second_focus))
        ];
    }
}
