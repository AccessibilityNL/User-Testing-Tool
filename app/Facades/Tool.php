<?php

namespace App\Facades;

use DateTime;
use View;
use Lang;
use Carbon\Carbon;
use Illuminate\Support\Facades\Facade;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use App\Models\Member;
use App\Models\Webpage;
use App\Models\Evaluation;
use App\Models\Result;
use App\Models\Organization;

/**
 * Tool Facade
 */
class Tool extends Facade
{
    /** @var string The current name. */
    public static $name = 'validator';

    /** @var string The current version. */
    public static $version = '0.9.85';

    /** @var string The current version data. */
    public static $versionDate = '15-10-2015';

    /** @var array The included JS files. */
    public static $includedJS = array();

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
     * Get the version info
     *
     * @param string $root
     *
     * @return string
     */
    public static function getVersionInfo($root)
    {
        $info = array();
        $date = filemtime($root);
        $dir  = scandir($root);

        foreach ($dir as $file) {
            if (!in_array($file, array('.', '..'))) {
                $fileDate = filemtime($root . '/' . $file);
                $date     = $date < $fileDate ? $fileDate : $date;
            }
        }

        $info['number'] = static::$version;
        $info['date']   = strftime('%d %B %Y', $date);
        $info['time']   = strftime('%T', $date);

        return $info;
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
                    } else {
                        window[i].open();
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
        $stripped = str_replace("\r", '',
            str_replace("\n", '', str_replace('"', '\"', preg_replace("/[ ]{2,}/i", '', $html))));

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
     * @param Request $request
     *
     * @return Response The script content
     */
    public static function getScript($locale, $userKey, $tool, $request)
    {
        $origin   = $request->headers->get('Origin', $request->headers->get('Referer'));
        $response = static::getResponse('application/javascript', $origin);
        $data     = $request->server();

        $data['HTTP_REFERER'] = isset($data['HTTP_REFERER']) && $data['HTTP_REFERER'] ? $data['HTTP_REFERER'] : $origin;

        if (!$origin) {
            return $response;
        }

        $user = static::getUser($userKey, true);

        if ($user) {
            $sessionKey = hash('sha512', $locale . $userKey . $tool . microtime() . rand());
            $evaluation = static::getEvaluation($sessionKey, $user, $data);

            if ($evaluation) {
                $apiURL         = route('result', ['sessionKey' => $sessionKey, 'tool' => $tool, 'locale' => $locale]);
                $linkCheckerURL = route('linkchecker', ['sessionKey' => $sessionKey, 'tool' => $tool, 'locale' => $locale]);
                $reportURL      = route('report', ['sessionKey' => $sessionKey, 'locale' => $locale]);
                $scoresURL      = route('scores', ['sessionKey' => $sessionKey, 'tool' => $tool, 'locale' => $locale]);
                $updateUserURL  = route('user.update', ['sessionKey' => $sessionKey, 'tool' => $tool, 'locale' => $locale]);
                $license        = $user->getLicense();
                $lastResults    = $evaluation->previousResults();
                $ratingResults  = $evaluation->previousRatingResult();
                $ratingGlobal   = $evaluation->globalRatingResult();
                $versionInfo    = static::getVersionInfo(public_path(Site::getName()));

                $toolname = ($tool == 'validator' ? Site::getName() : $tool);

                $script = 'var sitepath = "' . url($toolname) . '/";' . "\n";
                $script .= 'var lang = "' . $locale . '";' . "\n";
                $script .= 'var dataURL = "' . $apiURL . '";' . "\n";
                $script .= 'var reportURL = "' . $reportURL . '";' . "\n";
                $script .= 'var linkURL = "' . $linkCheckerURL . '";' . "\n";
                $script .= 'var scoresURL = "' . $scoresURL . '";' . "\n";
                $script .= 'var updateUserURL = "' . $updateUserURL . '";' . "\n";
                $script .= 'var licenseAccess = ' . ($user->hasAccess() ? 'true' : 'false') . ';' . "\n";
                $script .= 'var licenseData = { ends_at : "' . ($license && $license->ends_at ? $license->ends_at->formatLocalized('%d %B %Y') : '') . '" };' . "\n";
                $script .= 'var versionData = ' . json_encode($versionInfo) . ';' . "\n";
                $script .= 'var resultData = ' . ($lastResults ? $lastResults->toJson() : '[]') . ';' . "\n";
                $script .= 'var ratingData = ' . ($ratingResults ? $ratingResults->toJson() : '{}') . ';' . "\n";
                $script .= 'var ratingGlobal = ' . ($ratingGlobal ? $ratingGlobal->toJson() : '[]') . ';' . "\n";
                $script .= 'var user = ' . ($user ? $user->toJson() : '{}') . ';' . "\n";
                $script .= implode('', static::getModule('rating')) . "\n";
                $script .= implode('', static::getModule('poll')) . "\n";
                $script .= 'window.' .(Site::getName() . "_" . $tool) . '=';
                $script .= file_get_contents(public_path($toolname . '/bookmarklet.js')) . "\n";

                $response->setContent($script);
            }
        }

        return $response;
    }

    /**
     * Get the users script for specified language, userKey and tool
     *
     * @param Request $request
     *
     * @return Response The script content
     */
    public static function registerResult(Request $request)
    {
        $origin   = $request->headers->get('Origin', $request->headers->get('Referer'));
        $response = static::getResponse('application/json', $origin);

        if (!$origin) {
            return $response;
        }

        $user = static::getUser();

        if ($user && $user->hasAccess()) {
            $evaluation = static::getEvaluation($request->sessionKey);
            $results    = $request->get('results', null);

            if (!$evaluation || !$results) {
                return $response;
            }

            foreach ($results as $result) {
                $result['evaluation_id'] = $evaluation->id;

                if ($result['type'] == 'feedback') {
                    $find = $result;
                    unset($find['status']);
                    
                    if ($result['module'] == 'rating') {
                        $user->addPoints($evaluation->webpage_id, $result['status'], $result['value']);
                    }
                    
                    if ($result['module'] == 'poll') {
                        unset($find['value']);
                    }

                    $item         = Result::firstOrNew($find);
                    $item->status = $result['status'];
                    $item->value  = $result['value'];
                    $item->save();
                } else {
                    Result::create($result);
                }
            }

            $response->setContent(json_encode(['error' => 0]));
        }

        return $response;
    }

    /**
     * Check the provided links on their status code
     *
     * @param Request $request
     *
     * @return Response The script content
     */
    public static function linkChecker(Request $request)
    {
        $origin   = $request->headers->get('Origin', $request->headers->get('Referer'));
        $response = static::getResponse('application/json', $origin);
        $data     = array();

        if (!$origin) {
            return $response;
        }

        $user = static::getUser();

        if ($user && $user->hasAccess()) {
            $evaluation = static::getEvaluation($request->sessionKey);
            $urls       = $request->get('urls', null);
            $max_checks = 50;

            if (!$evaluation || !$urls) {
                return $response;
            }

            foreach ($urls as $url) {
                if ($max_checks > 0) {
                    $data[$url] = static::checkLink($url);
                }

                $max_checks--;
            }

            $response->setContent(json_encode(['error' => 0, 'urls' => $data]));
        }

        return $response;
    }
    /**
     * Get the updateuser
     * @param Request $request
     * @return Response The script content
     */
    public static function updateUser(Request $request)
    {
        $origin   = $request->headers->get('Origin', $request->headers->get('Referer'));
        $response = static::getResponse('application/json', $origin);
        $data     = array();

        $user = static::getUser();

        if ($user && $user->hasAccess()) {
            $user->update($request->get('user', []));
            $user->save();

            $response->setContent(json_encode(['error' => 0]));
        }
            
        return $response;
    }

    /**
     * Get the scores
     * @param Request $request
     * @return Response The script content
     */
    public static function scores(Request $request)
    {
        $origin   = $request->headers->get('Origin', $request->headers->get('Referer'));
        $response = static::getResponse('application/json', $origin);
        $data     = array();

        $user = static::getUser();

        if ($user && $user->hasAccess()) {
            $tool = $request->tool;
            $evaluation = static::getEvaluation($request->sessionKey);

            $data['dates'] = [
                'month' => Carbon::now()->startOfMonth(),
                'week' => Carbon::now()->startOfWeek(),
                'last_month' => Carbon::now()->subMonth()->startOfMonth(),
                'last_week' => Carbon::now()->subWeek()->startOfWeek()
            ];

            $data['date_names'] = [
                'last_month' => $data['dates']['last_month']->formatLocalized('%B %Y')
            ];

            $data['scores'] = [
                'month' => $user->getTopScores($data['dates']['month']),
                'week' => $user->getTopScores($data['dates']['week'])
            ];

            $prev_month = Evaluation::where([])
                ->select(DB::raw('SUM(IF(result.status=5, 1, 0)) as `score`', 'score'))
                ->where('evaluation.created_at', '>=', $data['dates']['last_month'])
                ->where('evaluation.created_at', '<', $data['dates']['month'])
                ->leftJoin('result', 'result.evaluation_id', '=', 'evaluation.id')
                ->groupBy('webpage_id')
                ->get();

            $this_month = Evaluation::where([])
                ->select(DB::raw('SUM(IF(result.status=5, 1, 0)) as `score`', 'score'))
                ->where('evaluation.created_at', '>=', $data['dates']['last_month'])
                ->leftJoin('result', 'result.evaluation_id', '=', 'evaluation.id')
                ->groupBy('webpage_id')
                ->get();

            $progress = Evaluation::where([])
                ->select(DB::raw('SUM(IF(result.status=5, 1, 0)) as `good`', 'good'), DB::raw('SUM(IF(result.status=1, 1, 0)) as `bad`', 'bad'))
                ->leftJoin('result', 'result.evaluation_id', '=', 'evaluation.id')
                ->first();

            $data['stats'] = [
                'members' => Member::where('created_at', '>=', '2017-11-27')->count(),
                'websites_checked' => Evaluation::where([])
                    ->where('evaluation.created_at', '>=', $data['dates']['last_month'])
                    ->distinct('webpage_id')
                    ->count('webpage_id'),
                'websites_improved' => count($this_month)-count($prev_month),
                'progress' => $progress
            ];

            $response->setContent(json_encode(['error' => 0, 'data' => $data ]));
        }

        return $response;
    }

    /**
     * Check the provided links on their status code
     *
     * @param Request $request
     *
     * @return Response The script content
     */
    public static function currentUser(Request $request)
    {
        $session  = session();

        $origin   = $request->headers->get('Origin', $request->headers->get('Referer', $request->headers->get('Extension')));
        $response = static::getResponse('application/json', $origin);
        $tool     = $request->tool;
        $user     = null;

        if (!$origin) {
            return $response;
        }

        if ($session->has('tool.user')) {
            $userKey = $session->get('tool.user');
            $user    = Member::where(['key' => $userKey])->first();
        }

        if (!$user && Member::getAutoLicense($tool)) {
            $user = Member::create(['first_name' => $tool . ' user']);
            $user->createAutoLicense($tool);

            $session->put('tool.user', $user->key);
        }

        if ($user) {
            $response->setContent(json_encode(['error' => 0, 'user' => $user]));
        }

        return $response;
    }

    /**
     * Check the provided link
     *
     * @param String $url
     *
     * @return Response The script content
     */
    private static function checkLink($url)
    {
        stream_context_set_default(array(
            'http' => array(
                'method'          => 'HEAD',
                'follow_location' => 1,
                'max_redirects'   => 20,
                'timeout'         => 5,
            ),
            'ssl'  => array(
                'verify_peer' => false,
            ),
        ));

        try {
            $headers = get_headers($url, 1);
            $status  = (isset($headers['Location']) ? static::checkLink($headers['Location']) : $headers[0]);
        } catch (\ErrorException $e) {
            $status = '000';
        }

        preg_match('/[0-9]{3}/i', $status, $found);

        return intval($found[0]);
    }

    /**
     * Get URL to the tool
     *
     * @return string
     */
    private static function getURL()
    {
        $user = static::getUser();

        if (!$user) {
            $user = new Member();
        }

        $url = route('tool', ['userKey' => $user->key, 'tool' => static::getName(), 'locale' => Lang::getLocale()]);

        return $url;
    }

    /**
     * Get User's session
     *
     * @param string $userKey
     * @param bool   $create
     *
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
        } elseif ($session->has('tool.user')) {
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
     * @param Array  $data
     *
     * @return Evaluation
     */
    public static function getEvaluation($sessionKey = null, Member $user = null, $data = null)
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
        } elseif ($sessionKey) {
            $id         = $session->get('tool.session.' . $sessionKey);
            $evaluation = Evaluation::find($id);
        }

