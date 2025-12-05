<?php

use App\Models\Post;
use Inertia\Testing\AssertableInertia as Assert;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('can view posts index', function () {
    Post::create([
        'username' => 'testuser',
        'email' => 'test@example.com',
        'title' => 'Test Post',
        'message' => 'Check out https://example.com for more info',
        'metadata' => [
            'auto_link' => true,
        ],
    ]);

    $this->get(route('posts.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('posts/index')
            ->has('posts', 1, fn (Assert $page) => $page
                ->where('username', 'testuser')
                ->where('message', 'Check out https://example.com for more info')
                ->has('metadata', fn (Assert $page) => $page
                    ->where('auto_link', true)
                )
                ->etc()
            )
        );
});

test('can view posts with url metadata', function () {
    Post::create([
        'username' => 'testuser',
        'email' => 'test@example.com',
        'title' => 'Test Post',
        'message' => 'Test message',
        'metadata' => [
            'url' => 'https://example.com',
            'auto_link' => false,
        ],
    ]);

    $this->get(route('posts.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('posts/index')
            ->has('posts', 1, fn (Assert $page) => $page
                ->has('metadata', fn (Assert $page) => $page
                    ->where('url', 'https://example.com')
                    ->where('auto_link', false)
                )
                ->etc()
            )
        );
});
