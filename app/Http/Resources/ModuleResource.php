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
            'ects' => $this->ects,
            'prerequisites' => PrerequisiteResource::collection($this->whenLoaded('prerequisites')),
            'events' => EventResource::collection($this->whenLoaded('events')),
            'creditable' => $this->creditable
        ];
    }
}
