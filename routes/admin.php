<?php

use App\Http\Controllers\Admin\InfoPageManagementController;
use App\Http\Controllers\Admin\LinkManagementController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', function () {
            return redirect()->route('dashboard');
        })->name('index');

        Route::get('/links', LinkManagementController::class)->name('links.index');
        Route::get('/info', [InfoPageManagementController::class, 'edit'])->name('info.index');
        Route::put('/info', [InfoPageManagementController::class, 'update'])->name('info.update');

        // Admin specific routes can be registered here.
    });
