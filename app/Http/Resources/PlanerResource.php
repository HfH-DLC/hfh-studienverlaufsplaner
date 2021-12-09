<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PlanerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'name' => $this->name,
            'slug' => $this->slug,
            'categories' => CategoryResource::collection($this->categories),
            'timeSlots' => TimeSlotResource::collection($this->timeSlots),
            'modules' => ModuleResource::collection($this->modules),
            'rules' => RuleResource::collection($this->rules)
        ];
    }
}
