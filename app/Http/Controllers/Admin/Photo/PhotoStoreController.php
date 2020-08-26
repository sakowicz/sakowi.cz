<?php
namespace App\Http\Controllers\Admin\Photo;

use App\Http\Controllers\AdminController;
use App\Http\Requests\Admin\Photo\PhotoStoreRequest;
use App\Model\Photo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\UploadedFile;

class PhotoStoreController extends AdminController
{
    public function __invoke(PhotoStoreRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['image'] = $this->storeImage($request->file('image'), $data['image_name']);
        Photo::create($data);

        return response()->json(['message' => __('Zdjęcie utworzone poprawnie')]);
    }

    protected function storeImage(UploadedFile $file, string $imageName): string
    {
        return $file->storeAs('public/images', sprintf('%s.%s', $imageName, $file->extension()));
    }

}
