<?php

namespace App\Facades;

use Config;
use Illuminate\Support\Facades\Facade;
use Illuminate\Http\Request;

/**
 * Site Facade
 */
class Site extends Facade
{

    /** @var string The current site. */
    public static $name = '';

    /** @var string The current matched host. */
    public static $host = '';

    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'site';
    }

    /**
     * Check the request for the current domain
     *
     * @param Request $request The request object
     */
    public static function setRequest(Request $request)
    {
        $host  = strtolower(preg_replace('/^(.*(\.|\/))?([^\.]+\.[^\.]+)$/i', '$3', $request->getHost()));
        $sites = Config::get('app.sites');
        $name  = Config::get('app.fallback_site');

        foreach ($sites as $site => $settings) {
            $name = in_array($host, $settings['domains']) ? $site : $name;
        }

        static::$name = $name;
    }

    /**
     * Get the registered site.
     *
     * @return string
     */
    public static function getName()
    {
        return static::$name;
    }

    /**
     * Get the registered site.
     *
     * @return string
     */
    public static function getAnalyticsCode()
    {
        return Config::get('app.sites.' . static::$name . '.analytics');
    }

    /**
     * Get the registered host.
     *
     * @return string
     */
    public static function getHost()
    {
        return static::$host;
    }
}