<?php

if (!function_exists('app_version')) {
    function app_version(): string
    {
        $versionFile = base_path('VERSION');
        
        if (file_exists($versionFile)) {
            return trim(file_get_contents($versionFile));
        }
        
        return 'dev';
    }
}
