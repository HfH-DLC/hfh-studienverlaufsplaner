<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Module;
use App\Models\Planer;
use App\Models\Event;
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
            'name' => 'Master Fake',
            'slug' => 'fake',
            'required_ects' => 100,
            'focus_selection_enabled' => false,
            'tour' => '{}',
            'meta' => [
                'brochureUrl' => 'example.com/brochure',
                'moduleDirectoryUrl' => 'example.com/moduleDirectory'
            ]
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

    public function withEvents(int $events = 1)
    {
        return $this->afterCreating(function (Planer $planer) use ($events) {
            Event::factory()->forPlaner($planer)->count($events)->create();
        });
    }

    public function withModules(int $modules = 1)
    {
        return $this->afterCreating(function (Planer $planer) use ($modules) {
            $category = $this->faker->randomElement($planer->categories()->get());
            $events = $this->faker->randomElements($planer->events()->get(), random_int(1, count($planer->events()->get())));
            Module::factory()
                ->for($planer)
                ->withCategory($category)
                ->hasAttached($events)
                ->count($modules)
                ->create();
        });
    }
}
