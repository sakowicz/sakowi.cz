<?php
namespace App\Http\Controllers\Admin\Photo;

use App\Http\Controllers\AdminController;
use App\Model\Photo;
use Illuminate\Support\Collection;
use Illuminate\View\View;

class PhotoIndexController extends AdminController
{
    public function __invoke(): View
    {
        return view('admin.photo.index', ['photos' => $this->getPhotos()]);
    }

    protected function getPhotos(): Collection
    {
        return Photo::orderByDesc('id')->get();
    }

}
