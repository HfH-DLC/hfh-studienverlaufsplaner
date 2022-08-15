<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class FocusSelectionResource extends JsonResource
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
            "id" => $this->id,
            "focus" => new FocusResource($this->focus),
            "selectedRequiredModules" => ModuleResource::collection($this->selectedRequiredModules),
            "creditModules" => ModuleResource::collection($this->creditedModules),
            "position" => $this->position
        ];
    }
}
