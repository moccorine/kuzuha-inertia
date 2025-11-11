<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class InstallController extends Controller
{
    public function index()
    {
        // すでにインストール済みならリダイレクト
        if (Setting::get('admin_password')) {
            return redirect('/');
        }

        return Inertia::render('install/index');
    }

    public function store(Request $request)
    {
        $request->validate([
            'password' => 'required|min:6|confirmed',
        ]);

        Setting::set('admin_password', Hash::make($request->password));
        Setting::set('counter', 0);
        Setting::set('installed_at', now()->toDateTimeString());

        return redirect('/')->with('success', 'Installation completed successfully');
    }
}
