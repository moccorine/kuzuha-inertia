<?php

use App\Http\Controllers\InfoPageController;
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('posts', [PostController::class, 'index'])->name('posts.index');
Route::post('posts', [PostController::class, 'store'])->name('posts.store');
Route::get('posts/{post}/follow', [PostController::class, 'follow'])->name('posts.follow');
Route::get('posts/{post}/thread', [PostController::class, 'thread'])->name('posts.thread');
Route::get('posts/{user}/search', [PostController::class, 'search'])->name('posts.search');
Route::delete('posts/{post}', [PostController::class, 'destroy'])->name('posts.destroy');
Route::get('info', [InfoPageController::class, 'show'])->name('info');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
