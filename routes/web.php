<?php

use App\Http\Controllers\InstallController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\SettingsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('install')->name('install.')->group(function () {
    Route::get('/', [InstallController::class, 'index'])->name('index');
    Route::post('/', [InstallController::class, 'store'])->name('store');
});

Route::get('/', [PostController::class, 'index'])->name('home');
Route::get('/information', [PostController::class, 'information'])->name('information');
Route::get('/topics/{date?}', [PostController::class, 'topics'])->name('posts.topics');
Route::get('/tree', [PostController::class, 'treeIndex'])->name('posts.tree.index');
Route::get('/archive', [PostController::class, 'archive'])->name('posts.archive');
Route::get('/archive/search', [PostController::class, 'archiveSearch'])->name('posts.archive.search');
Route::get('/archive/{date}', [PostController::class, 'archiveByDate'])->name('posts.archive.date');

Route::get('/contact', [ContactController::class, 'index'])->name('contact.index');
Route::post('/contact', [ContactController::class, 'store'])
    ->middleware(\Spatie\Honeypot\ProtectAgainstSpam::class)
    ->name('contact.store');
Route::get('/contact/thanks', [ContactController::class, 'thanks'])->name('contact.thanks');

Route::get('/{url}', [PostController::class, 'informationByUrl'])->name('information.url')->where('url', '^(?!posts|threads|tree|archive|topics|users|settings|theme|install|admin|contact).*$');
Route::get('/posts/{id}', [PostController::class, 'show'])->name('posts.show');
Route::get('/threads/{id}', [PostController::class, 'thread'])->name('posts.thread');
Route::get('/tree/{id}', [PostController::class, 'tree'])->name('posts.tree');
Route::get('/users/{username}/posts', [PostController::class, 'userPosts'])->name('users.posts');
Route::post('/posts', [PostController::class, 'store'])
    ->middleware(\Spatie\Honeypot\ProtectAgainstSpam::class)
    ->name('posts.store');
Route::delete('/posts/{id}/undo', [PostController::class, 'undo'])->name('posts.undo');

Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
Route::get('/settings/custom-theme', [SettingsController::class, 'customTheme'])->name('settings.custom-theme');
Route::post('/settings/theme', [SettingsController::class, 'updateTheme'])->name('settings.theme');

// Theme switcher (for testing)
Route::get('/theme/{theme}', function ($theme) {
    if (!in_array($theme, ['default', 'dark', 'custom'])) {
        abort(404);
    }
    
    $cookie = cookie('theme', $theme, 60 * 24 * 365, '/', null, false, false);
    
    return redirect()->back()->withCookie($cookie);
})->name('theme.switch');

require __DIR__.'/admin.php';
