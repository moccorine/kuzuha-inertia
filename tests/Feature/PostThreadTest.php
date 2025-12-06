<?php

use App\Models\Post;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('can create follow up post with parent', function () {
    $parent = Post::create([
        'username' => 'Parent User',
        'message' => 'Original post',
    ]);

    $followUp = Post::createAsFollowUp([
        'username' => 'Follow User',
        'message' => 'Follow up post',
    ], $parent);

    $this->assertDatabaseHas('posts', [
        'id' => $followUp->id,
        'parent_id' => $parent->id,
        'thread_id' => $parent->id,
    ]);
});

test('follow up post inherits thread id from parent', function () {
    $root = Post::create([
        'username' => 'Root User',
        'message' => 'Root post',
    ]);

    $firstReply = Post::createAsFollowUp([
        'username' => 'First Reply',
        'message' => 'First reply',
    ], $root);

    $secondReply = Post::createAsFollowUp([
        'username' => 'Second Reply',
        'message' => 'Second reply',
    ], $firstReply);

    // All posts should share the same thread_id (root's id)
    expect($firstReply->thread_id)->toBe($root->id);
    expect($secondReply->thread_id)->toBe($root->id);
});

test('nested follow up posts maintain thread structure', function () {
    $root = Post::create(['username' => 'Root', 'message' => 'Root']);
    $reply1 = Post::createAsFollowUp(['username' => 'R1', 'message' => 'Reply 1'], $root);
    $reply2 = Post::createAsFollowUp(['username' => 'R2', 'message' => 'Reply 2'], $reply1);
    $reply3 = Post::createAsFollowUp(['username' => 'R3', 'message' => 'Reply 3'], $reply2);

    expect($reply1->parent_id)->toBe($root->id);
    expect($reply2->parent_id)->toBe($reply1->id);
    expect($reply3->parent_id)->toBe($reply2->id);

    expect($reply1->thread_id)->toBe($root->id);
    expect($reply2->thread_id)->toBe($root->id);
    expect($reply3->thread_id)->toBe($root->id);
});

test('follow up post includes reference metadata', function () {
    $parent = Post::create([
        'username' => 'Parent',
        'message' => 'Parent message',
    ]);

    $followUp = Post::createAsFollowUp([
        'username' => 'Child',
        'message' => 'Child message',
    ], $parent);

    expect($followUp->metadata)->not->toBeNull();
    expect($followUp->metadata)->toHaveKey('reference');
    expect($followUp->metadata['reference']['post_id'])->toBe($parent->id);
    expect($followUp->metadata['reference']['created_at'])->not->toBeNull();
});

test('follow up post preserves existing metadata', function () {
    $parent = Post::create([
        'username' => 'Parent',
        'message' => 'Parent message',
    ]);

    $followUp = Post::createAsFollowUp([
        'username' => 'Child',
        'message' => 'Child message',
        'metadata' => [
            'url' => 'https://example.com',
            'auto_link' => true,
        ],
    ], $parent);

    expect($followUp->metadata['url'])->toBe('https://example.com');
    expect($followUp->metadata['auto_link'])->toBeTrue();
    expect($followUp->metadata)->toHaveKey('reference');
});

test('resolve thread id returns null for nonexistent parent', function () {
    $threadId = Post::resolveThreadId(99999);

    expect($threadId)->toBeNull();
});

test('resolve thread id returns parent id when parent has no thread', function () {
    $parent = Post::create([
        'username' => 'Parent',
        'message' => 'Parent message',
    ]);

    $threadId = Post::resolveThreadId($parent->id);

    expect($threadId)->toBe($parent->id);
});

test('resolve thread id returns existing thread id', function () {
    $root = Post::create(['username' => 'Root', 'message' => 'Root']);
    $child = Post::createAsFollowUp(['username' => 'Child', 'message' => 'Child'], $root);

    $threadId = Post::resolveThreadId($child->id);

    expect($threadId)->toBe($root->id);
});
