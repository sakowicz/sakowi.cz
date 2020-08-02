<?php

use Illuminate\Support\Facades\Route;

Route::get('/photos', 'App\PhotoController@index');

Route::get('/{any}', fn() => view('app'))->where('any', '.*');
