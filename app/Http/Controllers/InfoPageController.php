<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

class InfoPageController extends Controller
{
    public function show()
    {
        $page = DB::table('info_pages')->first();

        return inertia('InfoPage', [
            'content' => $page?->content ?? '',
        ]);
    }
}
