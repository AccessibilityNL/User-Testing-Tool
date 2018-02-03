// Include dependencies
include('_base.js');

/**
 * Module W3C nu
 *
 * @author Zaid Sadhoe
 */
Module.w3c_nu = Module._base.extend(function()
{
    'use strict';

    /** @var {object} The class instance reference. */
    var _self = this;

    /** @var {object} The static class reference. */
    var _static = this.constructor;

    /** @var {object} The object containing the HTML Element views. */
    var view = {};

    /** @var {string} The url to the W3C service. */
    this.serviceURL = 'https://validator.w3.org/nu/';

    /**
     * Construct method, executed before anything else is done
     */
    var _construct = function()
    {
        _self.collect();
    };

    /**
     * Collect usefull data for the test of this module
     *
     * @return void
     */
    this.collect = function()
    {
        if (typeof(this.data.html) === 'undefined') {
            var node    = document.doctype;
            var version = (node ? node.publicId.match(/x?html [0-9\.]+/ig) : null);

            this.data.version = version && version.length ? version[0].toUpperCase() : 'HTML 5';
            this.data.html    = document.documentElement.outerHTML;
            this.data.doctype = '';

            if (node) {
                this.data.doctype = '<!DOCTYPE ' + node.name +
                    (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') +
                    (!node.publicId && node.systemId ? ' SYSTEM' : '') +
                    (node.systemId ? ' "' + node.systemId + '"' : '') + '>';
            }
        }
    };

    /**
     * Execute the test of this module
     *
     * @param {function?} callback Callback method after execution completed
     * @return void
     */
    this.execute = function(callback)
    {
        this.status = 'progress';

        this.collect();

        var postData = new FormData();
        postData.append('out', 'json');
        postData.append('content', this.data.doctype + this.data.html);

        this.post(this.serviceURL, postData, function(data)
        {
            if (data) {
                _self.status        = 'pass';
                _self.data.errors   = 0;
                _self.data.warnings = 0;

                _self.data.source   = data.source;
                _self.data.messages = data.messages;

                for (var a = 0; a < data.messages.length; a++) {
                    var item = data.messages[a];

                    if (item.type === 'error') {
                        _self.status = 'fail';
                        _self.data.errors++;
                    } else if (item.type === 'info' && item.subtype === 'warning') {
                        _self.data.warnings++;
                    }
                }
            }

            if (callback) { callback(); }
        });
    };

    // call construct
    _construct();
});