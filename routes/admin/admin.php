<?php

use App\Http\Controllers\Admin\Home\DashboardStatsController;
use App\Http\Controllers\Admin\Photo\PhotoGetController;
use App\Http\Controllers\Admin\Photo\PhotoListController;
use App\Http\Controllers\Admin\Photo\PhotoStoreController;
use App\Http\Controllers\Admin\Photo\PhotoUpdateController;
use App\Http\Controllers\Admin\Photo\ToggleIsOnHomepageController;

Route::get('/stats', DashboardStatsController::class);

Route::get('/photos', PhotoListController::class);
Route::post('/photos', PhotoStoreController::class);
Route::get('/photos/{photo}', PhotoGetController::class);
Route::put('/photos/{photo}', PhotoUpdateController::class);
Route::patch('/photos/toggle-is-on-homepage/{photo}', ToggleIsOnHomepageController::class);

Route::get('/{any?}', fn() => view('admin'))->where('any', '.*');
