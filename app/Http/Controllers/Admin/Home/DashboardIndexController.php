<?php
namespace App\Http\Controllers\Admin\Home;

use App\Http\Controllers\AdminController;
use App\Model\Photo;
use Illuminate\View\View;

class DashboardIndexController extends AdminController
{
    public function __invoke(): View
    {
        return view('admin.home', ['stats' => $this->getStats()]);
    }

    protected function getStats(): array
    {
        return [
            'photos-all' => Photo::all()->count(),
            'photos-on-homepage' => Photo::onHomepage()->count(),
        ];
    }

}
