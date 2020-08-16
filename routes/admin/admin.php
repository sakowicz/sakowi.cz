<?php

use App\Http\Controllers\Admin\Home\DashboardIndexController;
use App\Http\Controllers\Admin\Photo\PhotoIndexController;

Route::get('/', DashboardIndexController::class)->name('home.index');
Route::get('/photo', PhotoIndexController::class)->name('photo.index');
