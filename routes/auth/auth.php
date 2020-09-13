<?php

use App\Http\Controllers\Auth\LoginController;

Route::get('login', fn() => view('auth.login'))->name('login');
Route::post('login', [LoginController::class, 'login']);
Route::post('logout', [LoginController::class, 'logout'])->name('logout');
