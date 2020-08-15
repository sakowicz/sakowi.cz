<?php

use Illuminate\Support\Facades\Route;

Route::group(
    ['namespace' => '\\'],
    function () {
        Route::group(
            ['prefix' => 'admin', 'as' => 'admin.', 'middleware' => ['permission']],
            base_path('/routes/admin/admin.php')
        );

        Route::group([], base_path('/routes/app/app.php'));
    }
);
