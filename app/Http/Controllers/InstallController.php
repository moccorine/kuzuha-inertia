<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class InstallController extends Controller
{
    public function index()
    {
        // すでにインストール済み（ユーザーが存在する）ならリダイレクト
        if (User::count() > 0) {
            return redirect('/');
        }

        return Inertia::render('install/index');
    }

    public function store(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:255|unique:users',
            'name' => 'required|string|max:255',
            'email' => 'nullable|string|email|max:255|unique:users',
            'password' => 'required|min:8|confirmed',
        ]);

        // 管理ユーザーを作成
        User::create([
            'username' => $request->username,
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'email_verified_at' => now(),
        ]);

        // 初期設定
        Setting::set('counter', 0);
        Setting::set('installed_at', now()->toDateTimeString());

        return redirect('/')->with('success', 'Installation completed successfully');
    }
}
