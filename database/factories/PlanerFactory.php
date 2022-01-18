<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Module;
use App\Models\Planer;
use App\Models\TimeSlot;
use Illuminate\Database\Eloquent\Factories\Factory;

class PlanerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

        return [
            'name' => $this->faker->name(),
            'required_credits' => $this->faker->numberBetween(0, 500),
            'options_day' => array_slice($days, random_int(0, count($days)), random_int(1, count($days)))
        ];
    }

    public function withCategories(int $categories = 1)
    {
        return $this->afterCreating(function (Planer $planer) use ($categories) {
            Category::factory()->count($categories)->create([
                'planer_id' => $planer->id
            ]);
        });
    }

    public function withTimeSlots(int $timeSlots = 1)
    {
        return $this->afterCreating(function (Planer $planer) use ($timeSlots) {
            TimeSlot::factory()->forPlaner($planer)->count($timeSlots)->create();
        });
    }

    public function withModules(int $modules = 1)
    {
        return $this->afterCreating(function (Planer $planer) use ($modules) {
            $category = $this->faker->randomElement($planer->categories()->get());
            $timeSlots = $this->faker->randomElements($planer->timeSlots()->get(), random_int(1, count($planer->timeSlots()->get())));
            Module::factory()
            ->for($planer)
            ->withCategory($category)
            ->hasAttached($timeSlots)
            ->count($modules)
            ->create();
        });
    }
}
