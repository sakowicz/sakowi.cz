<?php
namespace App\Http\Controllers\Admin\Photo;

use App\Http\Controllers\AdminController;
use Illuminate\View\View;

class PhotoIndexController extends AdminController
{
    public function __invoke(): View
    {
        return view('admin.photo.index');
    }

}
