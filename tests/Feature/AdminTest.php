<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use App\Models\User;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @test
     */
    public function can_show_login_page()
    {
        $response = $this->get('/admin/login');
        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page->component('Admin/Login'));
    }

    /**
     * @test
     */
    public function can_login_with_valid_credentials()
    {
        $credentials = ['email' => 'test@example.com', 'password' => 'test1234'];
        $user = User::factory()->create($credentials);
        $response = $this->post('/admin/login', $credentials);
        $response->assertSessionHasNoErrors();
        $response->assertRedirect('/admin/data');
        $this->assertAuthenticatedAs($user);
    }

    /**
     * @test
     */
    public function cannot_login_with_invalid_credentials()
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
    public function can_logout()
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
    public function does_redirect_unauthenticated_users_from_logout_to_login()
    {
        $response = $this->post('/admin/logout');
        $response->assertRedirect('/admin/login');
    }

    /**
     * @test
     */
    public function does_redirect_unauthenticated_users_from_admin_to_login()
    {
        $response = $this->get('/admin');
        $response->assertRedirect('/admin/login');
    }

    /**
     * @test
     */
    public function does_redirect_authenticated_users_from_admin_to_data()
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->get('/admin');
        $response->assertRedirect('/admin/data');
    }

    /**
     * @test
     */
    public function can_show_data_page()
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->get('admin/data');
        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Admin/Data'));
    }


    /**
     * @test
     */
    public function does_redirect_unauthenticated_users_from_data_to_login()
    {
        $response = $this->get('/admin/data');
        $response->assertRedirect('/admin/login');
    }
}
