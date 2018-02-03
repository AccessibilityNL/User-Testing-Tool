// Include dependencies
include('_base.js');

/**
 * Module Rating
 *
 * @author Zaid Sadhoe
 */
Module.poll = Module._base.extend(function () {
    'use strict';

    /** @var {object} The class instance reference. */
    var _self = this;

    /** @var {object} The static class reference. */
    var _static = this.constructor;

    /** @var {object} The object containing the HTML Element views. */
    var view = {};

    /** @var {object} The current index. */
    var index = 0,
        previousIndex = 0;

    /** @var {object} The answer index. */
    var answers = [];

    /** @var {float} The current status. */
    this.status = 'incomplete';

    /**
     * Construct method, executed before anything else is done
     */
    var _construct = function () {
        _self.collect();
    };

    /**
     * Collect usefull data for the test of this module
     *
     * @return void
     */
    this.collect = function () {
        // var totalScore = 0;

        // for (var a = 0; a < ratingGlobal.length; a++) {
        //     totalScore += parseInt(ratingGlobal[a].status);
        // }

        // _self.status = ratingGlobal.length ? Math.round((totalScore / ratingGlobal.length) * 10) / 10 : 'incomplete';
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
    this.viewQuestion = function (container, language, sitepath, modules, addResult, sendResults, updateOverviewPage, showPage, showPreviousPage) {
        if (view.question) {
            if (view.questionTmp) {
                view.questionTmp.remove();
                delete view.questionTmp;
            }

            view.questionTmp = view.question;
            delete view.question;
        }

        var questions = language.pollQuestions.filter(function (item, index) {
            if ('detect' in item) {
                return $(item.detect).length > 0;
            }

            return true;
        });

        index = index >= 0 && index < questions.length ? index : 0;

        var question = questions[index];
        var answer = typeof (answers[index]) != 'undefined' ? answers[index] : { title: question.title + (question.continue ? "\r\n" + question.continue : '') };

        answers[index] = answer;

        var content = '<p>' + question.title + '</p>'
            + '<p class="answer">'
            + ' <a class="button yes ' + (answer.status == 'yes' ? 'active' : '') + '" href="#" title="' + question.yes + '" tabindex="1">' + question.yes + '</a>'
            + ' <a class="button no ' + (answer.status == 'no' ? 'active' : '') + '" href="#" title="' + question.no + '" tabindex="1">' + question.no + '</a>'
            + (question.na ? ' <a class="button na ' + (answer.status == 'na' ? 'active' : '') + '" href="#" title="' + question.na + '" tabindex="1">' + question.na + '</a>' : '')
            + '</p>';

        if (question.continue) {
            content += '<div class="continue" ' + (answer.value ? '' : 'style="display:none;"') + ' > ';

            if (question.continueYes) {
                content += '<p>' + question.continue + '</p>'
                    + '<p class="continue">'
                    + ' <a class="button yes ' + (answer.value == 'yes' ? 'active' : '') + '" href="#" title="' + question.continueYes + '" tabindex="1">' + question.continueYes + '</a>'
                    + ' <a class="button no ' + (answer.value == 'no' ? 'active' : '') + '" href="#" title="' + question.continueNo + '" tabindex="1">' + question.continueNo + '</a>'
                    + '</p>';
            } else {
                content += '<p><label for="text">' + question.continue + '</label></p>'
                    + '<p><textarea id="text" tabindex="1">' + (answer.value ? answer.value : '') + '</textarea></p>';
            }

            content += '<div>';
        }

        var nav = '<div class="progress">'
            + ' <em style="width: ' + (((index + 1) / questions.length) * 100) + '% !important"></em>'
            + ' <span>' + language.pollProgress.replace('[index]', (index + 1)).replace('[total]', questions.length) + '</span>'
            + '</div>';

        if (index > 0) {
            nav += '<a class="button previous left" href="#" title="' + language.pollPrevious + '" tabindex="2">' + language.pollPrevious + '</a>';
        }

        if (index < questions.length - 1) {
            nav += '<a class="button next right ' + (answer.status ? '' : 'disabled') + '" href="#" title="' + language.pollNext + '" tabindex="2">' + language.pollNext + '</a>';
        }

        view.question = _self.$('<div class="page poll nav-medium progress">'
            + ' <header>'
            + '     <h2>' + language.pollTitle + '</h2>'
            + '     <p>' + language.pollDesc + '</p>'
            + '     <img src="' + sitepath + '/images/' + modules.poll.icon + '" alt="' + language.pollTitle + '" width="20" height="20"/>'
            + ' </header>'
            + ' <section>' + content + ' </section>'
            + ' <nav>' + nav + ' </nav>'
            + '</div>');

        var next = function (index) {
            if (index < questions.length) {
                showPage(_self.viewQuestion(container, language, sitepath, modules, addResult, sendResults, updateOverviewPage, showPage, showPreviousPage), true, true);
            } else {
                modules.poll.status = 'pass';
                updateOverviewPage();
                showPage(_self.viewInput(container, language, sitepath, modules, addResult, sendResults, updateOverviewPage, showPage, showPreviousPage), true, true);
                // showPreviousPage();
            }
        };

        var sendResult = function (index) {
            addResult('poll', 'feedback', answer.status, answer.value, answer.title);
            sendResults();
            // updateOverviewPage();
        };

        view.question.find('a.button.previous').on('click', function (e) {
            next(--index);
            e.preventDefault();
        });

        view.question.find('a.button.next').on('click', function (e) {
            if (question.continue && !question.continueYes && answer.status == question.continueOn) {
                var text = view.question.find('div.continue #text').val();

                if (answer.value != text) {
                    answer.value = text;
                    sendResult();
                }
            }

            next(++index);
            e.preventDefault();
        });

        view.question.find('.answer a').on('click', function (e) {
            var el = $(this);

            answer.status = (el.hasClass('yes') ? 'yes' : (el.hasClass('na') ? 'na' : 'no'));

            view.question.find('.answer a').removeClass('active');
            el.addClass('active');

            if (!question.continue || answer.status != question.continueOn) {
                view.question.find('a.button.next').removeClass('disabled');
                next(++index);
                sendResult();
            } else {
                view.question.find('div.continue').show();

                if (question.continue && !question.continueYes) {
                    view.question.find('a.button.next').removeClass('disabled');
                }
            }

            e.preventDefault();
        });

        view.question.find('p.continue a').on('click', function (e) {
            var el = $(this);

            answer.value = (el.hasClass('yes') ? 'yes' : 'no');

            view.question.find('a.button.next').removeClass('disabled');
            view.question.find('p.continue a').removeClass('active');
            el.addClass('active');

            next(++index);
            sendResult();
            e.preventDefault();
        });

        (index >= previousIndex ? container.append(view.question) : container.prepend(view.question));
        previousIndex = index;

        return view.question;
    };

    /**
     * Return the view for the input form
     *
     * @return {object} The view
     */
    this.viewInput = function (container, language, sitepath, modules, addResult, sendResults, updateOverviewPage, showPage, showPreviousPage) {
        if (!view.input) {
            var previous = ratingData ? ratingData : {};
            previous.status = previous.status ? previous.status : 0;
            previous.value = previous.value ? previous.value : '';

            view.input = _self.$('<div class="page rating input nav-medium">'
                + ' <header>'
                + '   <h2>' + language.ratingTitle + '</h2>'
                + '   <p>' + language.ratingDesc + '</p>'
                + ' </header>'
                + ' <section>' +
                '   <p class="row">' +
                '       <a href="#" class="star ' + (previous.status === '1' ? 'selected' : '') + '" data-value="1" tabindex="1">1</a>' +
                '       <a href="#" class="star ' + (previous.status === '2' ? 'selected' : '') + '" data-value="2" tabindex="1">2</a>' +
                '       <a href="#" class="star ' + (previous.status === '3' ? 'selected' : '') + '" data-value="3" tabindex="1">3</a>' +
                '       <a href="#" class="star ' + (previous.status === '4' ? 'selected' : '') + '" data-value="4" tabindex="1">4</a>' +
                '       <a href="#" class="star ' + (previous.status === '5' ? 'selected' : '') + '" data-value="5" tabindex="1">5</a>' +
                '   </p>'
                + ' </section>'
                + '<nav>'
                + '       <a class="button next right disabled" href="#" title="' + language.pollLast + '">' + language.pollLast + '</a>'
                + '</nav>'
                + '</div>');

            var timer = null;
            var rank = previous.status;
            var button = view.input.find('a.button');
            var stars = view.input.find('a.star');
            var check = function () {
                if (rank > 0) {
                    button.attr('tabindex', 1).removeClass('disabled');
                    return true;
                } else {
                    button.attr('tabindex', 100).addClass('disabled');
                }

                return false;
            };

            stars.on('click', function (e) {
                stars.removeClass('selected');
                _self.$(this).addClass('selected');

                rank = parseInt(_self.$(this).attr('data-value'));
                check();

                e.preventDefault();
            });

            button.on('click', function (e) {
                if (check()) {
                    addResult('rating', 'feedback', rank);
                    sendResults();
                    showPreviousPage();
                }

                e.preventDefault();
            });

            container.append(view.input);
        }

        return view.input;
    };


    // call construct
    _construct();
});