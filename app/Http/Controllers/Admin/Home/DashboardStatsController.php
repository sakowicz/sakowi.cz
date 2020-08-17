<?php
namespace App\Http\Controllers\Admin\Home;

use App\Http\Controllers\AdminController;
use App\Model\Photo;
use Illuminate\Http\JsonResponse;

class DashboardStatsController extends AdminController
{
    public function __invoke(): JsonResponse
    {
        return response()->json($this->getStats());
    }

    protected function getStats(): array
    {
        return [
            'photosAll' => Photo::all()->count(),
            'photosOnHomepage' => Photo::onHomepage()->count(),
        ];
    }

}
