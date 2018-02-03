<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Evaluation;
use App\Models\Member;
use Illuminate\Http\Request;
use App\Facades\Tool;
use App\Facades\Site;
use Illuminate\Http\Response;

/**
 * Class UserController
 *
 * @package App\Http\Controllers\Site
 * @author  Zaïd Sadhoe <z.m.f.sadhoe@gmail.com>
 */
class UserController extends Controller
{
    /**
     * Get or create current user
     *
     * @param Request $request
     *
     * @return Response
     */
    public function current(Request $request)
    {
        return Tool::currentUser($request);
    }

    /**
     * tool
     *
     * @param Request $request
     *
     * @return Response
     */
    public function tool(Request $request)
    {
        return Tool::getScript($request->locale, $request->userKey, $request->tool, $request);
    }

    /**
     * User result API
     *
     * @param Request $request
     *
     * @return Response
     */
    public function result(Request $request)
    {
        return Tool::registerResult($request);
    }

    /**
     * Tool button page
     *
     * @param Request $request
     *
     * @return Response
     */
    public function toolButton(Request $request)
    {
        return Tool::getButton();
    }

    /**
     * Tool button script
     *
     * @param Request $request
     *
     * @return Response
     */
    public function toolButtonScript(Request $request)
    {
        return Tool::getButtonScript();
    }

    /**
     * tool
     *
     * @param Request $request
     *
     * @return Response
     */
    public function scores(Request $request)
    {
        return Tool::scores($request);
    }
    
    /**
     * User result API
     *
     * @param Request $request
     *
     * @return Response
     */
    public function results(Request $request)
    {
        return Tool::results($request);
    }
}