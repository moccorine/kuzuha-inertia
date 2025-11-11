<?php

use App\Models\Post;
use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Set admin password to skip install middleware
    Setting::set('admin_password', bcrypt('password'));
    Setting::set('installed_at', now()->toDateTimeString());
});

test('index page displays posts', function () {
    Post::factory()->create([
        'id' => 1,
        'thread_id' => 1,
        'username' => 'Test User',
        'title' => 'Test Title',
        'body' => 'Test Body',
    ]);

    $response = $this->get('/');

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Posts/Index')
        ->has('posts.data', 1)
        ->where('posts.data.0.username', 'Test User')
        ->where('posts.data.0.title', 'Test Title')
        ->where('posts.data.0.body', 'Test Body')
    );
});

test('can create post', function () {
    $response = $this->from('/')->post('/posts', [
        'username' => 'New User',
        'email' => 'test@example.com',
        'title' => 'New Post',
        'body' => 'This is a new post',
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('posts', [
        'username' => 'New User',
        'title' => 'New Post',
        'body' => 'This is a new post',
    ]);
});

test('can create follow up post', function () {
    $parent = Post::factory()->create([
        'id' => 1,
        'thread_id' => 1,
    ]);

    $response = $this->from('/')->post('/posts', [
        'username' => 'Reply User',
        'email' => 'reply@example.com',
        'body' => 'This is a reply',
        'parent_id' => $parent->id,
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('posts', [
        'username' => 'Reply User',
        'body' => 'This is a reply',
        'parent_id' => $parent->id,
        'thread_id' => $parent->thread_id,
    ]);
});

test('pagination works correctly', function () {
    Post::factory()->count(50)->create();

    $response = $this->get('/?d=10');

    $response->assertInertia(fn (Assert $page) => $page
        ->component('Posts/Index')
        ->has('posts.data', 10)
        ->has('posts.links')
        ->where('posts.links.0.url', null) // First page, no previous
        ->has('posts.links.1.url') // Has next page
    );
});

test('next page link works', function () {
    Post::factory()->count(100)->create();

    $response = $this->get('/?d=10&page=2');

    $response->assertInertia(fn (Assert $page) => $page
        ->component('Posts/Index')
        ->has('posts.data', 10)
        ->has('posts.links')
    );
});

test('can undo own recent post', function () {
    // Create a post
    $response = $this->from('/')->post('/posts', [
        'username' => 'Test User',
        'email' => 'test@example.com',
        'title' => 'Test Post',
        'body' => 'This is a test post',
    ]);

    $response->assertRedirect();

    // Get the created post
    $post = Post::where('username', 'Test User')->first();
    expect($post)->not->toBeNull();
    expect($post->undo_token)->not->toBeNull();

    // Get undo cookie from response
    $undoCookie = $response->getCookie('undo_token');
    expect($undoCookie)->not->toBeNull();

    // Delete the post with cookie
    $response = $this->withCookie('undo_token', $undoCookie->getValue())
        ->delete("/posts/{$post->id}/undo");

    $response->assertRedirect();

    // Verify post is deleted
    $this->assertDatabaseMissing('posts', [
        'id' => $post->id,
    ]);
});

test('cannot undo other users post', function () {
    // Create a post
    $post = Post::factory()->create([
        'id' => 999,
        'thread_id' => 999,
        'undo_token' => \Illuminate\Support\Str::random(32),
    ]);

    // Try to delete without cookie
    $response = $this->from('/')->delete("/posts/{$post->id}/undo");

    $response->assertRedirect();
    $response->assertSessionHasErrors('error');

    // Verify post still exists
    $this->assertDatabaseHas('posts', [
        'id' => $post->id,
    ]);
});

test('cannot undo after time limit', function () {
    // Create a post
    $post = Post::factory()->create([
        'username' => 'Test User',
        'undo_token' => \Illuminate\Support\Str::random(32),
    ]);

    // Create expired undo cookie (6 minutes ago)
    $undoData = [
        'post_id' => $post->id,
        'token' => $post->undo_token,
        'created_at' => now()->subMinutes(6)->timestamp,
    ];
    $encryptedCookie = encrypt($undoData);

    // Try to delete with expired cookie
    $response = $this->from('/')->withCookie('undo_token', $encryptedCookie)
        ->delete("/posts/{$post->id}/undo");

    $response->assertRedirect();
    $response->assertSessionHasErrors('error');

    // Verify post still exists
    $this->assertDatabaseHas('posts', [
        'id' => $post->id,
    ]);
});

test('index page shows undo button for recent post', function () {
    // Create a post
    $this->from('/')->post('/posts', [
        'username' => 'Test User',
        'email' => 'test@example.com',
        'body' => 'Test post',
    ]);

    $post = Post::where('username', 'Test User')->first();
    expect($post)->not->toBeNull();

    // Check index page with session
    $response = $this->withSession([
        'last_post_id' => $post->id,
        'last_post_time' => now()->timestamp,
    ])->get('/');

    $response->assertInertia(fn (Assert $page) => $page
        ->component('Posts/Index')
        ->where('lastPostId', $post->id)
        ->has('lastPostTime')
    );
});
