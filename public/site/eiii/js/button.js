/**
 * Button service class
 *
 * @author Zaid Sadhoe
 */
var eiiiButton = function (styleID, styleURL, contentID, content)
{
    'use strict';

    var self = this;

    /**
     * construct method
     *
     * @author Zaid Sadhoe
     */
    var __construct = function ()
    {
        var testLoaded = document.getElementById(contentID);

        if (testLoaded) {
            self.createStyle(styleID, styleURL);
            self.createContent(contentID, content);
        } else
        {
            window.onload = __construct;
        }
    };

    /**
     * Create style method
     *
     * @param {string} id Id of the style element
     * @param {string} url URL to load
     */
    this.createStyle = function (id, url)
    {
        if (!document.getElementById(id)) {
            var link = document.createElement('link');
            link.id = id;
            link.rel = 'stylesheet';
            link.href = url;

            document.getElementsByTagName('head')[0].appendChild(link);
        }
    };

    /**
     * Create style method
     *
     * @param {string} id Id of the style element
     * @param {string} content Content to load
     */
    this.createContent = function (id, content)
    {
        var buttonHolder = document.getElementById(id);

        if (buttonHolder) {
            buttonHolder.innerHTML = content;
        }
    };

    // call construct
    __construct();
};