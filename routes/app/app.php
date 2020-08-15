<?php

use App\Http\Controllers\App\PhotoListController;
use Illuminate\Support\Facades\Route;

Route::get('/photos', PhotoListController::class);

Route::get('/{any}', fn() => view('app'))->where('any', '.*');
