<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class LinkManagementController extends Controller
{
    /**
     * Display the admin link management WIP view.
     */
    public function __invoke(): Response
    {
        return Inertia::render('admin/link-management');
    }
}
