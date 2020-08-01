<?php

use Illuminate\Support\Facades\Route;

Route::get('/photos', 'App\PhotographyController@index');

Route::get('/{any}', fn() => view('app'))->where('any', '.*');
