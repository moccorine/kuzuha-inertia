<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CustomLink;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LinkManagementController extends Controller
{
    /**
     * Display the link management page with all links.
     */
    public function index(): Response
    {
        $links = CustomLink::orderBy('order')->get();

        return Inertia::render('admin/link-management', [
            'links' => $links,
        ]);
    }

    /**
     * Store a new custom link.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'url' => ['required', 'string', 'url', 'max:255'],
        ]);

        $maxOrder = CustomLink::max('order') ?? 0;

        CustomLink::create([
            'name' => $validated['name'],
            'url' => $validated['url'],
            'order' => $maxOrder + 1,
        ]);

        return to_route('admin.links.index');
    }

    /**
     * Update an existing custom link.
     */
    public function update(Request $request, CustomLink $link): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'url' => ['required', 'string', 'url', 'max:255'],
        ]);

        $link->update($validated);

        return to_route('admin.links.index');
    }

    /**
     * Delete a custom link.
     */
    public function destroy(CustomLink $link): RedirectResponse
    {
        $link->delete();

        return to_route('admin.links.index');
    }

    /**
     * Update the order of custom links after drag and drop.
     */
    public function reorder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'links' => ['required', 'array'],
            'links.*.id' => ['required', 'exists:custom_links,id'],
            'links.*.order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['links'] as $linkData) {
            CustomLink::where('id', $linkData['id'])
                ->update(['order' => $linkData['order']]);
        }

        return to_route('admin.links.index');
    }
}
