<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ModuleResource extends JsonResource
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
            'id' => $this->id,
            'name' => $this->name,
            'number' => $this->number,
            'credits' => $this->credits,
            'category' => new CategoryResource($this->category),
            'prerequisites' => PrerequisiteResource::collection($this->prerequisites),
            'timeSlots' => TimeSlotResource::collection($this->timeSlots),
        ];
    }
}
