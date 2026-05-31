<!DOCTYPE html>
<html lang="{{ get_default_language_code() }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $basic_settings->sitenameAgent(__($page_title??'')) }}</title>
    <!-- Vazirmatn Persian Font -->
    <link rel="stylesheet" href="{{ asset('css/vazir-fonts.css') }}">
    
    

    @include('agent.partials.header-assets')

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
        @include('agent.partials.side-nav')
        <div class="main-wrapper">
            <div class="main-body-wrapper">
                @include('agent.partials.top-nav')
                @yield('content')
            </div>
        </div>
    </div>
    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        End Dashboard
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->
    <a href="{{ setRoute('agent.receive.money.index') }}" class="qr-scan"><i class="fas fa-qrcode"></i></a>
    @include('agent.partials.footer-assets')
    @include('agent.partials.push-notification')
    @stack('script')
</body>



</html>
