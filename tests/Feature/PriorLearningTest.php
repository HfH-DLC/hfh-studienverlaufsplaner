<?php

namespace Tests\Feature;

use App\Models\Module;
use App\Models\Plan;
use App\Models\Planer;
use App\Models\PriorLearning;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class PriorLearningTest extends TestCase
{
    use RefreshDatabase;
    /**
     * @test
     */
    public function can_show_prior_learning_page()
    {
        $planer = Planer::factory()->create();
        $plan = Plan::factory()->for($planer)->create();
        $url = "/$planer->id/$plan->slug/vorleistungen";

        $response = $this->get($url);
        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page->component("PriorLearning"));
    }

    /**
     * @test
     */
    public function can_update_prior_learnings()
    {
        $planer = Planer::factory()->create();
        $plan = Plan::factory()->for($planer)->create();
        $module1 = Module::factory()->create(['id' => 'module1Id']);
        $module2 = Module::factory()->create(['id' => 'module2Id']);
        $priorLearning = PriorLearning::factory()->create([
            'name' => 'some_name', 'ects' => 3, 'counts_as_module_id' => null, 'plan_id' => $plan->id
        ]);
        $url = "/$planer->id/$plan->slug/vorleistungen";

        $params = ['priorLearnings' => [
            array('name' => 'test1', 'ects' => 5, 'countsAsModuleId' => $module1->id),
            array('id' => $priorLearning->id, 'name' => 'test2', 'ects' => 10, 'countsAsModuleId' => $module2->id)
        ]];

        $response = $this->put($url, $params);

        $response->assertSuccessful();
        $plan = $plan->fresh();
        $this->assertEquals(2, $plan->priorLearnings->count());
        $this->assertEquals(1, $plan->priorLearnings->where('name', 'test1')->where('ects', 5)->where('counts_as_module_id', $module1->id)->count());
        $this->assertEquals(1, $plan->priorLearnings->where('id', $priorLearning->id)->where('name', 'test2')->where('ects', 10)->where('counts_as_module_id', $module2->id)->count());
    }
}
