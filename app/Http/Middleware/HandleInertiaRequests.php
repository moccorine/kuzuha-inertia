<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
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
        $startTime = defined('LARAVEL_START') ? LARAVEL_START : $request->server('REQUEST_TIME_FLOAT');
        $executionTime = number_format(microtime(true) - $startTime, 6);

        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $locale = app()->getLocale();
        $fallbackLocale = config('app.fallback_locale');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'appCredit' => config('app.credit'),
            'appVersion' => app_version(),
            'executionTime' => $executionTime,
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'locale' => $locale,
            'fallbackLocale' => $fallbackLocale,
            'translations' => $this->frontendTranslations($locale),
            'fallbackTranslations' => $fallbackLocale !== $locale
                ? $this->frontendTranslations($fallbackLocale)
                : [],
        ];
    }

    /**
     * Get frontend translations for the given locale.
     *
     * @return array<string, mixed>
     */
    protected function frontendTranslations(string $locale): array
    {
        $translations = Lang::get('frontend', [], $locale);

        return is_array($translations) ? $translations : [];
    }
}
