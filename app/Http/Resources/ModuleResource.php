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
            'credits' => $this->credits,
            'prerequisites' => PrerequisiteResource::collection($this->prerequisites),
            'events' => EventResource::collection($this->events),
            'creditableAgainstFocus' => $this->creditable_against_focus
        ];
    }
}
