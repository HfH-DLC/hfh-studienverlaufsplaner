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
            'requiredNumber' => $this->required_number,
            'moduleSelectionEnabled' => $this->module_selection_enabled,
            'minCredits' => $this->min_credits,
            'maxCredits' => $this->max_credits,
            'modules' => ModuleResource::collection($this->modules)
        ];
    }
}
