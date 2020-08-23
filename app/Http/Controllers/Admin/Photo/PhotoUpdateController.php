<?php
namespace App\Http\Controllers\Admin\Photo;

use App\Http\Controllers\AdminController;
use App\Http\Requests\Admin\PhotoRequest;
use App\Model\Photo;
use Illuminate\Http\JsonResponse;

class PhotoUpdateController extends AdminController
{
    public function __invoke(PhotoRequest $request, Photo $photo): JsonResponse
    {
        $photo->update($request->all());

        return response()->json(['message' => __('Zdjęcie zaktualizowane poprawnie')]);
    }

}
