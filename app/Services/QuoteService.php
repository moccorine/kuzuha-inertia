<?php

namespace App\Services;

class QuoteService
{
    /**
     * Format post body as quoted text
     */
    public function formatQuote(string $body): string
    {
        // Remove existing double quotes (lines starting with > >)
        $body = preg_replace('/^> > .+$/m', '', $body);

        // Add > prefix to each line
        $lines = explode("\n", $body);
        $quotedLines = array_map(fn ($line) => '> '.$line, $lines);

        return implode("\n", $quotedLines)."\n";
    }
}
