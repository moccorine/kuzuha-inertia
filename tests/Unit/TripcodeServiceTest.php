<?php

use App\Services\TripcodeService;

test('tripcode data is returned when username contains secret', function () {
    $service = new TripcodeService;
    $result = $service->resolve('Alice#secret');

    expect($result['name'])->toBe('Alice')
        ->and($result['trip'])->not->toBeNull();
});

test('same secret yields same trip fragment', function () {
    $service = new TripcodeService;

    $first = $service->resolve('Bob#shared');
    $second = $service->resolve('Bob#shared');

    expect($first['trip'])->toBe($second['trip']);
});

test('empty secret removes delimiter', function () {
    $service = new TripcodeService;

    $result = $service->resolve('Carol#');

    expect($result['name'])->toBe('Carol')
        ->and($result['trip'])->toBeNull();
});

test('username without secret stays untouched', function () {
    $service = new TripcodeService;

    $result = $service->resolve('Dave');

    expect($result['name'])->toBe('Dave')
        ->and($result['trip'])->toBeNull();
});
