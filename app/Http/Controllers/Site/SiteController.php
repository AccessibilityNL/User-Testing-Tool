<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Facades\Site;
use App\Models\Member;
use App\Models\Webpage;
use App\Models\Result;

class SiteController extends Controller
{
    /**
     * indexAction
     *
     * @param Request $request
     * @author Zaid Sadhoe <zaid@10forward.nl>
     */
    public function indexAction(Request $request)
    {
        $ajax = new Request();
        $ajax->headers->set('X-Requested-With', 'XMLHttpRequest');

        $memberCount = Member::count();
        $webpageCount = Webpage::count();
        $resultCount = Result::count();

        return view('site.' . Site::getName() . '.page.index', [
            'request' => $request,
            'memberCount' => $memberCount,
            'webpageCount' => $webpageCount,
            'resultCount' => $resultCount
        ]);
    }
}