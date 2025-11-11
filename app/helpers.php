<?php

if (! function_exists('app_version')) {
    function app_version(): string
    {
        $versionFile = base_path('VERSION');

        if (file_exists($versionFile)) {
            return trim(file_get_contents($versionFile));
        }

        return 'dev';
    }
}

if (! function_exists('quote_post')) {
    /**
     * Format post body as quoted text
     */
    function quote_post(string $body): string
    {
        // Strip HTML tags
        $body = strip_tags($body);

        // Remove existing double quotes (lines starting with > >)
        $lines = explode("\n", $body);
        $filteredLines = array_filter($lines, fn ($line) => ! preg_match('/^> > /', $line));
        $body = implode("\n", $filteredLines);

        // Add > prefix to each line
        $lines = explode("\n", $body);
        $quotedLines = array_map(fn ($line) => '> '.$line, $lines);

        return implode("\n", $quotedLines)."\n\n";
    }
}

if (! function_exists('increment_counter')) {
    /**
     * Increment and return counter value
     */
    function increment_counter(): int
    {
        $counter = (int) \App\Models\Setting::get('counter', 0);
        $counter++;
        \App\Models\Setting::set('counter', $counter);

        return $counter;
    }
}

if (! function_exists('get_counter')) {
    /**
     * Get current counter value
     */
    function get_counter(): int
    {
        return (int) \App\Models\Setting::get('counter', 0);
    }
}

if (! function_exists('generate_tripcode')) {
    /**
     * Generate tripcode from password
     */
    function generate_tripcode(string $password): string
    {
        $hash = hash_hmac('sha256', $password, config('app.key'));
        return '◆' . substr($hash, 0, 10);
    }
}

if (! function_exists('process_username_with_tripcode')) {
    /**
     * Process username and extract tripcode if present
     * Format: Name#password -> ['name' => 'Name', 'tripcode' => '◆xxxxxxxxxx']
     */
    function process_username_with_tripcode(string $username): array
    {
        if (strpos($username, '#') === false) {
            return [
                'name' => $username,
                'tripcode' => null,
            ];
        }

        $parts = explode('#', $username, 2);
        $name = $parts[0];
        $password = $parts[1] ?? '';

        return [
            'name' => $name,
            'tripcode' => generate_tripcode($password),
        ];
    }
}

if (! function_exists('autolink')) {
    /**
     * Convert URLs in text to HTML links
     */
    function autolink(string $text): string
    {
        $pattern = '/((https?|ftp|news):\/\/[-_.,!~*\'()a-zA-Z0-9;\/?:@&=+$,%#]+)/';
        return preg_replace($pattern, '<a href="$1" target="_blank" rel="noopener noreferrer" class="autolink">$1</a>', $text);
    }
}
