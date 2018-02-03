// Include dependencies
include('_base.js');

/**
 * Module Rating
 *
 * @author Zaid Sadhoe
 */
Module.rating = Module._base.extend(function()
{
    'use strict';

    /** @var {object} The class instance reference. */
    var _self = this;

    /** @var {object} The static class reference. */
    var _static = this.constructor;

    /** @var {object} The object containing the HTML Element views. */
    var view = {};

    /** @var {float} The current status. */
    this.status = 2.5;

    /** @var {string} The scores URL. */
    this.scoresURL = scoresURL;

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
        var totalScore = 0;

        for (var a = 0; a < ratingGlobal.length; a++) {
            totalScore += parseInt(ratingGlobal[a].status);
        }

        _self.status = ratingGlobal.length ? Math.round((totalScore / ratingGlobal.length) * 10) / 10 : 'incomplete';
    };

    /**
     * Return the view for detail page
     *
     * @param {object} container The jQuery object of the container
     * @param {object} language
     * @param {string} sitepath
     * @param {object} modules
     *
     * @return {object} The JQuery object of the HTMLElement
     */
    this.viewDetail = function(container, language, sitepath, modules)
    {
        if (!view.detail) {
            var content = '';

            if (_self.status === 'incomplete') {
                content += '<p>' + language.ratingUnknown.join('</p><p>').replace(/\[([^\]]+)\]/ig, '<a href="' + language.w3c_ratingInfoLink + '" title="$1" tabindex="1">$1</a>') + '</p>';
            } else {
                content += '<p class="global">' +
                    '<strong>' + _self.status + '</strong>' +
                    '   <em class="star ' + (_self.status >= 1 ? 'full' : (_self.status >= 0.5 ? 'half' : '')) + '"></em>' +
                    '   <em class="star ' + (_self.status >= 2 ? 'full' : (_self.status >= 1.5 ? 'half' : '')) + '"></em>' +
                    '   <em class="star ' + (_self.status >= 3 ? 'full' : (_self.status >= 2.5 ? 'half' : '')) + '"></em>' +
                    '   <em class="star ' + (_self.status >= 4 ? 'full' : (_self.status >= 3.5 ? 'half' : '')) + '"></em>' +
                    '   <em class="star ' + (_self.status >= 5 ? 'full' : (_self.status >= 4.5 ? 'half' : '')) + '"></em>' +
                    '   <span>Totaal ' + ratingGlobal.length + ' stemmen</span>' +
                    '</p>';

                for (var a = 0; a < ratingGlobal.length; a++) {
                    var item    = ratingGlobal[a];
                    item.status = parseInt(item.status);

                    content += '<p class="comment">' +
                        '   <span class="stars">' +
                        '       <em class="star ' + (item.status >= 1 ? 'full' : '') + '"></em>' +
                        '       <em class="star ' + (item.status >= 2 ? 'full' : '') + '"></em>' +
                        '       <em class="star ' + (item.status >= 3 ? 'full' : '') + '"></em>' +
                        '       <em class="star ' + (item.status >= 4 ? 'full' : '') + '"></em>' +
                        '       <em class="star ' + (item.status >= 5 ? 'full' : '') + '"></em>' +
                        '   </span>' +
                        '   <time datetime="' + item.created_at + '">' + item.created_at + '</time>' +
                        '   <span>' + item.value + '</span>' +
                        '</p>';
                }
            }

            view.detail = _self.$('<div class="page rating">' +
                ' <header>' +
                '     <h2>' + 'Beoordeling' + '</h2>' +
                '     <p>' + 'Gebruikersbeoordeling van de pagina' + '</p>' +
                '     <img src="' + sitepath + '/images/' + 'icon-rating.svg' + '" alt="' + 'Beoordeling' + '" width="20" height="20"/>' +
                ' </header>' +
                ' <section>' + content + ' </section>' +
                ' <nav>' +
                '     <p>' + language.ratingInfo.replace(/\[([^\]]+)\]/ig, '<a href="' + language.w3c_ratingInfoLink + '" title="$1" tabindex="1">$1</a>') + '</p>' +
                ' </nav>' +
                '</div>');

            container.append(view.detail);
        }

        return view.detail;
    };

    /**
     * Return the view for the input form
     *
     * @return {object} The view
     */
    this.viewInput = function(language, addResult, sendResults)
    {
        if (!view.input) {
            var previous    = ratingData ? ratingData : {};
            previous.status = previous.status ? previous.status : 0;
            previous.value  = previous.value ? previous.value : '';

            view.input = _self.$('<div class="rating input">' +
                '   <h2>' + language.rating_input_title + '</h2>' +
                '   <p>' + language.rating_input_description + '</p>' +
                '   <p class="row">' +
                '       <span>' + language.rating_input_rating + '</span>' +
                '       <a href="#" class="star ' + (previous.status === '1' ? 'selected' : '') + '" data-value="1" tabindex="1">1</a>' +
                '       <a href="#" class="star ' + (previous.status === '2' ? 'selected' : '') + '" data-value="2" tabindex="1">2</a>' +
                '       <a href="#" class="star ' + (previous.status === '3' ? 'selected' : '') + '" data-value="3" tabindex="1">3</a>' +
                '       <a href="#" class="star ' + (previous.status === '4' ? 'selected' : '') + '" data-value="4" tabindex="1">4</a>' +
                '       <a href="#" class="star ' + (previous.status === '5' ? 'selected' : '') + '" data-value="5" tabindex="1">5</a>' +
                '   </p>' +
                '   <p class="row">' +
                '       <span>' + language.rating_input_remarks + '</span>' +
                '       <textarea tabindex="1">' + previous.value + '</textarea>' +
                '   </p>' +
                '   <p class="row">' +
                '       <a class="button disabled" href="#" title="' + language.rating_input_button + '" tabindex="1">' + language.rating_input_button + '</a>' +
                '   </p>' +
                '</div>');

            var timer  = null;
            var rank   = previous.status;
            var text   = view.input.find('textarea');
            var button = view.input.find('a.button');
            var stars  = view.input.find('a.star');
            var check  = function()
            {
                if (rank > 0 && text.val().search(/[^\s\t]/ig) !== -1) {
                    button.attr('tabindex', 1).removeClass('disabled');
                    return true;
                } else {
                    button.attr('tabindex', 100).addClass('disabled');
                }

                return false;
            };

            stars.on('click', function(e)
            {
                stars.removeClass('selected');
                _self.$(this).addClass('selected');

                rank = parseInt(_self.$(this).attr('data-value'));
                check();

                e.preventDefault();
            });

            text.on('change focus blur keyup paste cut copy', function(e)
            {
                clearTimeout(timer);
                timer = setTimeout(check, 20);
            });

            button.on('click', function(e)
            {
                if (check()) {
                    addResult('rating', 'feedback', rank, text.val());
                    sendResults();

                    view.input.html(
                        '<h2>' + language.rating_input_title + '</h2>' +
                        '<p>' + language.rating_input_send + '</p>'
                    );
                }

                e.preventDefault();
            });
        }

        return view.input;
    };
    
    /**
     * Return the view for the input form
     *
     * @return {object} The view
     */
    this.viewInput2 = function(language, addResult, sendResults, next)
    {
        if (!view.input) {
            var previous    = ratingData ? ratingData : {};
            previous.status = previous.status ? previous.status : 0;
            previous.value  = previous.value ? previous.value : '';

            view.input = _self.$('<div class="rating input">' +
                '   <h2 tabindex="1">' + language.rating_input_title + '</h2>' +
                '   <p>' + language.rating_input_description + '</p>' +
                '   <p class="row stars">' +
                '       <a href="#" class="star yes '+(previous.status == 5 ? 'selected' : '')+'" data-value="5" tabindex="1">' +
                '           <svg width="40px" height="50px" viewBox="0 0 100 110" version="1.1" xmlns="http://www.w3.org/2000/svg">' +
                '               <path d="M96.809,61.424c0.391,1.444 0.586,2.952 0.586,4.526c0,3.364 -0.826,6.51 -2.475,9.438c0.131,0.918 0.195,1.859 0.195,2.821c0,4.413 -1.302,8.303 -3.906,11.669l0,0.326c0.044,5.99 -1.812,10.708 -5.567,14.161c-3.754,3.454 -8.67,5.18 -14.745,5.18l-7.292,0c-4.557,0 -8.898,-0.48 -13.021,-1.441c-4.124,-0.962 -8.962,-2.405 -14.518,-4.328c-5.034,-1.749 -8.029,-2.621 -8.984,-2.621l-18.748,0c-2.301,0 -4.265,-0.82 -5.893,-2.459c-1.627,-1.638 -2.441,-3.618 -2.441,-5.933l0,-41.959c0,-2.316 0.814,-4.292 2.441,-5.931c1.629,-1.641 3.592,-2.459 5.893,-2.459l17.838,0c1.562,-1.051 4.535,-4.438 8.919,-10.161c2.561,-3.367 4.883,-6.141 6.966,-8.329c0.824,-0.918 1.497,-2.315 2.018,-4.195c0.521,-1.879 0.9,-3.725 1.139,-5.541c0.239,-1.812 0.793,-3.792 1.661,-5.93c0.868,-2.144 2.039,-3.936 3.515,-5.38c1.692,-1.615 3.645,-2.423 5.859,-2.423c3.646,0 6.924,0.708 9.832,2.128c2.907,1.421 5.122,3.639 6.641,6.654c1.519,2.972 2.28,7.039 2.28,12.195c0,4.064 -1.043,8.259 -3.126,12.587l11.458,0c4.514,0 8.42,1.662 11.72,4.982c3.298,3.321 4.946,7.234 4.946,11.736c-0.002,3.89 -1.064,7.454 -3.191,10.687Zm-81.379,24.19c-0.824,-0.831 -1.801,-1.246 -2.929,-1.246c-1.129,0 -2.106,0.415 -2.93,1.246c-0.825,0.831 -1.237,1.813 -1.237,2.951c0,1.136 0.412,2.118 1.237,2.949c0.825,0.831 1.801,1.246 2.93,1.246c1.128,0 2.105,-0.415 2.929,-1.246c0.825,-0.831 1.237,-1.813 1.237,-2.949c0,-1.136 -0.412,-2.12 -1.237,-2.951Zm73.698,-40.679c-1.693,-1.682 -3.623,-2.523 -5.795,-2.523l-22.916,0c0,-2.536 1.041,-6.021 3.124,-10.457c2.083,-4.438 3.125,-7.943 3.125,-10.523c0,-4.282 -0.694,-7.451 -2.083,-9.505c-1.389,-2.056 -4.166,-3.082 -8.332,-3.082c-1.13,1.136 -1.955,2.995 -2.476,5.574c-0.52,2.577 -1.182,5.321 -1.985,8.228c-0.802,2.906 -2.094,5.298 -3.873,7.18c-0.954,1.002 -2.626,2.992 -5.013,5.964c-0.173,0.218 -0.673,0.874 -1.497,1.967c-0.824,1.092 -1.508,1.987 -2.051,2.687c-0.542,0.7 -1.291,1.628 -2.246,2.787c-0.955,1.156 -1.823,2.121 -2.604,2.885c-0.782,0.764 -1.617,1.541 -2.507,2.328c-0.889,0.787 -1.758,1.377 -2.604,1.769c-0.846,0.392 -1.617,0.59 -2.311,0.59l-2.083,0l0,41.956l2.083,0c0.564,0 1.247,0.067 2.05,0.198c0.803,0.13 1.519,0.274 2.148,0.425c0.63,0.154 1.455,0.395 2.474,0.721c1.021,0.328 1.78,0.579 2.279,0.756c0.5,0.175 1.27,0.446 2.312,0.818c1.042,0.372 1.672,0.6 1.888,0.69c9.158,3.19 16.58,4.785 22.267,4.785l8.332,0c3.777,0 6.728,-0.895 8.854,-2.688c2.127,-1.792 3.19,-4.546 3.19,-8.261c0,-1.136 -0.109,-2.359 -0.324,-3.672c1.301,-0.697 2.332,-1.846 3.091,-3.441c0.76,-1.595 1.14,-3.2 1.14,-4.818c0,-1.615 -0.39,-3.126 -1.172,-4.523c2.3,-2.185 3.449,-4.785 3.449,-7.803c0,-1.092 -0.216,-2.305 -0.649,-3.638c-0.434,-1.333 -0.978,-2.372 -1.628,-3.113c1.389,-0.043 2.55,-1.072 3.483,-3.082c0.933,-2.01 1.4,-3.782 1.4,-5.31c0,-2.228 -0.848,-4.185 -2.54,-5.869Z"/>' +
                '           </svg>' +
                            language.rating_input_yes +
                '       </a>' +
                '       <a href="#" class="star no '+(previous.status == 1 ? 'selected' : '')+'" data-value="1" tabindex="1">' +
                '           <svg width="40px" height="50px" viewBox="0 0 100 110" version="1.1" xmlns="http://www.w3.org/2000/svg">' +
                '               <path d="M96.809,48.576c0.391,-1.444 0.586,-2.952 0.586,-4.526c0,-3.364 -0.826,-6.51 -2.475,-9.438c0.131,-0.918 0.195,-1.859 0.195,-2.821c0,-4.413 -1.302,-8.303 -3.906,-11.669l0,-0.326c0.044,-5.99 -1.812,-10.708 -5.567,-14.161c-3.754,-3.454 -8.67,-5.18 -14.745,-5.18l-7.292,0c-4.557,0 -8.898,0.48 -13.021,1.441c-4.124,0.962 -8.962,2.405 -14.518,4.328c-5.034,1.749 -8.029,2.621 -8.984,2.621l-18.748,0c-2.301,0 -4.265,0.82 -5.893,2.459c-1.627,1.638 -2.441,3.618 -2.441,5.933l0,41.959c0,2.316 0.814,4.292 2.441,5.931c1.629,1.641 3.592,2.459 5.893,2.459l17.838,0c1.562,1.051 4.535,4.438 8.919,10.161c2.561,3.367 4.883,6.141 6.966,8.329c0.824,0.918 1.497,2.315 2.018,4.195c0.521,1.879 0.9,3.725 1.139,5.541c0.239,1.812 0.793,3.792 1.661,5.93c0.868,2.144 2.039,3.936 3.515,5.38c1.692,1.615 3.645,2.423 5.859,2.423c3.646,0 6.924,-0.708 9.832,-2.128c2.907,-1.421 5.122,-3.639 6.641,-6.654c1.519,-2.972 2.28,-7.039 2.28,-12.195c0,-4.064 -1.043,-8.259 -3.126,-12.587l11.458,0c4.514,0 8.42,-1.662 11.72,-4.982c3.298,-3.321 4.946,-7.234 4.946,-11.736c-0.002,-3.89 -1.064,-7.454 -3.191,-10.687Zm-81.379,-24.19c-0.824,0.831 -1.801,1.246 -2.929,1.246c-1.129,0 -2.106,-0.415 -2.93,-1.246c-0.825,-0.831 -1.237,-1.813 -1.237,-2.951c0,-1.136 0.412,-2.118 1.237,-2.949c0.825,-0.831 1.801,-1.246 2.93,-1.246c1.128,0 2.105,0.415 2.929,1.246c0.825,0.831 1.237,1.813 1.237,2.949c0,1.136 -0.412,2.12 -1.237,2.951Zm73.698,40.679c-1.693,1.682 -3.623,2.523 -5.795,2.523l-22.916,0c0,2.536 1.041,6.021 3.124,10.457c2.083,4.438 3.125,7.943 3.125,10.523c0,4.282 -0.694,7.451 -2.083,9.505c-1.389,2.056 -4.166,3.082 -8.332,3.082c-1.13,-1.136 -1.955,-2.995 -2.476,-5.574c-0.52,-2.577 -1.182,-5.321 -1.985,-8.228c-0.802,-2.906 -2.094,-5.298 -3.873,-7.18c-0.954,-1.002 -2.626,-2.992 -5.013,-5.964c-0.173,-0.218 -0.673,-0.874 -1.497,-1.967c-0.824,-1.092 -1.508,-1.987 -2.051,-2.687c-0.542,-0.7 -1.291,-1.628 -2.246,-2.787c-0.955,-1.156 -1.823,-2.121 -2.604,-2.885c-0.782,-0.764 -1.617,-1.541 -2.507,-2.328c-0.889,-0.787 -1.758,-1.377 -2.604,-1.769c-0.846,-0.392 -1.617,-0.59 -2.311,-0.59l-2.083,0l0,-41.956l2.083,0c0.564,0 1.247,-0.067 2.05,-0.198c0.803,-0.13 1.519,-0.274 2.148,-0.425c0.63,-0.154 1.455,-0.395 2.474,-0.721c1.021,-0.328 1.78,-0.579 2.279,-0.756c0.5,-0.175 1.27,-0.446 2.312,-0.818c1.042,-0.372 1.672,-0.6 1.888,-0.69c9.158,-3.19 16.58,-4.785 22.267,-4.785l8.332,0c3.777,0 6.728,0.895 8.854,2.688c2.127,1.792 3.19,4.546 3.19,8.261c0,1.136 -0.109,2.359 -0.324,3.672c1.301,0.697 2.332,1.846 3.091,3.441c0.76,1.595 1.14,3.2 1.14,4.818c0,1.615 -0.39,3.126 -1.172,4.523c2.3,2.185 3.449,4.785 3.449,7.803c0,1.092 -0.216,2.305 -0.649,3.638c-0.434,1.333 -0.978,2.372 -1.628,3.113c1.389,0.043 2.55,1.072 3.483,3.082c0.933,2.01 1.4,3.782 1.4,5.31c0,2.228 -0.848,4.185 -2.54,5.869Z"/>' +
                '           </svg>' +
                            language.rating_input_no +
                '       </a>' +
                '   </p>' +
                '   <p class="row">' +
                '       <span>' + language.rating_input_remarks + '</span>' +
                '       <textarea tabindex="1" placeholder="'+ language.rating_input_placeholder +'">' + previous.value + '</textarea>' +
                '   </p>' +
                '   <p class="row">' +
                '       <a class="button" href="#" title="' + language.rating_input_button + '" tabindex="1">' + language.rating_input_button + '</a>' +
                '   </p>' +
                '</div>');

            var timer  = null;
            var rank   = previous.status;
            var text   = view.input.find('textarea');
            var button = view.input.find('a.button');
            var stars  = view.input.find('a.star');
            var check  = function()
            {
                if (rank > 0 && text.val().search(/[^\s\t]/ig) !== -1) {
                    button.attr('tabindex', 1).removeClass('disabled');
                    return true;
                } else {
                    button.attr('tabindex', 100).addClass('disabled');
                }

                return false;
            };

            stars.on('click', function(e)
            {
                stars.removeClass('selected');
                _self.$(this).addClass('selected');

                rank = parseInt(_self.$(this).attr('data-value'));
                addResult('rating', 'feedback', rank, text.val().trim());
                sendResults();
                // check();

                e.preventDefault();
            });

            text.on('change focus blur keyup paste cut copy', function(e)
            {
                // clearTimeout(timer);
                // timer = setTimeout(check, 20);
            });

            button.on('click', function(e)
            {
                button.attr('tabindex', 100).addClass('disabled');
                
                // if (check()) {
                    addResult('rating', 'feedback', rank, text.val().trim());
                    sendResults(function(){
                        _self.get(_self.scoresURL, function(data)
                        {
                            if (data) {
                                next(data);
                            }
                        });
                    });
                // }

                e.preventDefault();
            });

            // _self.get(_self.scoresURL, function(data)
            // {
            //     if (data) {
            //         next(data);
            //     }
            // });
        }

        return view.input;
    };

    // call construct
    _construct();
});