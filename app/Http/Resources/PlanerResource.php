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
        $categories = $this->categories()->with(['modules', 'modules.events' => function ($q) {
            $q->where('planer_id', $this->id);
        }])->get();

        return [
            'name' => $this->name,
            'slug' => $this->id,
            'focusSelectionEnabled' => $this->focus_selection_enabled,
            'categories' => CategoryResource::collection($categories),
            'requiredECTS' => $this->required_ects,
            'rules' => $this->rules,
            'meta' => $this->meta
        ];
    }
}
