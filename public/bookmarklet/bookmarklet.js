new (function () {
    var self = this,
        layout = null,
        pages = {},
        licenseInfo =  (typeof(licenseData) !== 'undefined' ? licenseData :{ ends_at: (new Date()).toLocaleDateString()}),
        versionInfo =  (typeof(versionData) !== 'undefined' ? versionData :{ number: '0.9.1', date: (new Date()).toLocaleDateString(), time: (new Date()).toLocaleTimeString()}),
        resultInfo = (typeof(resultData) !== 'undefined' ? resultData : []),
        divSelection,
        images = [],
        inputImages = [],
        links = [],
        externalCSS = [],
        allElementsWithStyle = [],
        internalCSS = [],
        allElements = [],
        externalJS = [],
        iframes = [],
        objects = [],
        canvases = [],
        embeds = [],
        svgs = [],
        headers = [],
        lang = 'en',
        results = [],
        resultsURL = (typeof(dataURL) !== 'undefined' ? dataURL : ''),
        linkCheckerURL = (typeof(linkURL) !== 'undefined' ? linkURL : ''),
        pdfURL = (typeof(reportURL) !== 'undefined' ? reportURL : '');

    var $ = null;

    var poll = new Module.poll();

    var modules = {
        'title'      : {icon: 'icon-paginatitel.svg', status: 'incomplete', view: getModuleTitlePage},
        'headings'   : {icon: 'icon-koppen.svg', status: 'incomplete', items: [], view: getModuleHeadingsPage},
        poll         : {icon: 'icon-rating.svg', status: poll.status, items: [], view: poll.viewQuestion},
        //'brokenlinks': {icon: 'icon-gebrokenlink.svg', status: 'pass', items: [], view: getModuleBrokenLinksPage},
        //'readlevel'  : {icon: 'icon-leesniveau.svg', status: 'incomplete', view: getModuleReadLevelPage},
        'image_alt'  : {icon: 'icon-images.svg', status: 'incomplete', items: [], view: getModuleImagesPage},
        'caption'    : {icon: 'icon-navigation.svg', status: 'disabled', view: null}
    };

    init = function () {
        loadFiles([
            sitepath + 'scripts/jquery.js',
            sitepath + 'scripts/lang.' + lang + '.js',
            sitepath + 'styles/tool.css'
        ], function () {
            $ = jQunique;

            divSelection = $('div,p,article,aside,header,footer,section');

            loadSABMDiv();
        });
    };

    function loadFiles(files, callback) {
        var loaded = 0;

        for (var a = 0; a < files.length; a++) {
            if (files[a].substr(-2) == 'js') {
                loaded--;
                loadScript(files[a], function (e) {
                    loaded++;
                    (loaded === 0 ? callback() : null);
                });
            } else {
                loadStyle(files[a])
            }
        }
    };

    function loadScript(file, callback) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = file + '?v=' + versionInfo.number + '+' + versionInfo.date + '+' + versionInfo.time;
        script.onload = callback;

        setTimeout(function () {
            document.getElementsByTagName('head')[0].appendChild(script);
        }, 1);
    };

    function loadStyle(file) {
        var style = document.createElement('link');
        style.type = 'text/css';
        style.rel = 'stylesheet';
        style.href = file + '?v=' + versionInfo.number + '+' + versionInfo.date + '+' + versionInfo.time;
        style.media = 'screen';

        document.getElementsByTagName('head')[0].appendChild(style);
    };

    function scanTextJSON(text, callback) {
        $.ajax({
            url: sitepath + '../leesniveau/index.php',
            method: 'GET',
            cache: false,
            data: {text: text },
            complete: function(data){
                if (data.status === 'error') {
                    //console.log('De leesniveau tool is niet beschikbaar.')
                } else {
                    (callback ? callback(data.responseText) : null);
                }
            }
        });
    };

    function addResult(module, type, status, value, info){
        results.push({
            module: module,
            type: type,
            status: status,
            value: (value ? value : ''),
            info: (info ? info : '')
        });
    };

    function previousResultStatus(module, type, value, info) {
        for (var a in resultInfo) {
            var item = resultInfo[a];
            if (item.module == module && item.type == type && item.value == value && item.info == info) {
                return item.status;
            }
        }

        return 'incomplete';
    };

    function sendResults(){
        if (results.length) {
            $.ajax({
                url        : resultsURL,
                method     : 'POST',
                dataType   : 'json',
                cache      : false,
                crossDomain: true,
                xhrFields  : {withCredentials: true},
                data       : {results: results},
                success    : function(data)
                {
                    if (data.status === 'error') {
                        //console.log('API fail');
                    } else {
                        results = []; // reset results array
                    }
                }
            });
        }
    };
    function loadSABMDiv() {
        var objectId, toolkit;
        $(document).ready(function () {
            var div, content;

            // initialisation of DOM elements
            allElementsWithStyle = $('*[style]');
            allElements = $('*');
            externalCSS = $('link[rel=stylesheet]');
            internalCSS = $('style');
            externalJS = $('script');
            inputImages = $('input[src]');
            images = $('img');
            links = $('a');
            iframes = $('iframe');
            objects = $('object');
            embeds = $('embed');
            canvases = $('canvas');
            svgs = $('svg');
            headers = $('h1, h2, h3, h4, h5, h6');

            // reset tabs first
            tabIndexReset();

            // create Bookmarklet
            $('body').prepend(createLayoutView());

            var home = getHomePage();

            home.delay(500).queue(function(){ $(this).addClass('active'); });

            // object-elements are likely to interfere with bookmarklet, therefore we hide these.
            $('object').each(function () {
                $(this).css({ 'display': 'none' });
            });

            // looks like a hack, but is actually hack to undo hacks by site builders ;-)
            $('#SABM').topZIndex({ increment: 100000000 });

            // make element draggable
            dragEl('#SABM', '#SABM > header');

            // open
            self.open();
        });
    };
    this.open = function ()
    {
        if($.ui) {
            $('#SABM').animate({ 'top': '50px' }, 1500, "easeOutBounce");
        } else {
            $('#SABM').animate({ 'top': '50px' }, 500);
        }
    };
    this.close = function()
    {
        $('#SABM').animate({ 'top': '-600px' }, 600);
    };

    function dragEl(el, handler) {
        if($.ui) {
            $(el).draggable({
                handle: $(handler),
                containment: 'window',
                drag: function (event, ui) { $(handler).addClass('active'); },
                stop: function (event, ui) { $(handler).removeClass('active'); }
            });
        }
    };

    function tabIndexReset(){
        var tabIndex = 100;
        $('a').each(function(){
            $(this).attr('tabindex', tabIndex);
            tabIndex++;
        });
    }

    function unbindElements(el) {
        // $(el).unbind('mouseover')
        //     .unbind('mouseout')
        //     .unbind('click');
    };

    function elementCheck() {
        // $(divSelection).on({
        //     'mouseover': function () {
        //         $(this).addClass('highlight');
        //         return false;
        //     },
        //     'mouseout': function () {
        //         $(this).removeClass('highlight');
        //         return false;
        //     },
        //     'click': function () {
        //         var content = $(this).text()
        //             .trim()
        //             .replace(/\t/g, '')
        //             .replace(/[ ]{2,}/ig, '')
        //             .replace(/[\n\r]{3,}/ig, '\n\n');
        //         $('#SABM #text').val(content).focus();
        //         return false;
        //     }
        // });
    };

    function titleTest() {
        modules.title.value = $('head>title').html();

        if ($('head>title').is('*')) {

            if (modules.title.value == null || modules.title.value == '' || modules.title.value == ' ') {
                // if title-element is found but empty, #fail
                modules.title.status = 'fail';
                modules.title.error = 'empty';

                addResult('title', 'empty', 'fail', modules.title.value);

            } else if ($('head>title').length > 1) {
                // if more than one title-element is found, #fail
                modules.title.status = 'fail';
                modules.title.error = 'multiple';

                addResult('title', 'multiple', 'fail', modules.title.value);

            } else {
                // else: #pass
                modules.title.status = previousResultStatus('title', 'feedback', modules.title.value, '');
                modules.title.error = null;

                addResult('title', 'all', 'pass', modules.title.value);
                addResult('title', 'feedback', modules.title.status, modules.title.value);
            }
        } else { // if title-element is not found, #fail
            modules.title.status = 'fail';
            modules.title.error = 'exists';

            addResult('title', 'exists', 'fail', modules.title.value);
        }
    }

    function headingTest() {
        modules.headings.status = 'pass';

        headers.each(function (index, value) {
            // get type of element and value of element
            var el = $(this);
            var heading = {
                type: this.nodeName.toLowerCase(),
                num: parseInt(this.nodeName.replace(/h/ig, '')),
                value: el.text().trim(),
                el: el,
                status: 'incomplete'
            };

            var prevHeading = modules.headings.items[modules.headings.items.length - 1];

            if (modules.headings.items.length === 0 && heading.num > 1) {
                // first heading is not H1!
                modules.headings.status = heading.status = 'fail';
                modules.headings.error = heading.error = 'first';
                addResult('heading', 'first', 'fail', heading.type, heading.value);
            }
            else if (modules.headings.items.length > 0 && heading.num - prevHeading.num > 1) {
                // heading is out of order
                modules.headings.status = heading.status = 'fail';
                modules.headings.error = heading.error = 'order';
                addResult('heading', 'order', 'fail', heading.type, heading.value);
            }
            else if (heading.value === '' || heading.value === null || heading.value === undefined) {
                // heading is empty
                modules.headings.status = heading.status = 'fail';
                modules.headings.error = heading.error = 'empty';
                addResult('heading', 'empty', 'fail', heading.type, heading.value);
            } else {
                // else: #pass
                heading.status = previousResultStatus('heading', 'feedback', heading.type, heading.value);
                heading.error = null;

                addResult('heading', 'all', 'pass', heading.type, heading.value);
                addResult('heading', 'feedback', heading.status, heading.type, heading.value);
            }

            if (heading.status == 'fail') {
                modules.headings.status = 'fail';
            } else if (modules.headings.status !== 'fail' && heading.status === 'incomplete') {
                modules.headings.status = 'incomplete';
            }

            // put the heading type-value and heading text value in an array. Might be of help for
            modules.headings.items.push(heading);
        });
    }

    function imagesTest()
    {
        modules.image_alt.status = 'pass';

        images.each(function(index, value)
        {
            // get type of element and value of element
            var el    = $(this);
            var image = {
                el    : el,
                status: 'incomplete',
                width : el[0].clientWidth,
                height: el[0].clientHeight,
                alt   : this.getAttribute('alt'),
                hidden: (el.css('display') === 'none' || el.css('visibility') === 'hidden'),
                src   : (el.attr('data-src') && el.attr('data-src').toString() !== '' ? el.attr('data-src') : this.src)
            };

            if (!image.hidden && (image.width > 101 || image.height > 101)) {
                if (image.alt === null) {
                    modules.image_alt.status = image.status = 'fail';
                    modules.image_alt.error = image.error = 'alt';
                    addResult('image', 'alt', 'fail', image.src);
                } else {
                    // else: #pass
                    image.status = previousResultStatus('image', 'feedback', image.src, image.alt);
                    image.error  = null;

                    addResult('image', 'all', 'pass', image.src, image.alt);
                    addResult('image', 'feedback', image.status, image.src, image.alt);
                }

                if (image.status === 'fail') {
                    modules.image_alt.status = 'fail';
                } else if (modules.image_alt.status !== 'fail' && image.status === 'incomplete') {
                    modules.image_alt.status = 'incomplete';
                }

                modules.image_alt.items.push(image);
            }
        });
    }

    function brokenLinksTest(callback)
    {
        var urls = [];

        links.each(function()
        {
            var href = this.href ? this.href.toString() : '';

            if (href &&
                $(this).attr('href').indexOf('#') !== 0 && // no hashlinks
                $(this).attr('href').indexOf('/#') !== 0 && // no hashlinks
                $(this).attr('href').indexOf('mailto:') !== 0 && // no mailto's
                $(this).attr('href').indexOf('tel:') !== 0 &&// no tel:
                $(this).attr('href').indexOf('javascript:') !== 0 // no javascript:
            ) {
                if (urls.indexOf(href) === -1) {
                    urls.push(href);
                }
            }
        });

        if (urls.length > 0) {
            $.ajax({
                url        : linkCheckerURL,
                method     : 'POST',
                dataType   : 'json',
                cache      : false,
                crossDomain: true,
                xhrFields  : {withCredentials: true},
                data       : {urls: urls},
                complete   : function() { if (callback) { callback(); } },
                success    : function(data)
                {
                    if (data.status !== 'error') {
                        links.each(function()
                        {
                            var href = this.href ? this.href.toString() : '';

                            if (typeof(data.urls[href]) !== 'undefined') {
                                var status = data.urls[href];

                                if (status !== 200 && status !== 301) {
                                    modules.brokenlinks.status = 'fail';
                                    modules.brokenlinks.items.push({
                                        code: data.urls[href],
                                        url : href,
                                        text: $(this).text(),
                                        el  : $(this)
                                    });

                                    addResult('link', 'status', 'fail', href, status);
                                }
                            }
                        });

                        sendResults();
                    }
                }
            });
        }
    }

    function runTestSuite(){
        // run test and prepare feedback per test
        titleTest();
        headingTest();
        imagesTest();
        //brokenLinksTest(updateOverviewPage);

        showProgress();
        sendResults();
    }

    this.showPreviousPage = function () {

        if (pages.overview) {
            self.showPage(pages.overview, true, false);
        } else {
            self.showPage(pages.home, false, false);
        }

        // unbindElements(divSelection);
    };

    this.showPage = function (page, compact, back) {
        if (page) {
            var backButton = layout.find('>footer>a.back');
            var saveButton = layout.find('>footer>a.save');

            // show or hide back button
            if (back) {
                backButton.removeClass('disabled');

                if (pages.overview) {
                    backButton.attr('title', language.backToOverview).html(language.backToOverview);
                } else {
                    backButton.attr('title', language.backToHome).html(language.backToHome);
                }
            } else {
                backButton.addClass('disabled');
            }

            saveButton.text(language.save);

            // show compact mode
            (compact ? layout.addClass('compact') : layout.removeClass('compact'));

            // make current page active
            setTimeout(function () {
                layout.find('.page.active').removeClass('active');
                page.addClass('active');
            }, 50);

            // make first element of page get focus
            setTimeout(function () {
                page.find('a, textarea, section img').first().focus();
            }, 1000);
        }
    };

    function showProgress() {
        var link   = pages.home.find('a');
        var text   = link.find('span');
        var circle = link.find('circle');

        circle.attr('stroke-width', '0.5');

        var settings = {value: 0, end: 1};
        var step = function () {
            var newValue = Math.round(settings.value * 100);

            var length = (18 * Math.PI);
            var start  = ((settings.value < 0.75 ? 0 : (settings.value - 0.75) * 4) * (length * 0.25));
            var gap    = (length * 0.25) - start;
            var size   = (settings.value * length) - start;

            text.text(newValue + '%');
            circle.attr('stroke-dasharray', start + ' ' + gap + ' ' + size + ' ' + length);
        };

        link.addClass('active');

        $(settings).stop().animate({value: settings.end}, {
            duration: 1000,
            easing: 'linear',
            step: step,
            complete: function () {
                step();
                setTimeout(function () {
                    self.showPage(getOverviewPage(), true, false);
                }, 100);
            }
        });
    }

    function createLayoutView() {
        layout = $('<div id="SABM">'
            + ' <header>'
            + '     <h1>' + language.toolTitle + '</h1>'
            + '     <p>' + language.toolTagline + '</p>'
            + ' </header>'
            + ' <nav>'
            + '     <a href="#" class="info" title="' + language.info + '" tabindex="2">'
            + '         <span>' + language.info + '</span>'
            + '         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250" width="20px" height="20px">'
            + '             <title>' + language.info + '</title>'
            + '             <path d="m172.48 53.649c-12.795 10.891-31.76 10.655-42.37-0.532-10.607-11.181-8.837-29.076 3.955-39.969 12.794-10.89 31.763-10.654 42.37 0.525 10.606 11.186 8.838 29.08-3.955 39.976zm-58.45 187.68c-28.21 9.913-51.466-1.455-46.801-28.547 4.667-27.098 31.436-85.109 35.255-96.079 3.816-10.97-3.502-13.977-11.346-9.513-4.524 2.61-11.248 7.841-17.02 12.925-1.601-3.223-3.852-6.906-5.542-10.433 9.419-9.439 25.164-22.094 43.803-26.681 22.27-5.497 59.492 3.29 43.494 45.858-11.424 30.34-19.503 51.276-24.594 66.868-5.088 15.598 0.955 18.868 9.863 12.791 6.959-4.751 14.372-11.214 19.806-16.226 2.515 4.086 3.319 5.389 5.806 10.084-9.433 9.669-34.108 32.296-52.724 38.953z"></path>'
            + '         </svg>'
            + '     </a>'
            + '     <a href="#" class="close" title="' + language.close + '" tabindex="3">'
            + '         <span>' + language.close + '</span>'
            + '         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250" width="20px" height="20px">'
            + '          <title>' + language.close + '</title>'
            + '             <path d="m250 206.29l-81.3-81.3c27.1-27.1 54.19-54.2 81.29-81.301l-43.71-43.686c-27.09 27.096-54.19 54.192-81.28 81.288l-81.294-81.281-43.706 43.677c27.103 27.101 54.206 54.201 81.309 81.303-27.101 27.1-54.202 54.2-81.302 81.31 14.559 14.56 29.118 29.13 43.677 43.7 27.105-27.107 54.21-54.215 81.315-81.322l81.315 81.309c14.57-14.57 29.13-29.14 43.69-43.7z"></path>'
            + '         </svg>'
            + '     </a>'
            + ' </nav>'
            + ' <section></section>'
            + ' <footer>'
            + '     <a href="#" tabindex="1" title="' + language.backToHome + '" class="back disabled">' + language.backToHome + '</a>'
            + '     <a href="#" tabindex="1" title="' + language.save + '" class="save right">' + language.save + '</a>'
            + ' </footer>'
            + '</div>');

        layout.find('.close').on('click', function(e){ self.close();e.preventDefault(); });
        layout.find('.info').on('click', function(e){ self.showPage(getInfoPage(), true, true);e.preventDefault(); });
        layout.find('.back').on('click', function(e){ self.showPreviousPage();e.preventDefault(); });
        layout.find('.save').on('click', function(e){ e.currentTarget.innerText = language.saved;e.preventDefault(); });

        return layout;
    }

    function getHomePage() {
        if (!pages.home) {
            pages.home = $('<div class="page home">'
                + ' <section>'
                + '     <p>' + language.homeDesc.join('</p><p>') + '</p><br/>'
                + '     <p>'
                + '         <a href="#" title="' + language.homeStart + '" tabindex="1">'
                + '             <span>' + language.homeStart + '</span>'
                + '             <img src="' + sitepath + '/images/progress.svg" alt="' + language.homeStart + '" width="20" height="20"/>'
                + '             <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20">'
                + '                 <title>' + language.homeStart + '</title>'
                + '                 <circle stroke="rgba(255, 255, 255, 0.5)" stroke-width="0" fill="none" r="9" cx="10" cy="10" stroke-dasharray="0 14.13717 0 57"></circle>'
                + '             </svg>'
                + '         </a>'
                + '     </p>'
                + ' </section>'
                + '</div>');

            pages.home.find('a').on('click', function (e) { runTestSuite();e.preventDefault(); });

            layout.find('>section').append(pages.home);
        }

        return pages.home;
    }

    function getInfoPage() {
        if (!pages.info) {
            var links = '';
            var faq = '';

            for (var a in language.infoLinks) {
                links += '<a href="' + language.infoLinks[a] + '" title="' + a + '" target="_blank" tabindex="1">' + a + '</a>';
            }

            for (var b in language.faq) {
                var text = language.faq[b].replace(/\[([^\]]+)\]/ig, function (match, p1) {
                    return '<a href="' + language.faqLinks[p1] + '" title="' + p1 + '" target="_blank" tabindex="1">' + p1 + '</a>';
                });

                faq += '<dt><a href="#" title="' + b + '" tabindex="1">' + b + '</a></dt><dd>' + text + '</dd>';
            }

            pages.info = $('<div class="page nav-small">'
                + ' <header>'
                + '     <h2>' + language.infoTitle + '</h2>'
                + '     <p>' + language.infoVersion + ' ' + versionInfo.number + ', ' + versionInfo.date + '</p>'
                + '     <img src="' + sitepath + '/images/icon-info.svg" alt="' + language.infoTitle + '" width="20" height="20"/>'
                + ' </header>'
                + ' <section>'
                + '     <p>' + language.infoDesc.replace(/\[([^\]]+)\]/ig, '<a href="' + language.infoDescLink + '" title="$1" tabindex="1">$1</a>').replace(/\n/ig, '</p><p>') + '</p>'
                + '     <p>' + language.infoAuthor + '</p>'
                + '     <dl class="large">' + faq + '</dl>'
                + ' </section>'
                + ' <nav>' + links + '</nav>'
                + '</div>');

            pages.info.find('dt>a').on('click', function(e){
                var prev = pages.info.find('dt.active');
                var curr = $(this).parent();

                if(prev[0] !== curr[0]){
                    prev.removeClass('active')
                }

                curr.toggleClass('active');
                e.preventDefault();
            });

            layout.find('>section').prepend(pages.info);
        }

        // unbindElements(divSelection);

        return pages.info;
    }

    function getOverviewPage() {
        if (!pages.overview) {
            var links = '';
            var date = new Date();
            var dateStr = (date.getDate() < 10 ? '0' : '') + date.getDate() + '-'
                + (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1) + '-'
                + date.getFullYear()
                + ' at '
                + (date.getHours() < 10 ? '0' : '') + date.getHours() + ':'
                + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
                + '';

            for (var a in modules) {
                links += '<li class="' + a + '">'
                    + ' <' + (modules[a].status == 'disabled' ? 'span' : 'a tabindex="1"') + ' href="#" title="' + language[a + 'Title'] + '">'
                    + '     <img src="' + sitepath + 'images/' + modules[a].icon + '" alt="' + language[a + 'Title'] + '" width="20" height="20"/>'
                    + '     <span>' + language[a + 'Title'] + '</span>'
                    + '     <em></em>'
                    + ' </' + (modules[a].status == 'disabled' ? 'span' : 'a') + ' >'
                    + '</li>';
            }

            pages.overview = $('<div class="page overview no-nav">'
                + ' <header>'
                + '     <h2>' + language.overviewTitle + '</h2>'
                + '     <p>' + language.overviewDesc + ' ' + dateStr + ' </p>'
                + '     <img src="' + sitepath + '/images/icon-results.png" alt="' + language.overviewTitle + '" width="20" height="20"/>'
                + ' </header>'
                + ' <section>'
                + '     <ul>' + links + '</ul>'
                + ' </section>'
                //+ ' <nav>'
                //+ ' <a class="button report" href="#" title="' + language.overviewButtonReport + '" tabindex="1">' + language.overviewButtonReport + '</a>'
                //+ ' <a class="button restart" href="#" title="' + language.overviewButtonRestart + '" tabindex="1">' + language.overviewButtonRestart + '</a>'
                //+ ' </nav>'
                + '</div>');

            //pages.overview.find('.report').on('click', function(e){ self.showPage(getReportPage(), true, true);e.preventDefault(); });
            //pages.overview.find('.restart').on('click', function(e){ self.showPage(getRestartPage(), false, false);e.preventDefault(); });
            pages.overview.find('li a').on('click', function(e) { self.showPage(getModulePage(this), true, true); e.preventDefault(); });

            updateOverviewPage();

            layout.find('>section').append(pages.overview);
        }

        return pages.overview;
    }

    function updateOverviewPage()
    {
        if (pages.overview) {
            for (var a in modules) {
                var status = modules[a].status;
                var item   = pages.overview.find('li.' + a + ' em');
                var text   = (language[status] ? language[status] : status);

                item.text(text)
                    .attr('title', text)
                    .removeClass()
                    .addClass(status);
            }
        }
    }

    function getRestartPage() {
        if (!pages.restart) {
            pages.restart = $('<div class="page content-only">'
                + ' <section>'
                + '     <p>' + language.restartDesc.join('</p><p>') + '</p>'
                + '     <p class="answer"><a class="button" href="#" title="' + language.restartOk + '" tabindex="1">' + language.restartOk + '</a></p>'
                + ' </section>'
                + '</div>');

            pages.restart.find('a').on('click', function(e){ self.showPage(getOverviewPage(), true, false);e.preventDefault(); });

            layout.find('>section').prepend(pages.restart);
        }

        return pages.restart;
    }

    function getReportPage() {
        if (!pages.report) {
            pages.report = $('<div class="page no-nav">'
                + ' <header>'
                + '     <h2>' + language.reportTitle + '</h2>'
                + '     <p>' + language.reportDesc + '</p>'
                + '     <img src="' + sitepath + '/images/icon-results.png" alt="' + language.reportTitle + '" width="20" height="20"/>'
                + ' </header>'
                + ' <section>'
                + '     <p><a class="button" href="' + pdfURL + '" target="_blank" title="' + language.reportDownload + '" tabindex="1">' + language.reportDownload + '</a></p>'
                + ' </section>'
                + '</div>');

            layout.find('>section').append(pages.report);
        }

        return pages.report;
    }

    function getModulePage(el) {
        var module = modules[el.parentNode.className];

        return (module.view ? module.view(layout.find('>section'), language, sitepath, modules, addResult, sendResults, updateOverviewPage, self.showPage, self.showPreviousPage) : null);
    }

    function getModuleTitlePage() {
        if (!pages.moduleTitle) {
            var content = '';

            if (modules.title.error != null) {
                content = '<p><strong>' + language.titleError + '</strong></p>'
                    + '<p>' + language['titleError_' + modules.title.error] + '</p>';
            } else {
                content = '<p>' + language.titleFound + '</p>'
                    + '<p class="value">' + modules.title.value + '</p>'
                    + '<p>' + language.titleQuestion + '</p>'
                    + '<p class="answer">'
                    + ' <a class="button yes ' + (modules.title.status == 'pass' ? 'active' : '') + '" href="#" title="' + language.yes + '" tabindex="1">' + language.yes + '</a>'
                    + ' <a class="button no ' + (modules.title.status == 'fail' ? 'active' : '') + '" href="#" title="' + language.no + '" tabindex="1">' + language.no + '</a>'
                    + '</p>';
            }

            pages.moduleTitle = $('<div class="page">'
                + ' <header>'
                + '     <h2>' + language.titleTitle + '</h2>'
                + '     <p>' + language.titleDesc + '</p>'
                + '     <img src="' + sitepath + '/images/' + modules.title.icon + '" alt="' + language.titleTitle + '" width="20" height="20"/>'
                + ' </header>'
                + ' <section>' + content + ' </section>'
                + ' <nav>'
                + '     <p>' + language.titleInfo.replace(/\[([^\]]+)\]/ig, '<a href="' + language.titleInfoLink + '" title="$1" tabindex="1">$1</a>') + '</p>'
                + ' </nav>'
                + '</div>');

            pages.moduleTitle.find('.answer a').on('click', function (e) {
                var el = $(this);

                modules.title.status = (el.hasClass('yes') ? 'pass' : 'fail');

                pages.moduleTitle.find('.answer a').removeClass('active');
                el.addClass('active');
                addResult('title', 'feedback', modules.title.status, modules.title.value);
                sendResults();

                updateOverviewPage();
                e.preventDefault();
            });


            layout.find('>section').append(pages.moduleTitle);
        }

        return pages.moduleTitle;
    }

    function getModuleHeadingsPage() {
        if (!pages.moduleHeadings) {
            var content = '<ul>';

            for (var a = 0; a < modules.headings.items.length; a++) {
                var item     = modules.headings.items[a];
                var previous = modules.headings.items[a - 1];

                if (item.error != null) {
                    subcontent = '<p>' + language['headingsError_' + item.error].replace('[current]', item.type).replace('[previous]', (previous ? previous.type : '')) + '</p>';
                } else {
                    subcontent = '<p>' + language.headingsQuestion + '</p>'
                        + '<p class="answer">'
                        + ' <a class="button yes ' + (item.status == 'pass' ? 'active' : '') + '" href="#" title="' + language.yes + '" tabindex="1">' + language.yes + '</a>'
                        + ' <a class="button no ' + (item.status == 'fail' ? 'active' : '') + '" href="#" title="' + language.no + '" tabindex="1">' + language.no + '</a>'
                        + '</p>'
                }

                content += '<li data-id="' + a + '" class="' + item.type + ' ' + a + ' ' + (item.status != 'pass' ? 'active' : '') + '">'
                    + '  <a href="#" title="' + item.value + '" tabindex="1">'
                    + '      <span>' + (item.value ? item.value : '&nbsp;') + '</span>'
                    + '      <em></em>'
                    + '  </a>'
                    + '  <div>'
                    + subcontent
                    + '  </div>'
                    + '</li>';
            }

            content += '</ul>';

            pages.moduleHeadings = $('<div class="page headings">'
                + ' <header>'
                + '     <h2>' + language.headingsTitle + '</h2>'
                + '     <p>' + language.headingsDesc + '</p>'
                + '     <img src="' + sitepath + '/images/' + modules.headings.icon + '" alt="' + language.headingsTitle + '" width="20" height="20"/>'
                + ' </header>'
                + ' <section>'
                + content
                + ' </section>'
                + ' <nav>'
                + '     <p>' + language.headingsInfo.replace(/\[([^\]]+)\]/ig, '<a href="' + language.headingsInfoLink + '" title="$1" tabindex="1">$1</a>') + '</p>'
                + ' </nav>'
                + '</div>');

            pages.moduleHeadings.find('li>a').on('click', function (e){ $(this).parent().toggleClass('active');e.preventDefault(); });
            pages.moduleHeadings.find('.answer a').on('click', function (e) {
                var el = $(this);
                var item = el.parent().parent().parent();
                var data = modules.headings.items[item.attr('data-id')];

                data.status = (el.hasClass('yes') ? 'pass' : 'fail');

                item.find('.answer a').removeClass('active');
                el.addClass('active');

                item.removeClass('active');
                (item.next().length ? item.next() : item).find('>a').focus();

                addResult('heading', 'feedback', data.status, data.type, data.value);
                sendResults();

                updateModuleHeadingsPage();
                e.preventDefault();
            });

            updateModuleHeadingsPage();

            layout.find('>section').append(pages.moduleHeadings);
        }

        return pages.moduleHeadings;
    }

    function updateModuleHeadingsPage() {
        modules.headings.status = 'pass';

        for (var a = 0; a < modules.headings.items.length; a++) {
            var data = modules.headings.items[a];
            var item = pages.moduleHeadings.find('li.' + a);

            item.removeClass('pass fail incomplete')
                .addClass(data.status);

            item.find('em')
                .text(language[data.status])
                .attr('title', language[data.status]);

            if (data.status == 'fail') {
                modules.headings.status = 'fail';
            } else if (modules.headings.status !== 'fail' && data.status == 'incomplete') {
                modules.headings.status = data.status;
            }
        }

        updateOverviewPage();
    }

    function getModuleImagesPage() {
        if (!pages.moduleImages) {
            var content = '';

            if(modules.image_alt.items.length){
                content = '<ul>';

                for (var a = 0; a < modules.image_alt.items.length; a++) {
                    var item     = modules.image_alt.items[a];
                    var previous = modules.image_alt.items[a - 1];

                    if (item.error != null) {
                        subcontent = '<p>' + language['image_altError_' + item.error].replace('[current]', item.type).replace('[previous]', (previous ? previous.type : '')) + '</p>';
                        subcontent = subcontent + '<img src="'+item.src+'" height="30px">';
                    } else {
                        subcontent = '<p>' + language.image_altQuestion.replace('[TEXT]', item.alt) + '</p>'
                            + '<p class="answer">'
                            + ' <a class="button yes ' + (item.status == 'pass' ? 'active' : '') + '" href="#" title="' + language.yes + '" tabindex="1">' + language.yes + '</a>'
                            + ' <a class="button no ' + (item.status == 'fail' ? 'active' : '') + '" href="#" title="' + language.no + '" tabindex="1">' + language.no + '</a>'
                            + '</p>'
                            + '<img src="' + item.src + '">'
                    }

                    content += '<li data-id="' + a + '" class="' + item.type + ' ' + a + ' ' + (item.status != 'pass' ? 'active' : '') + '">'
                        + '  <a href="#" title="' + item.alt + '" tabindex="1">'
                        + '      <span>' + (item.alt ? item.alt : '&nbsp;') + '</span>'
                        + '      <em></em>'
                        + '  </a>'
                        + '  <div>'
                        + subcontent
                        + '  </div>'
                        + '</li>';
                }

                content += '</ul>';
            } else{
                content = '<p><strong>' + language.image_altnoneTitle + '</strong></p>'
                    + '<p>' + language.image_altnoneDescription + '</p>';
            }

            pages.moduleImages = $('<div class="page headings images nav-medium">'
                + ' <header>'
                + '     <h2>' + language.image_altTitle + '</h2>'
                + '     <p>' + language.image_altDesc + '</p>'
                + '     <img src="' + sitepath + '/images/' + modules.image_alt.icon + '" alt="' + language.image_altTitle + '" width="20" height="20"/>'
                + ' </header>'
                + ' <section>'
                + content
                + ' </section>'
                + ' <nav>'
                + '     <p>' + language.image_altInfo.replace(/\[([^\]]+)\]/ig, '<a href="' + language.image_altInfoLink + '" title="$1" tabindex="1">$1</a>') + '</p>'
                + ' </nav>'
                + '</div>');

            pages.moduleImages.find('li>a').on('click', function (e){ $(this).parent().toggleClass('active');e.preventDefault(); });
            pages.moduleImages.find('.answer a').on('click', function (e) {
                var el = $(this);
                var item = el.parent().parent().parent();
                var data = modules.image_alt.items[item.attr('data-id')];

                data.status = (el.hasClass('yes') ? 'pass' : 'fail');

                item.find('.answer a').removeClass('active');
                el.addClass('active');

                item.removeClass('active');

                addResult('image', 'feedback', data.status, data.src, data.alt);
                sendResults();

                updateModuleImagesPage();
                e.preventDefault();
            });

            updateModuleImagesPage();

            layout.find('>section').append(pages.moduleImages);
        }

        return pages.moduleImages;
    }

    function updateModuleImagesPage() {
        modules.image_alt.status = 'pass';

        for (var a = 0; a < modules.image_alt.items.length; a++) {
            var data = modules.image_alt.items[a];
            var item = pages.moduleImages.find('li.' + a);

            item.removeClass('pass fail incomplete')
                .addClass(data.status);

            item.find('em')
                .text(language[data.status])
                .attr('title', language[data.status]);

            if (data.status == 'fail') {
                modules.image_alt.status = 'fail';
            } else if (modules.image_alt.status !== 'fail' && data.status == 'incomplete') {
                modules.image_alt.status = data.status;
            }
        }

        updateOverviewPage();
    }

    function getModuleBrokenLinksPage() {
        if (!pages.moduleBrokenLinks) {
            var content = '';

            if (modules.brokenlinks.status == 'pass') {
                content = '<p><strong>' + language.brokenlinksPass + '</strong></p>'
                    + '<p>' + language.brokenlinksPassDesc + '</p>';
            } else {
                content += '<p>' + language.brokenlinksFailDesc + '</p><ul>';

                for (var a =0; a< modules.brokenlinks.items.length; a++) {
                    var item = modules.brokenlinks.items[a];

                    content += '<li>'
                        + ' <a href="#" data-id="' + a + '" title="' + item.text + '" tabindex="1">' + item.text + '</a>'
                        + ' <dl>'
                        + '     <dt>' + language.url + ':</dt>'
                        + '     <dd><a href="' + item.url + '" title="' + item.url + '" target="blank" tabindex="1">' + item.url + '</a></dd>'
                        + '     <dt>' + language.error + ':</dt>'
                        + '     <dd>' + language[item.code] + '</dd>'
                        + ' </dl>'
                        + '</li>';
                }

                content += '</ul>';
            }

            pages.moduleBrokenLinks = $('<div class="page">'
                + ' <header>'
                + '     <h2>' + language.brokenlinksTitle + '</h2>'
                + '     <p>' + language.brokenlinksDesc + '</p>'
                + '     <img src="' + sitepath + '/images/' + modules.brokenlinks.icon + '" alt="' + language.brokenlinksTitle + '" width="20" height="20"/>'
                + ' </header>'
                + ' <section>' + content + ' </section>'
                + ' <nav>'
                + '     <p>' + language.brokenlinksInfo.replace(/\[([^\]]+)\]/ig, '<a href="' + language.brokenlinksInfoLink + '" title="$1" tabindex="1">$1</a>') + '</p>'
                + ' </nav>'
                + '</div>');

            pages.moduleBrokenLinks.find('li>a').on('click', function (e) {
                var id = $(this).attr('data-id');
                var item = modules.brokenlinks.items[id];

                $('html,body').animate({ scrollTop: item.el.offset().top }, 300);
                e.preventDefault();
            });

            layout.find('>section').append(pages.moduleBrokenLinks);
        }

        return pages.moduleBrokenLinks;
    }

    function getModuleReadLevelPage() {
        if (!pages.moduleReadLevel) {
            pages.moduleReadLevel = $('<div class="page">'
                + ' <header>'
                + '     <h2>' + language.readlevelTitle + '</h2>'
                + '     <p>' + language.readlevelDesc + '</p>'
                + '     <img src="' + sitepath + '/images/' + modules.readlevel.icon + '" alt="' + language.readlevelTitle + '" width="20" height="20"/>'
                + ' </header>'
                + ' <section>'
                + '     <p><label for="text">' + language.readlevelQuestion + '</label></p>'
                + '     <p><textarea id="text" tabindex="1"></textarea></p>'
                + '     <p><a class="button disabled" href="#" title="' + language.readlevelButton + '" tabindex="1">' + language.readlevelButton + '</a></p>'
                + ' </section>'
                + ' <nav>'
                + '     <p>' + language.readlevelInfo.replace(/\[([^\]]+)\]/ig, '<a href="' + language.readlevelInfoLink + '" title="$1" tabindex="1">$1</a>') + '</p>'
                + ' </nav>'
                + '</div>');

            var timer = null;
            var checkButton = function()
            {
                var text   = pages.moduleReadLevel.find('#text').val();
                var button = pages.moduleReadLevel.find('a.button');

                if (text.search(/[^\s\t]/ig) !== -1) {
                    button.attr('tabindex', 1).removeClass('disabled');
                } else {
                    button.attr('tabindex', 100).addClass('disabled');
                }
            };

            pages.moduleReadLevel.find('a.button').on('click', function(e)
            {
                var text = pages.moduleReadLevel.find('#text').val();

                if (text) {
                    scanTextJSON(text, function(data)
                    {
                        self.showPage(getModuleReadLevelResultPage(data), true, true);
                    });
                }
                e.preventDefault();
            });

            pages.moduleReadLevel.find('textarea').on('change focus blur keyup paste cut copy', function(e)
            {
                clearTimeout(timer);
                timer = setTimeout(checkButton, 20);
            });

            layout.find('>section').append(pages.moduleReadLevel);
        }

        // elementCheck();

        return pages.moduleReadLevel;
    }

    function getModuleReadLevelResultPage(data) {
        if (pages.moduleReadLevelResult) {
            pages.moduleReadLevelResult.remove();
            delete pages.moduleReadLevelResult;
        }

        pages.moduleReadLevelResult = $('<div class="page">'
            + ' <header>'
            + '     <h2>' + language.readlevelTitle + '</h2>'
            + '     <p>' + language.readlevelDesc + '</p>'
            + '     <img src="' + sitepath + '/images/' + modules.readlevel.icon + '" alt="' + language.readlevelTitle + '" width="20" height="20"/>'
            + ' </header>'
            + ' <section>'
            + data
            + '     <p><a class="button" href="#" title="' + language.readlevelRestart + '" tabindex="1">' + language.readlevelRestart + '</a></p>'
            + '</section>'
            + ' <nav>'
            + '     <p>' + language.readlevelInfo.replace(/\[([^\]]+)\]/ig, '<a href="' + language.readlevelInfoLink + '" title="$1" tabindex="1">$1</a>') + '</p>'
            + ' </nav>'
            + '</div>');

        pages.moduleReadLevelResult.find('a.button').on('click', function (e) { self.showPage(getModuleReadLevelPage(), true, true); e.preventDefault(); });

        layout.find('>section').append(pages.moduleReadLevelResult);

        // unbindElements(divSelection);

        var level = pages.moduleReadLevelResult.find('p#level').attr('data-level').substr(0, 2);
        level     = modules.readlevel.status < level || modules.readlevel.status === 'incomplete' ? level : modules.readlevel.status;

        if (level !== modules.readlevel.status) {
            modules.readlevel.status = level;

            updateOverviewPage();
            addResult('readlevel', 'feedback', modules.readlevel.status);
            sendResults();
        }

        return pages.moduleReadLevelResult;
    }

    init();
})();