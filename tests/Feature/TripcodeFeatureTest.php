<?php

use App\Models\Post;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('tripcode metadata is stored when username contains secret', function () {
    $this->post(route('posts.store'), [
        'username' => 'Tester#secret',
        'message' => 'Hello world',
    ])->assertRedirect(route('posts.index'));

    $post = Post::first();

    expect($post->username)->toBe('Tester')
        ->and($post->metadata)
        ->toHaveKey('trip');
});
