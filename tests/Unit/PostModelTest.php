<?php

use App\Models\Post;

test('get quoted message adds quote marks to each line', function () {
    $post = new Post(['message' => "Line 1\nLine 2\nLine 3"]);

    $quoted = $post->getQuotedMessage();

    expect($quoted)->toBe("> Line 1\n> Line 2\n> Line 3\n\n");
});

test('get quoted message removes double quotes', function () {
    $post = new Post(['message' => "> > Old quote\nNew content"]);

    $quoted = $post->getQuotedMessage();

    expect($quoted)->not->toContain('> > Old quote');
    expect($quoted)->toContain('> New content');
});

test('get quoted message keeps single quotes', function () {
    $post = new Post(['message' => "> Existing quote\nNew content"]);

    $quoted = $post->getQuotedMessage();

    expect($quoted)->toContain('> > Existing quote');
    expect($quoted)->toContain('> New content');
});

test('get quoted message converts links to text', function () {
    $post = new Post(['message' => 'Check <a href="https://example.com">this link</a> out']);

    $quoted = $post->getQuotedMessage();

    expect($quoted)->not->toContain('<a href=');
    expect($quoted)->toContain('> Check this link out');
});

test('get quoted message removes empty lines', function () {
    $post = new Post(['message' => "Line 1\n\n\nLine 2"]);

    $quoted = $post->getQuotedMessage();

    expect($quoted)->toBe("> Line 1\n> Line 2\n\n");
});

test('get quoted message removes empty quote lines', function () {
    $post = new Post(['message' => "Line 1\n   \nLine 2"]);

    $quoted = $post->getQuotedMessage();

    expect($quoted)->not->toContain(">   \n");
});

test('get quoted message adds trailing newlines', function () {
    $post = new Post(['message' => 'Single line']);

    $quoted = $post->getQuotedMessage();

    expect($quoted)->toEndWith("\n\n");
});

test('get quoted message handles empty message', function () {
    $post = new Post(['message' => '']);

    $quoted = $post->getQuotedMessage();

    expect($quoted)->toBe("> \n\n");
});

test('generate follow title uses username', function () {
    $post = new Post(['username' => 'Poster', 'title' => 'Original Title']);

    $followTitle = $post->generateFollowTitle();

    expect($followTitle)->toBe('＞Poster');
});

test('generate follow title strips html from username', function () {
    $post = new Post(['username' => '<b>Bold</b> User']);

    $followTitle = $post->generateFollowTitle();

    expect($followTitle)->toBe('＞Bold User');
});

test('generate follow title falls back when username missing', function () {
    $post = new Post(['username' => null]);

    $followTitle = $post->generateFollowTitle();

    expect($followTitle)->toBe('＞');
});
