<?php

use Illuminate\Support\Facades\Route;

require_once 'auth/auth.php';

Route::group(
    ['namespace' => '\\'],
    function () {
        Route::group(
            ['prefix' => 'admin', 'as' => 'admin.', 'middleware' => ['auth']],
            base_path('/routes/admin/admin.php')
        );

        Route::group(['as' => 'app.'], base_path('/routes/app/app.php'));
    }
);
