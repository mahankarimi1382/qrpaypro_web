<!DOCTYPE html>
<html lang="{{ get_default_language_code() }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $basic_settings->sitename(__($page_title??'')) }}</title>
    <!-- Vazirmatn Persian Font -->
    <link rel="stylesheet" href="{{ asset('css/vazir-fonts.css') }}">

    @include('user.partials.header-assets')

    @stack('css')
</head>
<body class="{{ selectedLangDir() ?? "ltr"}}">

    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        Start body overlay
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->
    <div id="body-overlay" class="body-overlay"></div>
    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        End body overlay
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->

    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        Start Dashboard
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->
    <div class="page-wrapper">
        @include('user.partials.side-nav')
        <div class="main-wrapper">
            <div class="main-body-wrapper">
                @include('user.partials.top-nav')
                @yield('content')
            </div>
        </div>
    </div>
    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        End Dashboard
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->
    @unless (Route::currentRouteName() === 'user.p2p.chat.conversation')
        <a href="{{ setRoute('user.receive.money.index') }}" class="qr-scan">
            <i class="fas fa-qrcode"></i>
        </a>
    @endunless
    @include('user.partials.footer-assets')
    @include('user.partials.push-notification')
    @stack('script')
</body>

</html>
