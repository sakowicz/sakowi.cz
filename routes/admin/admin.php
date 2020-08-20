<?php

use App\Http\Controllers\Admin\Home\DashboardStatsController;
use App\Http\Controllers\Admin\Photo\PhotoListController;
use App\Http\Controllers\Admin\Photo\ToggleIsOnHomepageController;

Route::get('/stats', DashboardStatsController::class);

Route::get('/photos', PhotoListController::class);
Route::patch('/photos/toggle-is-on-homepage/{photo}', ToggleIsOnHomepageController::class);

Route::get('/{any?}', fn() => view('admin'))->where('any', '.*');
