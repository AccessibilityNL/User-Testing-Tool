/** @var {object} The Module holder. */
var Module = typeof(Module) !== 'undefined' ? Module : {};

/**
 * [PUBLIC] Base Module Class
 * @author Zaid Sadhoe
 */
Module._base = function()
{
    'use strict';

    /** @var {object} The class instance reference. */
    var _self = this;

    /** @var {object} The static class reference. */
    var _static = this.constructor;

    /** @var {string} The current status. */
    this.status = 'incomplete';

    /** @var {object|array} The data containing detailed information about the test. */
    this.data = {};

    /**
     * Construct method, executed before anything else is done
     */
    var _construct = function() { };

    /**
     * Collect usefull data for the test of this module
     *
     * @return void
     */
    this.collect = function() {};

    /**
     * Execute the test of this module
     *
     * @param {function?} callback Callback method after execution completed
     * @return void
     */
    this.execute = function(callback) { };

    /**
     * Get the JQuery object
     *
     * @return {string} the jQuery selector
     * @return {object} the jQuery object
     */
    this.$ = function(selector)
    {
        return (selector ? jQunique(selector) : jQunique);
    };

    /**
     * Post data to a URL
     *
     * @param {string} url The url to post to
     * @param {object} data The data to post information to
     * @param {function?} callback Callback method after execution completed
     * @return void
     */
    this.post = function(url, data, callback)
    {
        _self.$().ajax({
            url        : url,
            method     : 'POST',
            dataType   : 'json',
            data       : data,
            processData: false,
            contentType: false,
            cache      : false,
            crossDomain: true,
            complete   : function() { if (callback) { callback(null); } },
            success    : function(data) { if (callback) { callback(data); } }
        });
    };

    /**
     * GET data from a URL
     *
     * @param {string} url The url to post to
     * @param {object} data The data to post information to
     * @param {function?} callback Callback method after execution completed
     * @return void
     */
    this.get = function(url, callback)
    {
        _self.$().ajax({
            url        : url,
            method     : 'GET',
            dataType   : 'json',
            processData: false,
            contentType: false,
            cache      : false,
            crossDomain: true,
            xhrFields  : { withCredentials: true },
            complete   : function() { if (callback) { callback(null); } },
            success    : function(data) { if (callback) { callback(data); } }
        });
    };

    /**
     * Execute the test of this module
     *
     * @param {function?} callback Callback method after execution completed
     * @return void
     */
    this.addResult = function(info)
    {
        _static.data.push(info);
    };
    this.getResult = function(info)
    {
        console.log(_static.data);
    };

    // call construct
    _construct();
};

/** @var {object} The collected data. */
Module._base.data = [];

/**
 * [PUBLIC STATIC] Extend method
 *
 * @param {Function} Class The new class to extend
 * @return {Function} Extended Class
 */
Module._base.extend = function(Class)
{
    Class.prototype             = new this();
    Class.prototype.constructor = Class;
    Class.extend                = this.extend;

    return Class;
};