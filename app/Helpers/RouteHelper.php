<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Route;

class RouteHelper
{
    public static function isActiveRoute($route, $output = "active"): string
    {
        if (strpos(Route::currentRouteName(), $route) !== false) {
            return $output;
        }
        return '';
    }

}
