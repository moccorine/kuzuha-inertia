<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InformationPage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SystemController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/system/index');
    }

    public function information(): Response
    {
        $page = InformationPage::first();
        
        return Inertia::render('admin/system/information', [
            'content' => $page?->content ?? '',
        ]);
    }

    public function updateInformation(Request $request): RedirectResponse
    {
        $request->validate([
            'content' => 'nullable|string',
        ]);

        $page = InformationPage::first();
        
        if ($page) {
            $page->update(['content' => $request->content]);
        } else {
            InformationPage::create(['content' => $request->content]);
        }

        return redirect()->route('admin.system.information');
    }
}
