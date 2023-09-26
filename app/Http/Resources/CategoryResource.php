<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
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
            'id' => $this->id,
            'name' => $this->name,
            'required' => $this->required,
            'minECTS' => $this->min_ects,
            'maxECTS' => $this->max_ects,
            'modules' => ModuleResource::collection($this->whenLoaded('modules')),
            'selectableForPriorLearning' => $this->selectable_for_prior_learning
        ];
    }
}
