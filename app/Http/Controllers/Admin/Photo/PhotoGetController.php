<?php
namespace App\Http\Controllers\Admin\Photo;

use App\Http\Controllers\AdminController;
use App\Model\Photo;
use Illuminate\Http\JsonResponse;

class PhotoGetController extends AdminController
{
    public function __invoke(Photo $photo): JsonResponse
    {
        return response()->json($photo->only(['id', 'title', 'subtitle', 'image', 'is_on_homepage']));
    }

}
