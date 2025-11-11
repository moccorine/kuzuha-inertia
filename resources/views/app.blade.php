<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }

            @php
                $themeName = request()->cookie('theme', env('THEME_DEFAULT', 'default'));
                $theme = config("themes.{$themeName}", config('themes.default'));
            @endphp

            :root {
                --theme-background: {{ $theme['background'] }};
                --theme-text: {{ $theme['text'] }};
                --theme-link: {{ $theme['link'] }};
                --theme-link-visited: {{ $theme['link_visited'] }};
                --theme-link-hover: {{ $theme['link_hover'] }};
                --theme-link-active: {{ $theme['link_active'] }};
                --theme-hr: {{ $theme['hr'] }};
                --theme-title: {{ $theme['title'] }};
                --theme-quote: {{ $theme['quote'] }};
                --theme-error: {{ $theme['error'] }};
                --theme-input-bg: {{ $theme['input_bg'] }};
                --theme-input-text: {{ $theme['input_text'] }};
                --theme-input-border: {{ $theme['input_border'] }};
                --theme-input-hover: {{ $theme['input_hover'] }};
                --theme-input-focus: {{ $theme['input_focus'] }};
                --theme-button-bg: {{ $theme['button_bg'] }};
                --theme-button-text: {{ $theme['button_text'] }};
                --theme-button-hover: {{ $theme['button_hover'] }};
                --theme-button-active: {{ $theme['button_active'] }};
            }
        </style>

        {{-- Apply custom theme colors from localStorage after base theme is set --}}
        <script>
            (function() {
                // Remove any existing custom theme style tag first
                const existingStyle = document.getElementById('custom-theme-override');
                if (existingStyle) {
                    existingStyle.remove();
                }

                const themeCookie = document.cookie.split('; ').find(row => row.startsWith('theme='));
                const currentTheme = themeCookie ? themeCookie.split('=')[1] : '{{ env('THEME_DEFAULT', 'default') }}';
                
                if (currentTheme === 'custom') {
                    const customTheme = localStorage.getItem('customTheme');
                    
                    if (customTheme) {
                        try {
                            const { colors } = JSON.parse(customTheme);
                            
                            // Create a style tag to override theme variables
                            const styleTag = document.createElement('style');
                            styleTag.id = 'custom-theme-override';
                            styleTag.textContent = `
                                :root {
                                    --theme-text: ${colors.text};
                                    --theme-background: ${colors.background};
                                    --theme-link: ${colors.link};
                                    --theme-link-visited: ${colors.link_visited};
                                    --theme-link-active: ${colors.link_active};
                                    --theme-link-hover: ${colors.link_hover};
                                    --theme-title: ${colors.title};
                                    --theme-quote: ${colors.quote};
                                }
                            `;
                            document.head.appendChild(styleTag);
                        } catch (e) {
                            console.error('Failed to parse custom theme:', e);
                        }
                    }
                }
            })();
        </script>

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
