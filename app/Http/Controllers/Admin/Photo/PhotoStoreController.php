<?php
namespace App\Http\Controllers\Admin\Photo;

use App\Http\Controllers\AdminController;
use App\Http\Requests\Admin\PhotoRequest;
use App\Model\Photo;
use Illuminate\Http\JsonResponse;

class PhotoStoreController extends AdminController
{
    public function __invoke(PhotoRequest $request): JsonResponse
    {
        Photo::create($request->all());

        return response()->json(['message' => __('Zdjęcie utworzone poprawnie')]);
    }

}
