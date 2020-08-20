<?php
namespace App\Http\Controllers\Admin\Photo;

use App\Http\Controllers\AdminController;
use App\Model\Photo;
use Illuminate\Http\JsonResponse;

class ToggleIsOnHomepageController extends AdminController
{
    public function __invoke(Photo $photo): JsonResponse
    {
        return response()->json($this->toggleStatus($photo));
    }

    protected function toggleStatus(Photo $photo): bool
    {
        $photo->is_on_homepage = !$photo->is_on_homepage;
        $photo->save();

        return $photo->is_on_homepage;
    }

}
