<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="{{ Lang::getLocale() }}" lang="{{ Lang::getLocale() }}">
    <head>
        <meta charset="utf-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="description" content="@lang('eiii.meta.description')" />
        <meta name="keywords" content="@lang('eiii.meta.keywords')" />
        <meta name="viewport" content="width=device-width"/>
        <title>@lang('eiii.meta.title')</title>

        <link href="site/eiii/css/styles.css" rel="stylesheet"/>

        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon"/>
        <link rel="icon" href="/favicon.ico" type="image/x-icon"/>

    </head>
    <body>

        @section('header')
            @include('site.eiii.layout.header')
        @show

        @section('content')
            content of page
        @show

        @section('footer')
            @include('site.eiii.layout.footer')
        @show

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
        <script src="/js/jquery.easing.min.js"></script>
        <script src="/js/layout.js"></script>

        @include('site.global.analytics')
    </body>
</html>