        return $evaluation;
    }

    /**
     * Get a module.
     *
     * @param string $key The KEY of the module
     *
     * @return array The included JS files
     */
    public static function getModule($key = 'title')
    {
        $path = base_path('resources/assets/js/module/' . $key . '.js');

        return static::includeJS($path);
    }

    /**
     * Get a script.
     *
     * @param string $path The path to the script file
     *
     * @return array The included JS files
     */
    private static function includeJS($path)
    {
        $path = realpath($path);

        if (!isset(static::$includedJS[$path])) {
            $content = (file_exists($path) ? file_get_contents($path) : '');

            preg_match_all('/include\(([^\)]+)\);/i', $content, $includes);

            foreach ($includes[1] as $key => $file) {
                $content = str_replace($includes[0][$key], '', $content);

                static::includeJS(dirname($path) . '/' . preg_replace('/\'|"/i', '', $file));
            }

            $content = preg_replace("/\/\*[^\/]+\*\//i", '', $content);
            $content = preg_replace("/^\/\/[^\n]+/i", '', $content);
            $content = preg_replace("/\n[ ]+\/\/[^\n]{0,}/i", '', $content);
            $content = preg_replace("/[ ]{2,}/i", '', $content);
            $content = preg_replace("/\r|\n/i", '', $content);
            $content = preg_replace("/ ?([=:\?;<\(\)\{\}]) ?/i", '$1', $content);

            static::$includedJS[$path] = $content;
        }

        return static::$includedJS;
    }

    /**
     * Get the scores
     * @param Request $request
     * @return Response The script content
     */
    public static function results(Request $request)
    {
        $origin   = $request->headers->get('Origin', $request->headers->get('Referer'));
        $response = static::getResponse('application/json', $origin);
        $session  = session();
        $data     = array();

        if (!$session->has('user')) {
            $email = $request->headers->get('php-auth-user', '');
            $pass =  $request->headers->get('php-auth-pw', '');

            if($email && $pass) {
                $organization = Organization::where(['email' => $email])->first();
                
                if($organization && $organization->password == hash('sha512', $pass)) {
                    $session->put('user', true);
                }
            }
        }

        if ($session->has('user')) {
            $search= Evaluation::with('webpage', 'results')
            ->select('evaluation.*', DB::raw('SUM(IF(result.type="feedback", 1, 0)) as `questions_asked`', 'questions_asked'), DB::raw('SUM(IF(result.type="feedback" AND result.status!="incomplete", 1, 0)) as `questions_answered`', 'questions_answered'))
            ->where('member.first_name', Site::getName() . ' user')
            ->leftJoin('member', 'member.id', '=', 'evaluation.member_id')
            ->leftJoin('result', 'result.evaluation_id', '=', 'evaluation.id')
            ->orderBy('evaluation.created_at', 'desc')
            ->groupBy('evaluation.id');

            $start = $request->has('start') ? Carbon::parse($request->get('start')) : Carbon::now()->subMonth()->startOfMonth();
            $search= $search->where('evaluation.created_at', '>=', $start);
            
            if($request->has('end')) {
                $end = Carbon::parse($request->get('end'));
                $search= $search->where('evaluation.created_at', '<=', $end);
            }

            $data= $search->get();

            $response->setContent(json_encode(['error' => 0, 'data' => $data], JSON_PRETTY_PRINT));
        } else {
            $response
            ->header('WWW-Authenticate', 'Basic')
            ->setStatusCode(401);
        }

        return $response;
    }

    /**
     * Get a valid response back
     *
     * @param String $type
     * @param String $origin
     *
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
