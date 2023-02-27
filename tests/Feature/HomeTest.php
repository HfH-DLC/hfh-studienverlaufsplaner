<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class HomeTest extends TestCase
{
    use RefreshDatabase;
    /**
     * @test
     */
    public function can_show_home_page()
    {
        $response = $this->get('/');
        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page->component("Home")->has('planersResource', 1));
    }
}
