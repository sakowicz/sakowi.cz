<?php

Route::get('login', fn() => view('auth.login'))->name('login');
Route::post('login', 'Auth\LoginController@login');
Route::post('logout', 'Auth\LoginController@logout')->name('logout');
