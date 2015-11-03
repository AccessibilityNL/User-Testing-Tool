(function () {
    var isJQueryLoaded = false,
        pluginsJSAdded = false,
        divSelection,
        images = [],
        inputImages = [],
        links = [],
        externalCSS = [],
        allElementsWithStyle = [],
        removedInlineStyles = [],
        internalCSS = [],
        allElements = [],
        externalJS = [],
        iframes = [],
        objects = [],
        canvases = [],
        embeds = [],
        svgs = [],
        windowobjects = {},
        lang = 'en',
        results = [],
        resultsURL = (typeof(dataURL) !== 'undefined' ? dataURL : ''),
        init, W3CValidation, W3CMobileValidation, contrastValidation, loadPlugins, attr;

    init = function () {
        var head, cssNode;
        head = document.getElementsByTagName('head')[0];

        if (typeof (jQuery) === "undefined" || jQuery.fn.jquery !== '1.11.1') {
            if (isJQueryLoaded === false) {
                appendFiles(head);
                isJQueryLoaded = true;
            }
            setTimeout(init, 100);

        } else {
            jQuery.noConflict();
            divSelection = jQuery('div:not(#SABM-main, #SABM-main *),p,article,aside,header,footer');
            cssNode = document.createElement('link');
            cssNode.type = 'text/css';
            cssNode.rel = 'stylesheet';
            cssNode.href = sitepath + 'styles/eiii.css?d=' + (new Date()).getTime();
            cssNode.media = 'screen';
            head.appendChild(cssNode);
            loadPlugins(head);
        }
    };
    function appendFiles(head) {
        var _newScript;
        _newScript = document.createElement('script');
        _newScript.type = 'text/javascript';
        _newScript.src = sitepath + 'scripts/jquery.js';
        head.appendChild(_newScript);
    };
    loadPlugins = function (head) {
        var newPlugins;
        if (typeof (plugins_loaded) === 'undefined') {
            if (pluginsJSAdded === false) {
                newPlugins = document.createElement('script');
                newPlugins.type = 'text/javascript';
                newPlugins.src = sitepath + 'scripts/eiii-plugins.js';
                newLanguage = document.createElement('script');
                newLanguage.type = 'text/javascript';
                newLanguage.src = sitepath + 'scripts/eiii.lang.'+ lang +'.js';
                head.appendChild(newPlugins);
                head.appendChild(newLanguage);
                pluginsJSAdded = true;
            }
            setTimeout(loadPlugins, 100);
        } else {
            loadSABMDiv();
        }
    };
    scanTextJSON = function (text, element) {
        jQuery.getJSON('http://api.accessibility.nl/leesniveau.json?jsonp=?', {
            tekst: text,
            sleutel: '4ZuAS2fasVa4th8Ddinf9aMGH847h63uFCa93yf'
        }, function (data) {
            if (data.status === 'error') {
                console.log(data.bericht);
            } else {
                jQuery('#SABM-activateTextScan').parent().parent().html('<p>Het leesniveau van deze tekst is:</p><p class="SABM-leesniveau"><span>' + data.leesniveau + '</span><br />Weten welke woorden de tekst complexer maken, of wat dit leesniveau inhoudt? <a href="#" id="SABM-leesniveauLink" class="SABM-explTrigger">Lees hier alles over leesniveaus</a>!</p><p>Deze toetsing is ontwikkeld in samenwerking met </p><a href="http://www.accessibility.nl" class="accessibilityLogo"><img src="' + sitepath + 'images/logo-accessibility.png" alt="Stichting Accessibility" /></a>');
                extras('.SABM-explTrigger', data.onbekende_woorden);
                jQuery('#SABM-toolbox').animate({ scrollTop: jQuery('#SABM-toolbox').height() }, 'slow');
            }
        });
    };
    addResult = function(module, type, status, value, info){
        results.push({
            module: module,
            type: type,
            status: status,
            value: (value ? value : ''),
            info: (info ? info : '')
        });
    };
    sendResults = function(){
        jQuery.ajax({
            url: resultsURL,
            method: 'POST',
            dataType: 'json',
            cache: false,
            crossDomain: true,
            xhrFields: { withCredentials: true },
            data: { results: results },
            success: function (data)
            {
                if (data.status === 'error') {
                    console.log('API fail');
                } else {
                    results = []; // reset results array
                }
            }
        });
    };
    function highLightWords(data, element, text) {
        var tempWords = text.replace(/\s+/g, '</span> <span>');
        jQuery(element).html('<span>' + tempWords + '</span>');
        jQuery.each(data, function (intIndex, objValue) {
            jQuery(element).find('span:contains(' + objValue + ')').addClass('difficultWord').fadeIn(500);
        });
    }
    function loadSABMDiv() {
        var objectId, toolkit;
        jQuery(document).ready(function () {
            var div, content;

            // initialisation of DOM elements
            allElementsWithStyle = jQuery('*[style]');
            allElements = jQuery('*');
            externalCSS = jQuery('link[rel=stylesheet]');
            internalCSS = jQuery('style');
            externalJS = jQuery('script');
            inputImages = jQuery('input[src]');
            images = jQuery('img');
            links = jQuery('a');
            iframes = jQuery('iframe');
            objects = jQuery('object');
            embeds = jQuery('embed');
            canvases = jQuery('canvas');
            svgs = jQuery('svg');

            // create Bookmarklet
            jQuery('body').append('<div id="SABM-main"></div>');

            // definition of content elements
            content =  '<div id="SABM-bar"><div id="SABM-barhandle"></div>';
            content += '<h1>' + language.toolTitle + '</h1>';
            content += '<p>' + language.toolTagline + '</p>';
            content += '</div>';
            content += '<div id="SABM-toolbox">';
            content += '<div class="SABM-home">';

                // first tool: title tester

                content += '    <div class="SABM-tool">';
                content += '        <div class="SABM-head">';
                content += '            <a href="#" class="SABM-trigger">open</a>';
                content += '            <h2>' + language.titleTestTitle + '</h2>';
                content += '            <div class="SABM-status" id="SABM-titleTest"><a href="#">'+ language.testTerm +'</a></div>';
                content += '        </div>';
                content += '        <div class="SABM-foldout">';
                content += '            <p id="dressingText">' + language.titleTestIntro + '</p>';
                content += '        </div>';
                content += '    </div>';

                content += '    <div class="SABM-tool">';
                content += '        <div class="SABM-head">';
                content += '            <a href="#" class="SABM-trigger">Open</a>';
                content += '            <h2>' + language.headingsTitle + '</h2>';
                content += '            <div class="SABM-status" id="SABM-headingTest"><a href="#">'+ language.testTerm +'</a></div>';
                content += '        </div>';
                content += '        <div class="SABM-foldout">';
                content += '            <p>' + language.headingsIntro + '</p>';
                content += '        </div>';
                content += '    </div>';

//                content += '    <div class="SABM-tool">';
//                content += '        <div class="SABM-head">';
//                content += '            <a href="#" class="SABM-trigger">Open</a>';
//                content += '            <h2>' + language.textLevelTitle + '</h2>';
//                content += '            <div class="SABM-status" id="SABM-textLevel"><a href="#" class="activateTextLevel">'+ language.testTerm +'</a></div>';
//                content += '        </div>';
//                content += '        <div class="SABM-foldout">';
//                content += '            <p>' + language.textLevelIntro + '</p>';
//                content += '        </div>';
//                content += '    </div>';

                content += '    <div class="SABM-tool">';
                content += '        <div class="SABM-head">';
                content += '            <a href="#" class="SABM-trigger">Open</a>';
                content += '            <h2>' + language.imageAltTitle + '</h2>';
                content += '            <div class="SABM-status disabled" id="SABM-imageAltTest"><span>'+ language.testTerm +'</span></div>';
                content += '        </div>';
                content += '        <div class="SABM-foldout">';
                content += '            <p>' + language.imageAltIntro + '</p>';
                content += '        </div>';
                content += '    </div>';

                content += '    <div class="SABM-tool">';
                content += '        <div class="SABM-head">';
                content += '            <a href="#" class="SABM-trigger">Open</a>';
                content += '            <h2>' + language.contrastTitle + '</h2>';
                content += '            <div class="SABM-status disabled" id="SABM-contrastTest"><span>'+ language.testTerm +'</span></div>';
                content += '        </div>';
                content += '        <div class="SABM-foldout">';
                content += '            <p>' + language.contrastIntro + '</p>';
                content += '        </div>';
                content += '    </div>';

                content += '    <div class="SABM-tool">';
                content += '        <div class="SABM-head">';
                content += '            <a href="#" class="SABM-trigger">Open</a>';
                content += '            <h2>' + language.aboutTitle + '</h2>';
                content += '        </div>';
                content += '        <div class="SABM-foldout">';
                content += '            <p>' + language.aboutIntro
                                                    .replace(/\[([a-z0-9 ]+)\]/ig, '<a href="' + language.aboutIntroLink + '" target="_blank">$1</a>')
                                                    .replace(/\n/ig, '</p><p><br/>')
                                     + '</p>';
                content += '        </div>';
                content += '    </div>';


                 /*
                content += '    <div class="SABM-tool">';
                content += '        <div class="SABM-head">';
                content += '            <a href="#" class="SABM-trigger">Open</a>';
                content += '            <h2>' + language.brokenLinksTitle + '</h2>';
                content += '            <div class="SABM-status" id="SABM-textLevel"><a href="#">'+ language.testTerm +'</a></div>';
                content += '        </div>';
                content += '        <div class="SABM-foldout">';
                content += '            <p>' + language.brokenLinksIntro + '</p>';
                content += '            <div id="SABM-textComplexity">';
                content += '                <textarea id="SABM-textComplexitybox" col="40" row="5"></textarea>';
                content += '                <a href="#" class="SABM-toolButton" id="SABM-activateTextScan">scan</a>';
                content += '            </div>';
                content += '        </div>';
                content += '    </div>';

                content += '    <div class="SABM-tool">';
                content += '        <div class="SABM-head">';
                content += '            <a href="#" class="SABM-trigger">Open</a>';
                content += '            <h2>' + language.gtTitle + '</h2>';
                content += '            <div class="SABM-status" id="SABM-textLevel"><a href="#">8/38</a></div>';
                content += '        </div>';
                content += '        <div class="SABM-foldout">';
                content += '            <p>' + language.gtIntro + '</p>';
                content += '            <div id="SABM-textComplexity">';
                content += '                <textarea id="SABM-textComplexitybox" col="40" row="5"></textarea>';
                content += '                <a href="#" class="SABM-toolButton" id="SABM-activateTextScan">scan</a>';
                content += '            </div>';
                content += '        </div>';
                content += '    </div>';

                */




                // dummy tool: TBD
                /*
                content += '    <div class="SABM-tool">';
                content += '        <div class="SABM-head">';
                content += '            <a href="#" class="SABM-trigger">open</a>';
                content += '            <h2>Lege toolbox</h2>';
                content += '            <div class="SABM-status"><a href="#">test</a></div>';
                content += '        </div>';
                content += '        <div class="SABM-foldout">';
                content += '            <p id="dressingText"></p><ul><li><a href="#" id="" class="">Meer weten?</a></li></ul>';
                content += '        </div>';
                content += '    </div>';
                */


            content += '</div>';

            // container for testdata
            content += '<div class="SABM-detail">';
            content += '    <div class="SABM-detailContent"></div>';
            content += '    <a href="#" class="SABM-backButton">' + language.backButton + '</a>';
            content += '</div>';

            // initial load of html content
            jQuery('#SABM-main').html(content);

            // object elements are likely to interfere with bookmarklet, therefore we hide these.
            jQuery('object').each(function () {
                jQuery(this).css({ 'display': 'none' });
            });
            jQuery('#SABM-main').topZIndex({ increment: 100000000 });

            // these are the extension in the homescreen
            foldables('.SABM-trigger', '.SABM-foldout');

            textComplexity();

            // make every status link a call to action
            functionTriggers('.SABM-status a');

            // make element draggable
            dragEl('#SABM-main', '#SABM-bar');

            // initial animation from out of screen
            jQuery('#SABM-main').animate({ 'top': '50px' }, 1500, "easeOutBounce");

        });
    };

    function dragEl(el, handler) {
        jQuery(el).draggable({
            handle: handler,
            containment: 'window',
            drag: function (event, ui) { jQuery(handler).addClass('active'); },
            stop: function (event, ui) { jQuery(handler).removeClass('active'); }
        });
    };

    function textComplexity() {
        jQuery('.activateTextLevel').click(function() {
            if(jQuery(this).hasClass('clicked')){
                jQuery(this).removeClass('clicked');
                unbindElements(divSelection);
            } else {
                jQuery(this).addClass('clicked');
                bindElements(divSelection);
                elementCheck();
            }
        });
    };
    function bindElements(el) {
        jQuery(el).bind('mouseover')
             .bind('mouseout')
             .bind('click');
    };
    function unbindElements(el) {
        jQuery(el).unbind('mouseover')
             .unbind('mouseout')
             .unbind('click');
    };
    function elementCheck() {
        jQuery(divSelection).on({
            'mouseover': function () {
                jQuery(this).addClass('highlight');
                return false;
            },
            'mouseout': function () {
                jQuery(this).removeClass('highlight');
                return false;
            },
            'click': function () {
                var contentTemp = jQuery(this).text().trim();
                var content = contentTemp.replace(/\t/g, '');
                console.log(content);
                jQuery('#SABM-textComplexitybox').val(content);
                var checkedElement = jQuery(this);
                textLevel(checkedElement);
                return false;
            }
        });
    };
    function foldables(trigger, el) {
        var parentEl = jQuery('#SABM-toolbox');
        jQuery(trigger).on({
            'mousedown': function () {
                jQuery(this).toggleClass('open');
                if (jQuery(this).html() === 'open') {
                    jQuery(this).html('sluiten');
                } else {
                    jQuery(this).html('open');
                }
                jQuery('#SABM-toolbox').animate({ scrollTop: jQuery(this).parent().parent().position().top }, 'slow');
                jQuery(this).parent().parent().find(el).toggle(150);
            },
            'mouseup': function () {
            },
            'click': function () {
                return false;
            }
        });
    };
    function functionTriggers(el) {
        jQuery(el).on({
            'click': function () {
                var type = jQuery(this).parent().attr('id');
                jQuery('.SABM-detailContent').html('');
                jQuery('.SABM-home').removeClass('SABM-area-visible').addClass('SABM-area-hidden');
                jQuery('.SABM-detail').addClass('SABM-area-visible').removeClass('SABM-area-hidden');
                switch (type) {
                    case 'SABM-titleTest':
                        titleTest(type, el);
                        break;
                    case 'SABM-headingTest':
                        headingTest(type, el);
                        break;
                    case 'SABM-textLevel':
                        textlevelTest(type, el);
                        break;
                }
                return false;
            }
        });
        jQuery('.SABM-backButton').on({
            'click': function(){
                jQuery('.SABM-home').addClass('SABM-area-visible').removeClass('SABM-area-hidden');
                jQuery('.SABM-detail').removeClass('SABM-area-visible').addClass('SABM-area-hidden');
            }
        });
    };
    function changeButtonToIndicator(type) {
        jQuery('#' + type + ' a').replaceWith('<span><img src="' + sitepath + 'images/SABM-loader.gif" class="SABM-loader" alt="" /></span>');
    };
    function textLevel(element) {
        var scanText = '<p id="SABM-indicator">Een momentje alsjeblieft, de tekst wordt gescand op complexiteit.</p>';
        jQuery('#SABM-activateTextScan').on({
            'click': function () {
                jQuery(this).parent().parent().find('p').replaceWith(scanText);
                jQuery('.activateRL').text('start');
                var Text2BSend = jQuery('#SABM-textComplexitybox').attr('value');
                unbindElements(divSelection);
                jQuery('#SABM-activateTextScan, #SABM-textComplexitybox').hide();
                scanTextJSON(Text2BSend, element);
                return false;
            }
        });
    };
    function titleTest(type, el){
        var testStatus;
        var currentTitle = jQuery('title').html();

        if (jQuery('title').is('*')){
            // if title-element is found but empty, #fail
            if(currentTitle == null || currentTitle == '' || currentTitle == ' '){
                titleStatus = language.emptyTitle;
                testStatus = 'SABM-fail';
                addResult('title', 'empty', 'fail', currentTitle);
            // if more than one title-element is found, #fail
            } else if(jQuery('title').length > 1){
                testStatus = 'fail';
                titleStatus = language.multipleTitle;
                titleCount = jQuery('title').length;
                addResult('title', 'multiple', 'fail', currentTitle);
            // else: #pass
            } else {
                testStatus = 'SABM-pass';
                titleStatus = currentTitle;
                addResult('title', 'all', 'pass', currentTitle);
            }
        } else {
            // if title-element is not found, #fail
            testStatus = 'SABM-fail';
            var titleStatus = language.noTitle;
            addResult('title', 'exists', 'fail', currentTitle);
        }

        sendResults();

        // write new html for the user
        var toolContent  = '<h3>' + language.titleTestTitle + '</h3>';
            toolContent += '<p>' + language.titleTestDesc + '</p>';
            if (testStatus === 'SABM-fail'){
                toolContent += '<p>' + language.currentSituation + '</p>';
            } else {
                toolContent += '<p>' + language.titleContent + '</p>';
            }
            toolContent += '<div id="SABM-currentTitle" class="SABM-statusBlock '+ testStatus + '">' + titleStatus + '</div>';
            if (testStatus === 'SABM-fail'){
                toolContent += '<p>' + language.nextStep + '</p>';
            } else {
                toolContent += '<div id="SABM-title-feedback">';
                toolContent += '<h3>' + language.question + '</h3>';
                toolContent += '<p>' + language.correctTitle + '</p>';
                toolContent += '<form id="SABM-title-form" action="" method="POST">';
                toolContent += '<input type="hidden" id="SABM-title" value="' + titleStatus + '" />';
                toolContent += '<input type="hidden" id="SABM-testStatus" value="'+ testStatus.split('-')[1] +'" />';

                toolContent += '<label for="SABM-title-pass"><input type="radio" name="SABM-title-submit" id="SABM-title-pass" value="pass" />' + language.pass + '</label>';
                toolContent += '<label for="SABM-title-fail"><input type="radio" name="SABM-title-submit" id="SABM-title-fail" value="fail" />' + language.fail + '</label>';
                toolContent += '<label for="SABM-title-cantTell"><input type="radio" name="SABM-title-submit" id="SABM-title-canttell" value="cantTell" />' + language.cantTell + '</label>';
                toolContent += '<button type="submit" value="'+ language.sendButton + '">'+ language.sendButton + '</button>';
                toolContent += '</form>';
                toolContent += '</div>';
            }

        jQuery('.SABM-detailContent').html(toolContent);
        // send data to server when user gives feedback on title-element content
        jQuery(document).on('submit', '#SABM-title-form', function(){
            console.log('{' + jQuery('#SABM-url').val() + ', ' + jQuery('#SABM-title').val() + ', ' + jQuery('#SABM-testStatus').val() + ', ' + jQuery('input:radio[name="SABM-title-submit"]:checked').val() + '}');

            var status = jQuery('input:radio[name="SABM-title-submit"]:checked').val();

            addResult('title', 'feedback', status, currentTitle);
            sendResults();
            jQuery('#SABM-title-feedback').html('<h3>' + language.sendSuccess + '</h3>');
            return false;
        });
    };
    function headingTest(type, el){
        // select all heading-elements and loop through them

        var toolContent  = '<form id="SABM-heading-form" action="" method="POST">';
            toolContent += '<input type="hidden" id="SABM-url" value="' + window.location.href + '" />';
            toolContent += '<h3>' + language.headingsTitle + '</h3>';
            toolContent += '<p>' + language.headingsTotalBefore +' <strong><span class="totalHeadings"></span></strong> ' + language.headingsTotalAfter +'</p>';
            toolContent += '<ol>';

        var headingArray = [];
        jQuery(':header:not(#SABM-main, #SABM-main *)').each(function(index, value){
            // get type of element and value of element
            var headingType = jQuery(this).get(0).tagName.split('H')[1];
            var headingValue = jQuery(this).html();

            toolContent += '<li>';
            if(headingValue === '' || headingValue === ' ' || headingValue === null || headingValue === undefined){
                toolContent += '<p>' + language.headingFailedBefore  + ' <strong>&lt;h' + headingType + '&gt;-element</strong> ' + language.headingFailedAfter;

                addResult('heading', 'empty', 'fail', 'h' + headingType);
            } else {
                toolContent += '<p>' + language.headingFoundBefore + ' <strong>&lt;h' + headingType + '&gt;-element</strong> ' + language.headingFoundAfter + ':</p>';
                toolContent += '<div class="SABM-statusBlock">' + headingValue + '</div>';
                toolContent += '<p>' + language.headingsMatch + '</p>';
                toolContent += '<label for="SABM-heading-' + index + '-pass"><input type="radio" data-type="h' + headingType + '" class="SABM-heading-submit" name="SABM-heading-' + index + '-submit" id="SABM-heading-' + index + '-pass" value="pass" />' + language.pass + '</label>';
                toolContent += '<label for="SABM-heading-' + index + '-fail"><input type="radio" data-type="h' + headingType + '" class="SABM-heading-submit" name="SABM-heading-' + index + '-submit" id="SABM-heading-' + index + '-fail" value="fail" />' + language.fail + '</label>';
                toolContent += '<label for="SABM-heading-' + index + '-cantTell"><input type="radio" data-type="h' + headingType + '" class="SABM-heading-submit" name="SABM-heading-' + index + '-submit" id="SABM-heading-' + index + '-canttell" value="cantTell" checked />' + language.cantTell + '</label>';

                addResult('heading', 'empty', 'pass', 'h' + headingType);
            }
            // put the heading type-value and heading text value in an array. Might be of help for
            headingArray.push({type:headingType, value:headingValue});
            toolContent += '</li>';
        });

        sendResults();

        toolContent += '</ol>';
        toolContent += '<div id="SABM-heading-feedback"><button type="submit" value="'+ language.sendButton + '">'+ language.sendButton + '</button></div>';
        toolContent += '</form>';
        // append data to list
        jQuery('.SABM-detailContent').html(toolContent);
        // update total items found on top of data
        jQuery('body').find('.totalHeadings').html(headingArray.length);

        // send data to server when user gives feedback on title-element content
        jQuery(document).unbind('submit').on('submit', '#SABM-heading-form', function(){

            jQuery('.SABM-heading-submit:checked').each(function(index, item)
            {
                var status = jQuery(item).val();
                var type = jQuery(item).attr('data-type');
                addResult('heading', 'feedback', status, type);
            });

            sendResults();
            jQuery('#SABM-heading-feedback').html('<h3>' + language.sendSuccess + '</h3>');
            return false;
        });

    };
    function textlevelTest(type, el){
        var toolContent = '<div id="SABM-textComplexity">';
            toolContent += '<textarea id="SABM-textComplexitybox" col="40" row="5"></textarea>';
            toolContent += '<a href="#" class="SABM-toolButton" id="SABM-activateTextScan">scan</a>';
            toolContent += '</div>';

        jQuery('.SABM-detailContent').html(toolContent);
    }

    function altTexts(type, el) {
    };
    function brokenLinks(type, el) {
    };
    function checkAttrExists(attr) {
        if (typeof attr !== 'undefined' && attr !== false) {
            return true;
        }
        return false;
    };
    init();
})();





