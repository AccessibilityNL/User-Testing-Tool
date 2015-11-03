/**
 * Layout service class
 *
 * @author Zaid Sadhoe
 */
var Layout = new function ()
{
    'use strict';

    var self = this;

    /*
     * common used variables
     */
    var $window = null;

    /**
     * construct method
     *
     * @author Zaid Sadhoe
     */
    var __construct = function ()
    {
        $window = $(window);

        // setup toggle form
        self.setup($('#toggle_form'));

        // bind counters
        bindScroll();
    };

    /**
     * setup sections
     *
     * @param {Object} section - jQuery object of element
     * @param {Date} [time=new Date()] - time to execute
     * @param {string} [data=null] - html data
     * @author Zaid Sadhoe
     */
    this.setup = function (section, time, data)
    {
        var now = (new Date()).getTime();
        var wait = (now < time ? time - now : 0);

        setTimeout(function ()
        {
            // set content
            (typeof (data) !== 'undefined' ? section.html(data) : null);

            // bind forms
            bindForms(section);
        }, wait);
    };

    /**
     * activate counter
     *
     * @param {Object} section - jQuery object of element
     * @author Zaid Sadhoe
     */
    this.counterActivate = function ($item)
    {
        var startValue = parseInt($item.attr('data-start'));
        var endValue = parseInt($item.attr('data-end'));

        var step = function()
        {
                var value = Math.round(this.value);
                var text = value >= 1000 ? value.toString().substr(0, value.toString().length - 3) + '.' + value.toString().substr(-3) : value;
                var text = value >= 1000000 ? text.substr(0, text.length - 7) + '.' + text.substr(-7) : text;

                $item.text(text);
        };

        $({ value: startValue }).animate({ value: endValue }, {
            duration: 3000,
            easing: 'easeInOutExpo',
            step: step,
            complete: step
        });
    };

    /**
     * bind forms on sections
     *
     * @param {Object} section - jQuery object of element
     * @author Zaid Sadhoe
     */
    var bindForms = function (section)
    {
        section.find('form').each(function ()
        {
            var time = (new Date()).getTime() + 1;

            $(this).ajaxForm({
                error: function ()
                {
                    self.setup(section, time);
                },
                beforeSerialize: function ()
                {
                    onLoadStart(section);
                },
                success: function (data, status, request)
                {
                    self.setup(section, time, data);
                }
            });
        });
    };

    /**
     * [PRIVATE] bind scroll
     * @author Zaid Sadhoe
     */
    var bindScroll = function ()
    {
        var scrollCheckers = function ()
        {
            checkActive();
        };

        $window.on('scroll resize load', function ()
        {
            scrollCheckers();
        });

        scrollCheckers();
    };


    /**
     * [PRIVATE] check if item becomes active on scroll
     * @author Zaid Sadhoe
     */
    var checkActive = function ()
    {
        if ($window !== null) {
            var top = $window.scrollTop();
            var bottom = $window.scrollTop() + $window.innerHeight();

            $('[data-scroll-activate]').each(function (index, item)
            {
                var $item = $(item);

                var iTop = $item.offset().top - top;
                var iBottom = $item.offset().top + $item.outerHeight();

                if (iTop > 0 && iBottom < bottom) {
                    if (!$item.hasClass('active')) {
                        self[$item.attr('data-scroll-activate') + 'Activate']($item);
                        $item.addClass('active');
                    }

                    $item.addClass('reactive');
                } else {
                    $item.removeClass('reactive');
                }
            });
        }
    };

    /**
     * load starts handler
     *
     * @param {Object} section - jQuery object of element
     * @author Zaid Sadhoe
     */
    var onLoadStart = function (section)
    {
        $('html, body').stop().animate({ scrollTop: section.offset().top }, 1000);
    };

    // call construct on DOM complete
    $(__construct);
};