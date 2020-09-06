<?php
namespace App\Http\Controllers\Admin\Photo;

use App\Http\Controllers\AdminController;
use App\Model\Photo;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class ToggleIsOnHomepageController extends AdminController
{
    public function __invoke(Photo $photo): JsonResponse
    {
        return response()->json($this->toggleStatus($photo));
    }

    protected function toggleStatus(Photo $photo): array
    {
        $this->checkIfCanBeOnHomepage($photo);

        $photo->is_on_homepage = !$photo->is_on_homepage;
        $photo->save();

        return [
            'is_on_homepage' => $photo->is_on_homepage,
            'message' => $photo->is_on_homepage ?
                __('Zdjęcie aktywowane na stronie głównej')
                : __('Zdjęcie zdezaktywowane na stronie głownej'),
        ];
    }

    protected function checkIfCanBeOnHomepage(Photo $photo)
    {
        if (is_null($photo->title) || is_null($photo->subtitle)) {
            throw ValidationException::withMessages(
                [__('Zdjęcie musi posiadać tytuł oraz opis, aby znalazło się na głównej.')]
            );
        }
    }

}
