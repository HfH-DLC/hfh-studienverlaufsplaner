<?php

namespace App\Http\Resources;

use App\Models\FocusSelection;
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
            'placements' => PlacementResource::collection($this->whenLoaded('placements')),
            'startYear' => $this->start_year,
            'scheduleTourCompleted' => $this->schedule_tour_completed,
            'creditTourCompleted' => $this->credit_tour_completed,
            'focusSelections' => FocusSelectionResource::collection($this->focusSelections)
        ];
    }
}
