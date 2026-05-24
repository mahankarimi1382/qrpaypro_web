<?php
// 设置 JSON 响应头
header('Content-Type: application/json; charset=utf-8');

// 尝试包含 Laravel 的自动加载器，以便使用 Eloquent
$loader = @require_once __DIR__ . '/../vendor/autoload.php';

if ($loader) {
    // 如果自动加载成功，尝试创建一个简化的 Laravel 应用实例来连接数据库
    try {
        $app = require_once __DIR__ . '/../bootstrap/app.php';
        $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
        $kernel->bootstrap();

        // 使用 Eloquent 模型查询
        $countries = \App\Models\Country::where('status', 1)->orderBy('name')->get([
            'id', 'name', 'iso_name', 'continent', 'currency_code',
            'currency_name', 'currency_symbol', 'flag_url', 'calling_codes'
        ]);
        echo $countries->toJson();
    } catch (\Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to bootstrap Laravel: ' . $e->getMessage()]);
    }
} else {
    // 如果自动加载失败，回退到纯 PDO 方式
    try {
        $pdo = new PDO(
            "mysql:host=localhost;dbname=interexi_db;charset=utf8mb4",
            "interexi_user",
            'hG6XI{A-!)]pKJVb',
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );

        $stmt = $pdo->query(
            "SELECT id, name, iso_name, continent, currency_code, 
                    currency_name, currency_symbol, flag_url, calling_codes 
             FROM countries WHERE status = 1 ORDER BY name"
        );
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC), JSON_UNESCAPED_UNICODE);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    }
}