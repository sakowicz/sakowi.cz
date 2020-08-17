<?php

use App\Http\Controllers\Admin\Home\DashboardStatsController;

//Route::get('/photo', PhotoIndexController::class)->name('photo.index');
Route::get('/stats', DashboardStatsController::class)->name('photo.index');

Route::get('/{any?}', fn() => view('admin'))->where('any', '.*');
