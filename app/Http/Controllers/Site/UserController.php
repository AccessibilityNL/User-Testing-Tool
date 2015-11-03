<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Facades\Tool;

class UserController extends Controller
{
    /**
     * tool
     *
     * @param Request $request
     * @param string $userKey
     * @param string $tool
     * @author Zaid Sadhoe <zaid@10forward.nl>
     */
    public function tool(Request $request)
    {
        return Tool::getScript($request->locale, $request->userKey, $request->tool, $request->server());
    }

    /**
     * User result API
     *
     * @param Request $request
     * @author Zaid Sadhoe <zaid@10forward.nl>
     */
    public function result(Request $request)
    {
        return Tool::registerResult($request);
    }

    /**
     * Tool button page
     *
     * @param Request $request
     * @author Zaid Sadhoe <zaid@10forward.nl>
     */
    public function toolButton(Request $request)
    {
        return Tool::getButton();
    }

    /**
     * Tool button script
     *
     * @param Request $request
     * @author Zaid Sadhoe <zaid@10forward.nl>
     */
    public function toolButtonScript(Request $request)
    {
        return Tool::getButtonScript();
    }
}