<?php
namespace App\Http\Controllers\Admin\Home;

use App\Http\Controllers\AdminController;
use Illuminate\View\View;

class DashboardIndexController extends AdminController
{
    public function __invoke(): View
    {
        return view('admin.home');
    }

}
