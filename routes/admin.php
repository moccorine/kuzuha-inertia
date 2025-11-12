<?php

use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\RestrictionController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\SystemController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
    Route::get('/restrictions', [RestrictionController::class, 'index'])->name('restrictions.index');
    Route::get('/system', [SystemController::class, 'index'])->name('system.index');
    Route::get('/system/information', [SystemController::class, 'information'])->name('system.information');
    Route::post('/system/information', [SystemController::class, 'updateInformation'])->name('system.information.update');
    Route::get('/system/links', [SystemController::class, 'links'])->name('system.links');
    Route::post('/system/links', [SystemController::class, 'storeLink'])->name('system.links.store');
    Route::patch('/system/links/{link}', [SystemController::class, 'updateLink'])->name('system.links.update');
    Route::delete('/system/links/{link}', [SystemController::class, 'deleteLink'])->name('system.links.delete');
    
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::get('/settings/profile', [SettingsController::class, 'profile'])->name('settings.profile');
    Route::patch('/settings/profile', [SettingsController::class, 'updateProfile'])->name('settings.profile.update');
    Route::get('/settings/password', [SettingsController::class, 'password'])->name('settings.password');
    Route::put('/settings/password', [SettingsController::class, 'updatePassword'])->name('settings.password.update');
    Route::get('/settings/two-factor', [SettingsController::class, 'twoFactor'])->name('settings.two-factor');
    Route::post('/settings/theme', [SettingsController::class, 'updateTheme'])->name('settings.theme');
});
