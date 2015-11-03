<?php

namespace App\Facades;

use DateTime;
use View;
use Lang;
use Illuminate\Support\Facades\Facade;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use App\Models\Member;
use App\Models\Webpage;
use App\Models\Evaluation;
use App\Models\Result;

/**
 * Tool Facade
 */
class Tool extends Facade
{

    /** @var string The current name. */
    public static $name = 'validator';

    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'tool';
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
    public static function getId()
    {
        return Site::getName() . "_" . static::getName();
    }

    /**
     * Get script link of the tool
     *
     * @return string
     */
    public static function getLink()
    {
        $script = "javascript:
                (function(i, d)
                {
                    if (!d.getElementById(i)) {
                        var j = d.createElement('script');
                            j.id = i;
                            j.src = '" . static::getURL() . "';

                        d.body.appendChild(j);
                    }
                })('" . static::getId() . "', document);
            ";

        return preg_replace('/(var [a-z]+)?\s+/i', '$1', $script);
    }

    /**
     * Get HTML of the tool button
     *
     * @return Response The content
     */
    public static function getButton()
    {
        $response = new Response();
        $url      = route('tool.button.script', ['locale' => Lang::getLocale()]);

        $content = '<script src="' . $url . '"></script>' . "\n";
        $content .= '<div id="' . static::getId() . '_button"></div>';

        $response->setContent($content);

        return $response;
    }

    /**
     * Get script for the tool button
     *
     * @return Response The content
     */
    public static function getButtonScript()
    {
        $response = static::getResponse();

        $html     = View::make('site.' . Site::getName() . '.page.button')->render();
        $stripped = str_replace("\r", '', str_replace("\n", '', str_replace('"', '\"', preg_replace("/[ ]{2,}/i", '', $html))));

        $cssURL = url('site/' . Site::getName() . '/css/button.css');

        $script = file_get_contents(public_path('site/' . Site::getName() . '/js/button.js')) . "\n";
        $script .= 'new ' . Site::getName() . 'Button("' . static::getId() . '_style", "' . $cssURL . '", "' . static::getId() . '_button", "' . $stripped . '");' . "\n";

        $response->setContent($script);

        return $response;
    }

    /**
     * Get the users script for specified language, userKey and tool
     *
     * @param string $locale
     * @param string $userKey
     * @param string $tool
     * @return Response The script content
     */
    public static function getScript($locale, $userKey, $tool, $data)
    {
        $response = static::getResponse();

        if (!isset($data['HTTP_REFERER'])) {
            return $response;
        }

        $user = static::getUser($userKey, true);

        if ($user && $user->hasLicense() && $user->is_enabled) {
            $sessionKey = hash('sha512', $locale . $userKey . $tool . microtime() . rand());
            $evaluation = static::getEvaluation($sessionKey, $user, $data);

            if ($evaluation) {
                $apiURL = route('result', ['sessionKey' => $sessionKey, 'tool' => $tool, 'locale' => $locale]);

                $script = 'var sitepath = "' . url('bookmarklet') . '/";' . "\n";
                $script .= 'var lang = "' . $locale . '";' . "\n";
                $script .= 'var dataURL = "' . $apiURL . '";' . "\n";
                $script .= file_get_contents(public_path('bookmarklet/bookmarklet.js')) . "\n";

                $response->setContent($script);
            }
        }

        return $response;
    }

    /**
     * Get the users script for specified language, userKey and tool
     *
     * @param Request $request
     * @param string $sessionKey
     * @param string $tool
     * @return Response The script content
     */
    public static function registerResult(Request $request)
    {
        $origin   = $request->headers->get('Origin');
        $response = static::getResponse('application/json', $origin);

        if (!$origin) {
            return $response;
        }

        $user = static::getUser();

        if ($user && $user->hasLicense() && $user->is_enabled) {
            $evaluation = static::getEvaluation($request->sessionKey);
            $results    = $request->get('results', null);

            if (!$evaluation || !$results) {
                return $response;
            }

            foreach ($results as $result) {
                $result['evaluation_id'] = $evaluation->id;
                Result::create($result);
            }

            $response->setContent(json_encode(['error' => 0]));
        }

        return $response;
    }

    /**
     * Get URL to the tool
     *
     * @return string
     */
    private static function getURL()
    {
        $user = new Member();
        $url  = route('tool', ['userKey' => $user->key, 'tool' => static::getName(), 'locale' => Lang::getLocale()]);

        return $url;
    }

    /**
     * Get User's session
     *
     * @param string $userKey
     * @param bool $create
     * @return Member
     */
    private static function getUser($userKey = null, $create = false)
    {
        $session = session();
        $user    = null;

        if ($userKey) {
            $user = Member::where(['key' => $userKey])->first();

            if (!$user && $create && Member::getAutoLicense(Site::getName())) {
                $user = Member::create(['key' => $userKey, 'first_name' => Site::getName() . ' user']);
                $user->createAutoLicense(Site::getName());
            }

            if ($user) {
                $session->put('tool.user', $user->key);
            }
        } else if ($session->has('tool.user')) {
            $userKey = $session->get('tool.user');
            $user    = Member::where(['key' => $userKey])->first();
        }

        return $user;
    }

    /**
     * Get Evaluation from session
     *
     * @param string $sessionKey
     * @param Member $user
     * @param Array $data
     * @return string sessionKey
     */
    private static function getEvaluation($sessionKey = null, Member $user = null, $data = null)
    {
        $session    = session();
        $evaluation = null;

        if ($data && $sessionKey) {
            $webpage = Webpage::firstOrCreate(['url' => $data['HTTP_REFERER']]);

            if ($webpage->is_enabled) {
                $evaluation = $webpage->evaluations()->create([
                    'member_id'  => $user->id,
                    'ip'         => $data['REMOTE_ADDR'],
                    'user_agent' => $data['HTTP_USER_AGENT'],
                ]);

                $session->put('tool.session.' . $sessionKey, $evaluation->id);
            }
        } else if ($sessionKey) {
            $id         = $session->get('tool.session.' . $sessionKey);
            $evaluation = Evaluation::find($id);
        }

        return $evaluation;
    }

    /**
     * Get a valid response back
     *
     * @param String $type
     * @param String $origin
     * @return Response The response
     */
    private static function getResponse($type = 'application/javascript', $origin = '*')
    {
        $response = new Response();
        $date     = new DateTime();

        $response
            ->setCharset('UTF-8')
            ->setDate($date)
            ->setEtag(hash('sha512', microtime() . rand()))
            ->setExpires($date)
            ->setLastModified($date)
            ->setMaxAge(0)
            ->setPrivate()
            ->header('Pragma', 'no-cache')
            ->header('Access-Control-Allow-Origin', ($origin ? $origin : '*'))
            ->header('Access-Control-Allow-Methods', 'POST, GET')
            ->header('Access-Control-Allow-Credentials', 'true')
            ->header('Content-Type', ($type ? $type : 'application/javascript') . '; charset=utf-8')
            ->header('X-Frame-Options', 'deny')
            ->setContent(json_encode(['error' => 1]));

        return $response;
    }
}