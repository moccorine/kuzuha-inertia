<?php

test('autolink helper converts http URLs to links', function () {
    $text = 'Check this out: http://example.com';
    $result = autolink($text);
    
    expect($result)->toContain('<a href="http://example.com"');
    expect($result)->toContain('target="_blank"');
    expect($result)->toContain('class="autolink"');
});

test('autolink helper converts https URLs to links', function () {
    $text = 'Visit https://example.com/path?query=1';
    $result = autolink($text);
    
    expect($result)->toContain('<a href="https://example.com/path?query=1"');
});

test('autolink helper converts ftp URLs to links', function () {
    $text = 'Download from ftp://files.example.com';
    $result = autolink($text);
    
    expect($result)->toContain('<a href="ftp://files.example.com"');
});

test('autolink helper preserves non-URL text', function () {
    $text = 'Hello world';
    $result = autolink($text);
    
    expect($result)->toBe('Hello world');
});

test('autolink helper handles multiple URLs', function () {
    $text = 'Visit http://example.com and https://test.com';
    $result = autolink($text);
    
    expect($result)->toContain('<a href="http://example.com"');
    expect($result)->toContain('<a href="https://test.com"');
});
