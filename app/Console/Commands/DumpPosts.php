<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class DumpPosts extends Command
{
    protected $signature = 'bbs:dump-posts {output : Output SQL file path}';
    protected $description = 'Dump posts table to SQL file';

    public function handle()
    {
        $outputPath = $this->argument('output');
        
        $this->info('Dumping posts table...');
        
        // Disable timestamps to preserve original values
        $posts = DB::table('posts')->orderBy('id')->get();
        
        $sql = "-- Posts dump\n";
        $sql .= "DELETE FROM posts;\n\n";
        
        foreach ($posts as $post) {
            $values = [];
            foreach ((array)$post as $key => $value) {
                if ($value === null) {
                    $values[] = 'NULL';
                } else {
                    $values[] = "'" . addslashes($value) . "'";
                }
            }
            
            $columns = implode(', ', array_keys((array)$post));
            $valuesStr = implode(', ', $values);
            $sql .= "INSERT INTO posts ({$columns}) VALUES ({$valuesStr});\n";
        }
        
        $outputDir = dirname($outputPath);
        if (!is_dir($outputDir)) {
            mkdir($outputDir, 0755, true);
        }
        
        file_put_contents($outputPath, $sql);
        
        $this->info("Dumped " . count($posts) . " posts to: {$outputPath}");
        $this->info("File size: " . $this->formatBytes(filesize($outputPath)));
        
        return 0;
    }

    private function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);
        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}
