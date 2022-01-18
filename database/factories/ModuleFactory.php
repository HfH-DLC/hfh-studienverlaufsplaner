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
            'number' => $this->faker->regexify('[A-Za-z0-9]{'.mt_rand(2, 10).
                '}'),
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
