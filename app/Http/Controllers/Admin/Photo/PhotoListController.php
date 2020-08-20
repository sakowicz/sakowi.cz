<?php
namespace App\Http\Controllers\Admin\Photo;

use App\Http\Controllers\AdminController;
use App\Model\Photo;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;

class PhotoListController extends AdminController
{
    public function __invoke(): JsonResponse
    {
        return response()->json($this->getPhotos());
    }

    protected function getPhotos(): Collection
    {
        return Photo::orderByDesc('id')->get(['id', 'title', 'image', 'is_on_homepage']);
    }

}
