<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(): Response
    {
        $themes = collect(config('themes'))->map(fn($theme, $key) => [
            'key' => $key,
            'name' => $theme['name'],
        ])->values();

        return Inertia::render('admin/settings/index', [
            'themes' => $themes,
            'currentTheme' => request()->cookie('theme', env('THEME_DEFAULT', 'default')),
        ]);
    }

    public function profile(Request $request): Response
    {
        return Inertia::render('admin/settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    public function updateProfile(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return redirect()->route('admin.settings.profile');
    }

    public function password(): Response
    {
        return Inertia::render('admin/settings/password');
    }

    public function updatePassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $request->user()->update([
            'password' => bcrypt($validated['password']),
        ]);

        return redirect()->route('admin.settings.password');
    }

    public function twoFactor(): Response
    {
        return Inertia::render('admin/settings/two-factor');
    }

    public function updateTheme(Request $request)
    {
        $request->validate([
            'theme' => 'required|string|in:' . implode(',', array_keys(config('themes'))),
        ]);

        return redirect()->back()->cookie('theme', $request->theme, 60 * 24 * 365);
    }
}
