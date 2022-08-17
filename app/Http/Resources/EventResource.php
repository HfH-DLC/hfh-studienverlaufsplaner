<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
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
            'year' => intval($this->year),
            'semester' => $this->semester,
            'timeWindow' => $this->time_window,
            'day' => $this->day,
            'time' => $this->time,
            'location' => $this->location,
        ];
    }
}
