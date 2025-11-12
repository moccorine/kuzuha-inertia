<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class RestorePosts extends Command
{
    protected $signature = 'bbs:restore-posts {input : Input SQL file path}';

    protected $description = 'Restore posts table from SQL file';

    public function handle()
    {
        $inputPath = $this->argument('input');

        if (! file_exists($inputPath)) {
            $this->error("File not found: {$inputPath}");

            return 1;
        }

        $this->info("Restoring posts from: {$inputPath}");

        $sql = file_get_contents($inputPath);

        // Split by semicolon and newline
        $statements = array_filter(
            array_map('trim', explode(";\n", $sql)),
            fn ($s) => ! empty($s) && strpos($s, '--') !== 0
        );

        $this->info('Found '.count($statements).' statements');

        DB::beginTransaction();

        try {
            $bar = $this->output->createProgressBar(count($statements));

            foreach ($statements as $statement) {
                if (! empty($statement)) {
                    DB::unprepared($statement.';');
                }
                $bar->advance();
            }

            $bar->finish();
            $this->newLine();

            DB::commit();

            $count = DB::table('posts')->count();
            $this->info("Restored {$count} posts");

            return 0;
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error('Error: '.$e->getMessage());

            return 1;
        }
    }
}
