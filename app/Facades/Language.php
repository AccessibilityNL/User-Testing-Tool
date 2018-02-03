<?php

namespace App\Facades;

use Route;
use Config;
use Lang;
use Illuminate\Support\Facades\Facade;
use Illuminate\Http\Request;

/**
 * Locale Facade
 */
class Language extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'language';
    }

    /**
     * Check the request for the current locale
     *
     * @param Request $request The request object
     */
    public static function setRequest(Request $request)
    {
        $route = Route::getRoutes()->match($request);

        $locale = $route->getParameter('locale', Config::get('app.locale'));
        $locale = in_array($locale, Config::get('app.locales')) ? $locale : Config::get('app.locale');

        Lang::setLocale($locale);

        setLocale(LC_ALL, 'en_US.utf8');
    }
}