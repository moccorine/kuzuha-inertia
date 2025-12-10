<?php

use App\Http\Controllers\ArchiveController;
use App\Http\Controllers\InfoPageController;
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [PostController::class, 'index'])->name('posts.index');
Route::post('/', [PostController::class, 'store'])->name('posts.store');
Route::get('posts/tree', [PostController::class, 'treeIndex'])->name('posts.tree.index');
Route::get('posts/{post}/follow', [PostController::class, 'follow'])->name('posts.follow');
Route::get('posts/{post}/thread', [PostController::class, 'thread'])->name('posts.thread');
Route::get('posts/{post}/tree', [PostController::class, 'tree'])->name('posts.tree');
Route::get('posts/{user}/search', [PostController::class, 'search'])->name('posts.search');
Route::delete('posts/{post}', [PostController::class, 'destroy'])->name('posts.destroy');
Route::get('info', [InfoPageController::class, 'show'])->name('info');
Route::get('archive', [ArchiveController::class, 'index'])->name('archive');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = request()->user();

        // Admin users are redirected to the admin dashboard
        if ($user?->hasRole('admin')) {
            return redirect()->route('admin.dashboard');
        }

        return Inertia::render('dashboard');
    })->name('dashboard');
});

// Admin dashboard route
Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('dashboard', function () {
            return Inertia::render('admin/dashboard');
        })->name('dashboard');
    });

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
