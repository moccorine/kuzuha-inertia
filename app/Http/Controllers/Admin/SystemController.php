<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CustomLink;
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

    public function links(): Response
    {
        $links = CustomLink::orderBy('order')->get();

        return Inertia::render('admin/system/links', [
            'links' => $links,
        ]);
    }

    public function storeLink(Request $request): RedirectResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'url' => 'required|url|max:255',
        ]);

        $maxOrder = CustomLink::max('order') ?? 0;

        CustomLink::create([
            'title' => $request->title,
            'url' => $request->url,
            'order' => $maxOrder + 1,
        ]);

        return redirect()->route('admin.system.links');
    }

    public function updateLink(Request $request, CustomLink $link): RedirectResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'url' => 'required|url|max:255',
            'order' => 'required|integer',
            'is_active' => 'required|boolean',
        ]);

        $link->update($request->only(['title', 'url', 'order', 'is_active']));

        return redirect()->route('admin.system.links');
    }

    public function deleteLink(CustomLink $link): RedirectResponse
    {
        $link->delete();

        return redirect()->route('admin.system.links');
    }
}
