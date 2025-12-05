<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'version' => config('app.version'),
            'repository' => config('app.repository'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'lang' => $this->frontendTranslations(),
            'executionTime' => defined('LARAVEL_START') ? round((microtime(true) - LARAVEL_START) * 1000, 2) : null,
        ];
    }

    /**
     * Load the translations needed on the frontend.
     *
     * @return array<string, string>
     */
    protected function frontendTranslations(): array
    {
        $locale = app()->getLocale();
        $files = ['starter-kit.json', 'bbs.json'];
        $translations = [];

        foreach ($files as $file) {
            $path = lang_path("{$locale}/{$file}");
            if (File::exists($path)) {
                $content = json_decode(File::get($path), true);
                if (is_array($content)) {
                    $translations = array_merge($translations, $content);
                }
            }
        }

        return $translations;
    }
}
