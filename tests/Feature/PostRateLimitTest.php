<?php

use App\Models\Post;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    Cache::flush();
});

test('duplicate posts in the recent window are ignored', function () {
    config([
        'bbs.duplicate_check_count' => 30,
        'bbs.ip_post_interval' => 0,
        'bbs.min_post_interval' => 0,
    ]);

    $payload = [
        'username' => 'Tester',
        'message' => 'Same message body',
    ];

    $this->post(route('posts.store'), $payload)
        ->assertRedirect(route('posts.index'));

    $this->post(route('posts.store'), $payload)
        ->assertRedirect(route('posts.index'));

    expect(Post::count())->toBe(1);
});

test('rapid posts from the same ip are rate limited', function () {
    config([
        'bbs.ip_post_interval' => 30,
        'bbs.duplicate_check_count' => 0,
        'bbs.min_post_interval' => 0,
    ]);

    $payload = fn (string $message) => [
        'username' => 'Tester',
        'message' => $message,
    ];

    $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.10'])
        ->post(route('posts.store'), $payload('First post'))
        ->assertRedirect(route('posts.index'));

    $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.10'])
        ->post(route('posts.store'), $payload('Second post'))
        ->assertRedirect(route('posts.index'));

    expect(Post::count())->toBe(1);

    Carbon::setTestNow(now()->addSeconds(31));

    $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.10'])
        ->post(route('posts.store'), $payload('Third post'))
        ->assertRedirect(route('posts.index'));

    expect(Post::count())->toBe(2);

    Carbon::setTestNow();
});

test('minimum interval per session is enforced', function () {
    config([
        'bbs.min_post_interval' => 5,
        'bbs.ip_post_interval' => 0,
        'bbs.duplicate_check_count' => 0,
    ]);

    $payload = fn (string $message) => [
        'username' => 'Tester',
        'message' => $message,
    ];

    $this->post(route('posts.store'), $payload('First message'))
        ->assertRedirect(route('posts.index'));

    $this->post(route('posts.store'), $payload('Second message'))
        ->assertRedirect(route('posts.index'));

    expect(Post::count())->toBe(1);

    Carbon::setTestNow(now()->addSeconds(6));

    $this->post(route('posts.store'), $payload('Third message'))
        ->assertRedirect(route('posts.index'));

    expect(Post::count())->toBe(2);

    Carbon::setTestNow();
});
