<?php

/**
 * Site routes
 *
 * @author Zaid Sadhoe <zaid@10forward.nl>
 */
Route::group(['namespace' => 'Site'], function()
{
    Route::get('/', ['as' => 'home', 'uses' => 'SiteController@indexAction']);

    Route::get('/{userKey}/{tool}.js', ['as' => 'tool', 'uses' => 'UserController@tool'])->where(['userKey' => '[a-zA-Z0-9]{128}']);
    Route::post('/{sessionKey}/{tool}/result', ['as' => 'result', 'uses' => 'UserController@result'])->where(['sessionKey' => '[a-zA-Z0-9]{128}']);
    Route::get('/button', ['as' => 'tool.button', 'uses' => 'UserController@toolButton']);
    Route::get('/button.js', ['as' => 'tool.button.script', 'uses' => 'UserController@toolButtonScript']);
});
