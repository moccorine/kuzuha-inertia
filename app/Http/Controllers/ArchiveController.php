<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class ArchiveController extends Controller
{
    public function index()
    {
        return Inertia::render('archive/index', [
            'status' => 'WIP',
            'message' => 'Archive view is under construction',
        ]);
    }
}
