<?php

namespace App\Console\Commands;

use App\Model\Photo;
use Illuminate\Console\Command;
use Illuminate\Http\UploadedFile;

class ImportPhotosCommand extends Command
{
    protected $signature = 'photos:import {path} {storagePath}';

    protected string $dir;

    protected string $storagePath;

    public function handle()
    {
        $this->dir = $this->argument('path');
        $this->storagePath = $this->argument('storagePath');

        $files = preg_grep('~\.(jpeg|jpg|png)$~', scandir($this->dir));

        $bar = $this->output->createProgressBar(count($files));
        $bar->start();

        foreach ($files as $file) {
            $this->importPhoto($file);
            $bar->advance();
        }
        $bar->finish();

        return 0;
    }

    protected function importPhoto($file)
    {
        $pathParts = pathinfo($file);
        $uploadedFile = new UploadedFile($this->dir.'/'.$file, $file);
        $photo = new Photo;
        $photo->image = $uploadedFile->storeAs($this->storagePath, $file);
        $photo->title = ucwords(str_replace('-', ' ', $pathParts['filename']));
        $photo->save();
    }
}
