<?php

use App\Http\Controllers\InstallController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\SettingsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('install')->name('install.')->group(function () {
    Route::get('/', [InstallController::class, 'index'])->name('index');
    Route::post('/', [InstallController::class, 'store'])->name('store');
});

Route::get('/', [PostController::class, 'index'])->name('home');
Route::get('/posts/{id}', [PostController::class, 'show'])->name('posts.show');
Route::get('/threads/{id}', [PostController::class, 'thread'])->name('posts.thread');
Route::get('/tree/{id}', [PostController::class, 'tree'])->name('posts.tree');
Route::get('/users/{username}/posts', [PostController::class, 'userPosts'])->name('users.posts');
Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
Route::delete('/posts/{id}/undo', [PostController::class, 'undo'])->name('posts.undo');

Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
Route::post('/settings/theme', [SettingsController::class, 'updateTheme'])->name('settings.theme');

// Theme switcher (for testing)
Route::get('/theme/{theme}', function ($theme) {
    if (!in_array($theme, ['default', 'dark'])) {
        abort(404);
    }
    return redirect()->back()->cookie('theme', $theme, 60 * 24 * 365);
})->name('theme.switch');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});
