<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'year' => $this->faker->year(),
            'semester' => $this->faker->randomElement(['HS', 'FS']),
        ];
    }

    public function forPlaner($planer)
    {
        return $this->state(function (array $attributes) use ($planer) {

            $result = [
                'planer_id' => $planer->id,
                'time_window' => $this->faker->randomElement($planer->options_time_window),
                'day' => $this->faker->randomElement($planer->options_day),
                'time' => $this->faker->randomElement($planer->options_time),
            ];
            return $result;
        });
    }
}
