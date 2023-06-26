<?php

namespace Tests\Unit;

use App\Models\Category;
use App\Models\Module;
use App\Models\Plan;
use App\Models\Planer;
use App\Models\PriorLearning;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class PriorLearningTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    public function it_returns_ects_if_set(): void
    {
        $priorLearning = new PriorLearning();
        $priorLearning->ects = 5;

        $this->assertEquals(5, $priorLearning->getECTS());
    }

    /** @test */
    public function it_returns_module_ects_if_set(): void
    {
        $priorLearning = new PriorLearning();
        $module = Module::factory()->create(['ects' => 10]);
        $priorLearning->counts_as_module_id = $module->id;

        $this->assertEquals(10, $priorLearning->getECTS());
    }

    /** @test */
    public function it_returns_category_id_if_set(): void
    {
        $priorLearning = new PriorLearning();
        $category = Category::factory()->create(['id' => 99, 'planer_id' => 1]);
        $priorLearning->counts_as_category_id = $category->id;

        $this->assertEquals($category->id, $priorLearning->getCountsAsCategoryId());
    }

    /** @test */
    public function it_returns_module_category_id_if_set(): void
    {
        $planer = Planer::factory()->create();
        $plan = Plan::factory()->for($planer)->create();
        $priorLearning = PriorLearning::factory()->create(['plan_id' => $plan->id]);
        $category = Category::factory()->create(['id' => 42, 'planer_id' => $planer->id]);
        $module = Module::factory()->create(['id' => 13]);
        $category->modules()->attach($module);
        $priorLearning->counts_as_module_id = $module->id;

        $this->assertEquals($category->id, $priorLearning->getCountsAsCategoryId());
    }
}
