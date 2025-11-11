<?php

use App\Models\Post;
use App\Models\User;

test('helper generates tripcode', function () {
    $tripcode = generate_tripcode('testpassword');
    
    expect($tripcode)->toStartWith('◆');
    expect(strlen($tripcode))->toBe(13); // ◆ (3 bytes) + 10 chars
});

test('helper processes username without hash', function () {
    $result = process_username_with_tripcode('TestUser');
    
    expect($result['name'])->toBe('TestUser');
    expect($result['tripcode'])->toBeNull();
});

test('helper processes username with tripcode', function () {
    $result = process_username_with_tripcode('TestUser#password123');
    
    expect($result['name'])->toBe('TestUser');
    expect($result['tripcode'])->toStartWith('◆');
    expect($result['tripcode'])->not->toBeNull();
});

test('same password generates same tripcode', function () {
    $tripcode1 = generate_tripcode('samepassword');
    $tripcode2 = generate_tripcode('samepassword');
    
    expect($tripcode1)->toBe($tripcode2);
});

test('different passwords generate different tripcodes', function () {
    $tripcode1 = generate_tripcode('password1');
    $tripcode2 = generate_tripcode('password2');
    
    expect($tripcode1)->not->toBe($tripcode2);
});
