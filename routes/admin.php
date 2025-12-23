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

        Route::get('/links', [LinkManagementController::class, 'index'])->name('links.index');
        Route::post('/links', [LinkManagementController::class, 'store'])->name('links.store');
        Route::put('/links/{link}', [LinkManagementController::class, 'update'])->name('links.update');
        Route::delete('/links/{link}', [LinkManagementController::class, 'destroy'])->name('links.destroy');
        Route::post('/links/reorder', [LinkManagementController::class, 'reorder'])->name('links.reorder');

        Route::get('/info', [InfoPageManagementController::class, 'edit'])->name('info.index');
        Route::put('/info', [InfoPageManagementController::class, 'update'])->name('info.update');

        // Admin specific routes can be registered here.
    });
