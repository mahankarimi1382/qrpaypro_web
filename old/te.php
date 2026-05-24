<?php
/**
 * تست جامع تمام APIهای پروژه interex
 * 
 * این فایل تمام endpointهای تعریف شده در routes/api.php را بررسی می‌کند
 * و زمان پاسخ، کد HTTP، و خطاهای احتمالی (مانند 504) را نمایش می‌دهد.
 * 
 * نحوه اجرا: https://interex.ir/test_all_apis.php
 */

header('Content-Type: text/html; charset=utf-8');
set_time_limit(0);
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<!DOCTYPE html>
<html dir='rtl' lang='fa'>
<head>
    <meta charset='UTF-8'>
    <title>تست جامع APIهای interex</title>
    <style>
        body { font-family: Tahoma, sans-serif; background: #1e1e2f; color: #eee; padding: 20px; }
        h1 { color: #ffaa00; text-align: center; }
        .summary { background: #2a2a3f; padding: 15px; border-radius: 10px; margin-bottom: 20px; }
        .api-item { background: #25253a; margin: 8px 0; padding: 10px; border-radius: 8px; border-right: 5px solid #555; }
        .api-item.success { border-right-color: #00cc66; background: #1e3a2e; }
        .api-item.timeout { border-right-color: #ff4444; background: #4a1a1a; }
        .api-item.error { border-right-color: #ffaa00; background: #4a3a1a; }
        .method { display: inline-block; width: 60px; font-weight: bold; }
        .method.get { color: #61affe; }
        .method.post { color: #49cc90; }
        .path { font-family: monospace; direction: ltr; unicode-bidi: embed; }
        .status { float: left; font-family: monospace; }
        .time { font-size: 0.8em; color: #ccc; margin-left: 10px; }
        details { margin-top: 5px; }
        pre { background: #0f0f1a; padding: 10px; border-radius: 5px; overflow-x: auto; font-size: 12px; }
        hr { border-color: #444; }
    </style>
</head>
<body>
<h1>🔍 تست جامع APIهای interex.ir</h1>
<div class='summary'>
    <strong>📌 زمان شروع تست:</strong> " . date('Y-m-d H:i:s') . "<br>
    <strong>🌐 دامنه:</strong> https://interex.ir<br>
    <strong>⚙️ تایم‌اوت هر درخواست:</strong> 30 ثانیه<br>
    <strong>📊 وضعیت:</strong> در حال اجرا...
</div>
";

// ============================================================
// لیست کامل endpointها (بر اساس فایل api.php شما)
// ============================================================
$endpoints = [
    // ===== بدون احراز هویت (عمومی) =====
    ['method' => 'GET', 'path' => '/api/general-setting', 'name' => 'general-setting', 'auth' => false],
    ['method' => 'GET', 'path' => '/api/get-countries', 'name' => 'get-countries', 'auth' => false],
    ['method' => 'GET', 'path' => '/api/policies', 'name' => 'policies', 'auth' => false],
    ['method' => 'GET', 'path' => '/api/faq', 'name' => 'faq', 'auth' => false],
    ['method' => 'GET', 'path' => '/api/module-setting', 'name' => 'module-setting', 'auth' => false],
    ['method' => 'GET', 'path' => '/api/language/fa', 'name' => 'language (fa)', 'auth' => false],
    ['method' => 'GET', 'path' => '/api/language/en', 'name' => 'language (en)', 'auth' => false],

    // ===== احراز هویت (Auth) - بدون نیاز به توکن =====
    ['method' => 'POST', 'path' => '/api/authentication', 'name' => 'authentication (بدون داده)', 'auth' => false],
    ['method' => 'POST', 'path' => '/api/password/mobile', 'name' => 'password/mobile (بدون داده)', 'auth' => false],
    ['method' => 'POST', 'path' => '/api/password/verify-code', 'name' => 'password/verify-code (بدون داده)', 'auth' => false],
    ['method' => 'POST', 'path' => '/api/password/reset', 'name' => 'password/reset (بدون داده)', 'auth' => false],

    // ===== نیازمند احراز هویت (auth:sanctum) – فقط بررسی می‌کنیم که 401/403 برگردانند =====
    ['method' => 'POST', 'path' => '/api/login-with/qr-code/123', 'name' => 'login-with/qr-code', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/check-token', 'name' => 'check-token', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/user-data-submit', 'name' => 'user-data-submit', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/authorization', 'name' => 'authorization', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/resend-verify/email', 'name' => 'resend-verify', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/verify-mobile', 'name' => 'verify-mobile', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/verify-email', 'name' => 'verify-email', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/verify-g2fa', 'name' => 'verify-g2fa', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/kyc-form', 'name' => 'kyc-form', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/kyc-submit', 'name' => 'kyc-submit', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/dashboard', 'name' => 'dashboard', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/profile-setting', 'name' => 'profile-setting', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/change-password', 'name' => 'change-password', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/user-info', 'name' => 'user-info', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/qr-code/scan', 'name' => 'qr-code/scan', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/qr-code', 'name' => 'qr-code', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/qr-code/download', 'name' => 'qr-code/download', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/qr-code/remove', 'name' => 'qr-code/remove', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/limit-charge', 'name' => 'limit-charge', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/pin/validate', 'name' => 'pin/validate', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/offers/list', 'name' => 'offers/list', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/notification/settings', 'name' => 'notification/settings', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/notification/settings', 'name' => 'notification/settings (POST)', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/remove/promotional/notification/image', 'name' => 'remove/promotional/notification/image', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/add-money/history', 'name' => 'add-money/history', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/transactions', 'name' => 'transactions', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/push-notifications', 'name' => 'push-notifications', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/push-notifications/read/1', 'name' => 'push-notifications/read', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/twofactor', 'name' => 'twofactor', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/twofactor/enable', 'name' => 'twofactor/enable', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/twofactor/disable', 'name' => 'twofactor/disable', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/delete-account', 'name' => 'delete-account', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/user/exist', 'name' => 'user/exist', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/agent/exist', 'name' => 'agent/exist', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/merchant/exist', 'name' => 'merchant/exist', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/statements', 'name' => 'statements', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/add-money/methods', 'name' => 'add-money/methods', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/add-money/insert', 'name' => 'add-money/insert', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/ticket', 'name' => 'ticket', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/ticket/create', 'name' => 'ticket/create', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/ticket/view/1', 'name' => 'ticket/view', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/ticket/reply/1', 'name' => 'ticket/reply', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/ticket/close/1', 'name' => 'ticket/close', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/ticket/download/1', 'name' => 'ticket/download', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/cash-out/create', 'name' => 'cash-out/create', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/cash-out/store', 'name' => 'cash-out/store', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/cash-out/history', 'name' => 'cash-out/history', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/cash-out/details/1', 'name' => 'cash-out/details', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/cash-out/pdf/1', 'name' => 'cash-out/pdf', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/send-money', 'name' => 'send-money', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/send-money/store', 'name' => 'send-money/store', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/send-money/details/1', 'name' => 'send-money/details', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/send-money/history', 'name' => 'send-money/history', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/send-money/pdf/1', 'name' => 'send-money/pdf', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/request-money/create', 'name' => 'request-money/create', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/request-money/store', 'name' => 'request-money/store', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/request-money/details/1', 'name' => 'request-money/details', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/request-money/history', 'name' => 'request-money/history', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/request-money/pdf/1', 'name' => 'request-money/pdf', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/request-money/received/pdf/1', 'name' => 'request-money/received/pdf', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/request-money/received-history', 'name' => 'request-money/received-history', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/request-money/received-details/1', 'name' => 'request-money/received-details', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/request-money/received-store/1', 'name' => 'request-money/received-store', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/request-money/reject/1', 'name' => 'request-money/reject', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/make-payment/create', 'name' => 'make-payment/create', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/make-payment/store', 'name' => 'make-payment/store', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/make-payment/history', 'name' => 'make-payment/history', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/make-payment/details/1', 'name' => 'make-payment/details', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/make-payment/pdf/1', 'name' => 'make-payment/pdf', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/utility-bill/create', 'name' => 'utility-bill/create', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/utility-bill/store', 'name' => 'utility-bill/store', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/utility-bill/history', 'name' => 'utility-bill/history', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/utility-bill/details/1', 'name' => 'utility-bill/details', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/utility-bill/pdf/1', 'name' => 'utility-bill/pdf', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/utility-bill/company-details/1', 'name' => 'utility-bill/company-details', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/utility-bill/company/store', 'name' => 'utility-bill/company/store', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/utility-bill/company/delete/1', 'name' => 'utility-bill/company/delete', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/microfinance/create', 'name' => 'microfinance/create', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/microfinance/store', 'name' => 'microfinance/store', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/microfinance/history', 'name' => 'microfinance/history', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/microfinance/details/1', 'name' => 'microfinance/details', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/microfinance/form/1', 'name' => 'microfinance/form', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/microfinance/pdf/1', 'name' => 'microfinance/pdf', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/education-fee/create', 'name' => 'education-fee/create', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/education-fee/store', 'name' => 'education-fee/store', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/education-fee/history', 'name' => 'education-fee/history', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/education-fee/details/1', 'name' => 'education-fee/details', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/education-fee/pdf/1', 'name' => 'education-fee/pdf', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/mobile-recharge', 'name' => 'mobile-recharge', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/mobile-recharge/store', 'name' => 'mobile-recharge/store', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/mobile-recharge/history', 'name' => 'mobile-recharge/history', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/airtime/countries', 'name' => 'airtime/countries', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/airtime/operators-by-country/1', 'name' => 'airtime/operators-by-country', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/airtime/create', 'name' => 'airtime/create', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/airtime/store', 'name' => 'airtime/store', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/airtime/history', 'name' => 'airtime/history', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/virtual-card/list', 'name' => 'virtual-card/list', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/virtual-card/transaction', 'name' => 'virtual-card/transaction', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/virtual-card/new', 'name' => 'virtual-card/new', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/virtual-card/view/1', 'name' => 'virtual-card/view', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/virtual-card/store', 'name' => 'virtual-card/store', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/virtual-card/add/fund/1', 'name' => 'virtual-card/add/fund', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/virtual-card/cancel/1', 'name' => 'virtual-card/cancel', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/virtual-card/confidential/1', 'name' => 'virtual-card/confidential', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/donation/create', 'name' => 'donation/create', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/donation/store', 'name' => 'donation/store', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/donation/history', 'name' => 'donation/history', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/donation/details/1', 'name' => 'donation/details', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/donation/pdf/1', 'name' => 'donation/pdf', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/verification-process/verify/otp', 'name' => 'verification-process/verify/otp', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/verification-process/verify/pin', 'name' => 'verification-process/verify/pin', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/verification-process/verify/resend/otp', 'name' => 'verification-process/resend/otp', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/bank-transfer/create', 'name' => 'bank-transfer/create', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/bank-transfer/store', 'name' => 'bank-transfer/store', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/bank-transfer/history', 'name' => 'bank-transfer/history', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/bank-transfer/details/1', 'name' => 'bank-transfer/details', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/bank-transfer/pdf/1', 'name' => 'bank-transfer/pdf', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/bank-transfer/account', 'name' => 'bank-transfer/account', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/bank-transfer/account-details/1', 'name' => 'bank-transfer/account-details', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/bank-transfer/delete/account/1', 'name' => 'bank-transfer/delete/account', 'auth' => true],
    ['method' => 'GET', 'path' => '/api/logout', 'name' => 'logout', 'auth' => true],
    ['method' => 'POST', 'path' => '/api/add-device-token', 'name' => 'add-device-token', 'auth' => true],
];

// ============================================================
// اجرای تست روی هر endpoint
// ============================================================
$total = count($endpoints);
$successCount = 0;
$timeoutCount = 0;
$errorCount = 0;

foreach ($endpoints as $idx => $ep) {
    $method = $ep['method'];
    $path = $ep['path'];
    $name = $ep['name'];
    $auth = $ep['auth'];
    
    $url = "https://interex.ir" . $path;
    
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_HTTPHEADER => [
            'Accept: application/json',
            'User-Agent: API-Tester/1.0'
        ],
        // برای POSTهای بدون داده، یک بدنه خالی می‌فرستیم
        CURLOPT_POSTFIELDS => ($method === 'POST') ? '{}' : null,
    ]);
    
    $start = microtime(true);
    $response = curl_exec($ch);
    $end = microtime(true);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    $totalTime = round(($end - $start) * 1000, 2);
    curl_close($ch);
    
    $statusClass = '';
    $statusText = '';
    $isTimeout = false;
    
    if ($curlError) {
        if (strpos($curlError, 'timed out') !== false) {
            $statusClass = 'timeout';
            $statusText = "❌ TIMEOUT (بعد از 30 ثانیه)";
            $timeoutCount++;
            $isTimeout = true;
        } else {
            $statusClass = 'error';
            $statusText = "⚠️ خطای cURL: $curlError";
            $errorCount++;
        }
    } elseif ($httpCode >= 200 && $httpCode < 300) {
        $statusClass = 'success';
        $statusText = "✅ موفق (HTTP $httpCode)";
        $successCount++;
    } elseif ($httpCode === 401 || $httpCode === 403) {
        // برای endpointهای نیازمند احراز هویت، این کدها قابل قبول است
        $statusClass = 'success';
        $statusText = "✅ نیاز به احراز هویت (HTTP $httpCode) – قابل قبول";
        $successCount++;
    } elseif ($httpCode === 404) {
        $statusClass = 'error';
        $statusText = "❌ مسیر یافت نشد (404)";
        $errorCount++;
    } elseif ($httpCode === 500) {
        $statusClass = 'error';
        $statusText = "❌ خطای سرور (500)";
        $errorCount++;
    } elseif ($httpCode === 504) {
        $statusClass = 'timeout';
        $statusText = "❌ خطای 504 Gateway Timeout";
        $timeoutCount++;
        $isTimeout = true;
    } else {
        $statusClass = 'error';
        $statusText = "⚠️ کد HTTP $httpCode";
        $errorCount++;
    }
    
    // نمایش نتیجه
    $methodClass = ($method === 'GET') ? 'get' : 'post';
    echo "<div class='api-item $statusClass'>";
    echo "<span class='method $methodClass'>$method</span> ";
    echo "<span class='path'>$path</span> ";
    echo "<span class='status'>$statusText</span>";
    echo "<span class='time'>⏱️ {$totalTime}ms</span>";
    if ($auth) {
        echo " <span style='font-size:0.7em; background:#333; padding:2px 5px; border-radius:5px;'>🔒 نیاز به توکن</span>";
    }
    if ($isTimeout) {
        echo "<details><summary>🔍 جزئیات خطای تایم‌اوت</summary>";
        echo "<pre>URL: $url\nMethod: $method\ncURL Error: $curlError\nHTTP Code: $httpCode</pre>";
        echo "</details>";
    }
    echo "</div>";
    
    // فلاش کردن خروجی برای نمایش تدریجی
    flush();
    ob_flush();
    usleep(50000); // 50ms مکث بین درخواست‌ها برای جلوگیری از اورد سرور
}

// ============================================================
// جمع‌بندی نهایی
// ============================================================
echo "<div class='summary'>";
echo "<h3>📊 جمع‌بندی نهایی</h3>";
echo "<strong>✅ موفق:</strong> $successCount از $total<br>";
echo "<strong>❌ تایم‌اوت (504/Timeout):</strong> $timeoutCount از $total<br>";
echo "<strong>⚠️ سایر خطاها:</strong> $errorCount از $total<br>";
echo "<hr>";
if ($timeoutCount > 0) {
    echo "<p style='color:#ffaa00;'>⚠️ تعداد $timeoutCount endpoint با خطای تایم‌اوت مواجه شدند. این نشان می‌دهد که مشکل فقط مختص به <code>get-countries</code> نیست و کل APIهای لاراول دچار این مشکل هستند.</p>";
    echo "<p><strong>🔍 نتیجه‌گیری نهایی:</strong> وب‌سرور لایت‌اسپید به درخواست‌هایی که از <code>index.php</code> لاراول عبور می‌کنند (APIها) پاسخ نمی‌دهد، در حالی که فایل‌های PHP ساده (<code>simple.php</code>) به درستی کار می‌کنند. راه‌حل قطعی: تماس با پشتیبانی هاست برای افزایش <code>Initial Request Timeout</code> و <code>LSAPI_MAX_PROCESS_TIME</code> در تنظیمات لایت‌اسپید.</p>";
} else {
    echo "<p style='color:#00cc66;'>✅ هیچ خطای تایم‌اوتی یافت نشد. مشکل احتمالاً قبلاً حل شده است.</p>";
}
echo "<p><strong>⏱️ زمان اتمام تست:</strong> " . date('Y-m-d H:i:s') . "</p>";
echo "</div>";

echo "</body></html>";
?>