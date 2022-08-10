<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class FocusResource extends JsonResource
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
            'modules' => ModuleResource::collection($this->modules)
        ];
    }
}
