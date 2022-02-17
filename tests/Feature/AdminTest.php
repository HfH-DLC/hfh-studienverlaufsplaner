<?php

namespace Tests\Feature;

use App\Models\Planer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\Assert;
use App\Models\User;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @test
     */
    public function show_login_page()
    {
        $response = $this->get('/admin/login');
        $response->assertSuccessful();
        $response->assertInertia(fn (Assert $page) => $page->component('Admin/Login'));
    }

    /**
     * @test
     */
    public function login_with_valid_credentials()
    {
        $credentials = ['email' => 'test@example.com', 'password' => 'test1234'];
        $user = User::factory()->create($credentials);
        $response = $this->post('/admin/login', $credentials);
        $response->assertSessionHasNoErrors();
        $response->assertRedirect('/admin/planers');
        $this->assertAuthenticatedAs($user);
    }

    /**
     * @test
     */
    public function login_with_invalid_credentials()
    {
        User::factory()->create();
        $credentials = ['email' => 'test@example.com', 'password' => 'test1234'];
        $response = $this->post('/admin/login', $credentials);
        $response->assertSessionHasErrors();
        $response->assertRedirect('/');
        $this->assertGuest();
    }

    /**
     * @test
     */
    public function logout()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $this->assertAuthenticatedAs($user);
        $response = $this->post('/admin/logout');
        $response->assertRedirect('/admin/login');
        $this->assertGuest();
    }

    /**
     * @test
     */
    public function redirect_unauthenticated_users_from_logout_to_login()
    {
        $response = $this->post('/admin/logout');
        $response->assertRedirect('/admin/login');
    }

    /**
     * @test
     */
    public function redirect_unauthenticated_users_from_admin_to_login()
    {
        $response = $this->get('/admin');
        $response->assertRedirect('/admin/login');
    }

    /**
     * @test
     */
    public function redirect_authenticated_users_from_admin_to_planers()
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->get('/admin');
        $response->assertRedirect('/admin/planers');
    }

    /**
     * @test
     */
    public function show_planers_page()
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->get('admin/planers');
        $response->assertSuccessful();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Planers')
            ->has('planersResource', 1));
    }


    /**
     * @test
     */
    public function redirect_unauthenticated_users_from_planers_to_login()
    {
        $response = $this->get('/admin/planers');
        $response->assertRedirect('/admin/login');
    }

    /**
     * @test
     */
    public function show_categories_page()
    {
        $user = User::factory()->create();
        $planer = Planer::factory()->create();
        $response = $this->actingAs($user)->get("/admin/categories");
        $response->assertSuccessful();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Categories')
            ->has('categoriesResource'));
    }

    /**
     * @test
     */
    public function redirect_unauthenticated_users_from_categories_to_login()
    {
        $planer = Planer::factory()->create();
        $response = $this->get("/admin/categories");
        $response->assertRedirect('/admin/login');
    }

    /**
     * @test
     */
    public function show_modules_page()
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->get("/admin//modules");
        $response->assertSuccessful();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Modules')
            ->has('modulesResource')
            ->has('categoriesResource')
            ->has('eventsResource')
            ->has('planerName')
            ->has('planerSlug'));
    }

    /**
     * @test
     */
    public function redirect_unauthenticated_users_from_modules_to_login()
    {
        $response = $this->get("/admin/modules");
        $response->assertRedirect('/admin/login');
    }
}
