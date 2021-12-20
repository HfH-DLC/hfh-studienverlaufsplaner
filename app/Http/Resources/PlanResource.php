<?php

namespace App\Http\Resources;

use App\Models\Placement;
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
            'placements' => PlacementResource::collection($this->placements)
        ];
    }
}
