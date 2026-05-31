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

    @include('partials.header-asset')

    @stack('css')
</head >
<body class="{{ selectedLangDir() ?? "ltr"}}">

@yield("content")
@include('partials.footer-asset')
@include('frontend.partials.extensions.tawk-to')

@stack('script')

</body>
</html>
