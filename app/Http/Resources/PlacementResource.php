<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PlacementResource extends JsonResource
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
            'moduleId' => $this->module_id,
            'year' => intval($this->year),
            'semester' => $this->semester,
            'week' => $this->week,
            'day' => $this->day,
            'time' => $this->time,
            'location' => $this->location,
        ];
    }
}
