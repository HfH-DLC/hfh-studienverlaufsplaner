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
            'id' => 'P_XY',
            'name' => 'Module XY',
            'ects' => 5,
            'creditable' => false,
        ];
    }
}
