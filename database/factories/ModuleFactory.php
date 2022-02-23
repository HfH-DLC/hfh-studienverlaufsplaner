<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ModuleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'credits' => $this->faker->numberBetween(1, 500),
        ];
    }

    public function withCategory($category)
    {
        return $this->state(function (array $attributes) use ($category) {
            return [
                'category_id' => $category,
            ];
        });
    }
}
