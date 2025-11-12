<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Create a user to pass CheckInstalled middleware
    User::factory()->create([
        'username' => 'admin',
        'email' => 'admin@example.com',
    ]);
});

test('login page can be rendered', function () {
    $response = $this->get('/login');

    $response->assertStatus(200);
});

test('users can authenticate using username', function () {
    $user = User::factory()->withoutTwoFactor()->create([
        'username' => 'testuser',
        'password' => bcrypt('password'),
    ]);

    $response = $this->post('/login', [
        'username' => 'testuser',
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect('/admin');
});

test('users cannot authenticate with invalid password', function () {
    $user = User::factory()->create([
        'username' => 'testuser',
        'password' => bcrypt('password'),
    ]);

    $this->post('/login', [
        'username' => 'testuser',
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('users cannot authenticate with invalid username', function () {
    $this->post('/login', [
        'username' => 'nonexistent',
        'password' => 'password',
    ]);

    $this->assertGuest();
});
