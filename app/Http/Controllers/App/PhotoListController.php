<?php
namespace App\Http\Controllers\App;

use App\Http\Controllers\AppController;
use App\Model\Photo;
use Illuminate\Http\JsonResponse;

class PhotoListController extends AppController
{
    public function __invoke(): JsonResponse
    {
        $photos = Photo::onHomepage()->get();

        return response()->json($photos);
    }

}
