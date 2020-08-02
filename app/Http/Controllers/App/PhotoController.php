<?php
namespace App\Http\Controllers\App;

use App\Http\Controllers\AppController;
use App\Model\Photo;
use Illuminate\Http\JsonResponse;

class PhotoController extends AppController
{
    public function index(): JsonResponse
    {
        $photos = Photo::onHomepage()->get()->shuffle();

        return response()->json($photos);
    }

}
