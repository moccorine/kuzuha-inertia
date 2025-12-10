<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Database\Seeders\InfoPageSeeder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class InfoPageManagementController extends Controller
{
    /**
     * Show the markdown editor and preview for the info page.
     */
    public function edit(): Response
    {
        $page = DB::table('info_pages')->first();

        $lastUpdated = $page?->updated_at
            ? Carbon::parse($page->updated_at)->toIso8601String()
            : null;

        return Inertia::render('admin/info-management', [
            'content' => $page?->content ?? '',
            'defaultContent' => InfoPageSeeder::defaultContent(),
            'lastUpdated' => $lastUpdated,
        ]);
    }

    /**
     * Update the stored info page content.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'content' => ['required', 'string'],
        ]);

        $page = DB::table('info_pages')->first();

        if ($page) {
            DB::table('info_pages')
                ->where('id', $page->id)
                ->update([
                    'content' => $validated['content'],
                    'updated_at' => now(),
                ]);
        } else {
            DB::table('info_pages')->insert([
                'content' => $validated['content'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return to_route('admin.info.index');
    }
}
