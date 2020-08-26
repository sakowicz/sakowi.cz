<?php
namespace App\Http\Controllers\Admin\Photo;

use App\Http\Controllers\AdminController;
use App\Http\Requests\Admin\Photo\PhotoUpdateRequest;
use App\Model\Photo;
use Illuminate\Http\JsonResponse;

class PhotoUpdateController extends AdminController
{
    public function __invoke(PhotoUpdateRequest $request, Photo $photo): JsonResponse
    {
        $photo->update($request->validated());

        return response()->json(['message' => __('Zdjęcie zaktualizowane poprawnie')]);
    }

}
