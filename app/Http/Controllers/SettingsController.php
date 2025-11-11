<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        $themes = collect(config('themes'))->map(fn($theme, $key) => [
            'key' => $key,
            'name' => $theme['name'],
        ])->values();

        return Inertia::render('settings/index', [
            'themes' => $themes,
            'currentTheme' => request()->cookie('theme', env('THEME_DEFAULT', 'default')),
        ]);
    }

    public function customTheme()
    {
        $themes = collect(config('themes'))->map(fn($theme, $key) => [
            'key' => $key,
            'name' => $theme['name'],
        ])->values();

        return Inertia::render('settings/custom-theme', [
            'themes' => $themes,
            'currentTheme' => request()->cookie('theme', env('THEME_DEFAULT', 'default')),
        ]);
    }

    public function updateTheme(Request $request)
    {
        $request->validate([
            'theme' => 'required|string|in:' . implode(',', array_keys(config('themes'))),
        ]);

        return redirect()->back()->cookie('theme', $request->theme, 60 * 24 * 365);
    }
}
