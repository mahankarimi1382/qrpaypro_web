<?php
/**
 * Server & Laravel Environment Checker
 * Compare two servers to find differences.
 * 
 * After use, DELETE THIS FILE from server!
 */

// Prevent caching
header("Cache-Control: no-cache, must-revalidate");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");

echo "<html><head><title>Server Environment Check</title>";
echo "<style>
    body { font-family: monospace; background: #f4f4f4; padding: 20px; }
    .section { background: #fff; border: 1px solid #ddd; margin-bottom: 20px; padding: 15px; border-radius: 5px; }
    h2 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px; }
    .ok { color: green; font-weight: bold; }
    .warn { color: orange; font-weight: bold; }
    .error { color: red; font-weight: bold; }
    pre { background: #f9f9f9; padding: 10px; border-left: 3px solid #3498db; overflow-x: auto; }
</style>";
echo "</head><body>";

// 1. PHP & Server Basic Info
echo "<div class='section'><h2>1. PHP & Server Info</h2>";
echo "<p><strong>PHP Version:</strong> " . phpversion() . "</p>";
echo "<p><strong>Server Software:</strong> " . ($_SERVER['SERVER_SOFTWARE'] ?? 'N/A') . "</p>";
echo "<p><strong>Server IP:</strong> " . ($_SERVER['SERVER_ADDR'] ?? 'N/A') . "</p>";
echo "<p><strong>Document Root:</strong> " . ($_SERVER['DOCUMENT_ROOT'] ?? 'N/A') . "</p>";
echo "<p><strong>Current File Path:</strong> " . __FILE__ . "</p>";
echo "</div>";

// 2. Important PHP Extensions
echo "<div class='section'><h2>2. Required PHP Extensions (for Laravel)</h2>";
$extensions = [
    'pdo', 'pdo_mysql', 'mysqlnd', 'mbstring', 'xml', 'curl',
    'json', 'openssl', 'tokenizer', 'ctype', 'fileinfo',
    'bcmath', 'zip', 'gd', 'intl'
];
foreach ($extensions as $ext) {
    $loaded = extension_loaded($ext);
    echo "<p>" . str_pad($ext, 15) . ": <span class='" . ($loaded ? "ok" : "error") . "'>" . ($loaded ? "Loaded" : "NOT LOADED") . "</span></p>";
}
echo "</div>";

// 3. PHP Configuration Limits
echo "<div class='section'><h2>3. PHP Settings</h2>";
$settings = [
    'memory_limit', 'max_execution_time', 'max_input_time',
    'post_max_size', 'upload_max_filesize', 'display_errors',
    'error_reporting', 'date.timezone', 'allow_url_fopen'
];
foreach ($settings as $s) {
    echo "<p>" . str_pad($s, 25) . " = " . ini_get($s) . "</p>";
}
echo "</div>";

// 4. .env file check (Laravel config)
echo "<div class='section'><h2>4. Laravel .env File</h2>";
// Assume the .env is one level above public, typical Laravel structure:
// public/index.php -> ../core/.env ? Path from error: /home/interexi/public_html/core/
// We'll try a few common paths.
$envPaths = [
    dirname(__DIR__) . '/.env',                     // sibling of public
    dirname(__DIR__) . '/../.env',                  // one level up
    dirname(dirname(__FILE__)) . '/.env',           // current dir's parent
    '/home/interexi/public_html/core/.env'          // from your error
];

$envFile = null;
foreach ($envPaths as $path) {
    if (file_exists($path)) {
        $envFile = $path;
        break;
    }
}

if ($envFile) {
    echo "<p><span class='ok'>Found .env at:</span> " . $envFile . "</p>";
    $env = parse_ini_file($envFile);
    if ($env) {
        // Show DB connection info without password
        $dbConnection = $env['DB_CONNECTION'] ?? 'mysql';
        $dbHost = $env['DB_HOST'] ?? '127.0.0.1';
        $dbPort = $env['DB_PORT'] ?? '3306';
        $dbDatabase = $env['DB_DATABASE'] ?? '';
        $dbUsername = $env['DB_USERNAME'] ?? '';
        echo "<p><strong>DB_CONNECTION:</strong> $dbConnection</p>";
        echo "<p><strong>DB_HOST:</strong> $dbHost</p>";
        echo "<p><strong>DB_PORT:</strong> $dbPort</p>";
        echo "<p><strong>DB_DATABASE:</strong> $dbDatabase</p>";
        echo "<p><strong>DB_USERNAME:</strong> $dbUsername</p>";
        // Do not show password for security
    } else {
        echo "<p class='warn'>Could not parse .env file.</p>";
    }
} else {
    echo "<p class='error'>.env file not found in searched paths.</p>";
    echo "<p>Tried paths:</p><ul>";
    foreach ($envPaths as $path) {
        echo "<li>$path</li>";
    }
    echo "</ul>";
}
echo "</div>";

// 5. Database connection & table check
echo "<div class='section'><h2>5. Database & 'general_settings' Table</h2>";
if (isset($env) && $env) {
    $dbConnection = $env['DB_CONNECTION'] ?? 'mysql';
    $dbHost = $env['DB_HOST'] ?? '127.0.0.1';
    $dbPort = $env['DB_PORT'] ?? '3306';
    $dbDatabase = $env['DB_DATABASE'] ?? '';
    $dbUsername = $env['DB_USERNAME'] ?? '';
    $dbPassword = $env['DB_PASSWORD'] ?? '';

    if ($dbConnection == 'mysql') {
        try {
            $dsn = "mysql:host=$dbHost;port=$dbPort;dbname=$dbDatabase;charset=utf8mb4";
            $pdo = new PDO($dsn, $dbUsername, $dbPassword, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
            echo "<p><span class='ok'>Database connection successful.</span></p>";

            // Check if table exists
            $stmt = $pdo->query("SHOW TABLES LIKE 'general_settings'");
            $tableExists = $stmt->rowCount() > 0;

            if ($tableExists) {
                echo "<p><span class='ok'>Table 'general_settings' EXISTS.</span></p>";
                // Count rows
                $countStmt = $pdo->query("SELECT COUNT(*) as cnt FROM general_settings");
                $row = $countStmt->fetch();
                echo "<p>Number of rows: " . $row['cnt'] . "</p>";
            } else {
                echo "<p><span class='error'>Table 'general_settings' DOES NOT EXIST!</span></p>";
            }

            // List all tables in the database (optional but useful)
            echo "<p><strong>All tables in database '$dbDatabase':</strong></p>";
            $tablesStmt = $pdo->query("SHOW TABLES");
            $tables = $tablesStmt->fetchAll(PDO::FETCH_COLUMN);
            echo "<pre>" . implode("\n", $tables) . "</pre>";

        } catch (PDOException $e) {
            echo "<p class='error'>Database connection failed: " . $e->getMessage() . "</p>";
        }
    } else {
        echo "<p class='warn'>Database connection is not MySQL. Cannot check table.</p>";
    }
} else {
    echo "<p class='error'>No database credentials available.</p>";
}
echo "</div>";

// 6. File permissions (maybe relevant)
echo "<div class='section'><h2>6. File Permissions</h2>";
$pathsToCheck = [
    '/home/interexi/public_html/core/storage',
    '/home/interexi/public_html/core/bootstrap/cache',
    dirname(__DIR__) . '/storage', // guessed
];
foreach ($pathsToCheck as $path) {
    if (file_exists($path)) {
        $perms = substr(sprintf('%o', fileperms($path)), -4);
        $owner = fileowner($path);
        $group = filegroup($path);
        if (function_exists('posix_getpwuid')) {
            $ownerInfo = posix_getpwuid($owner);
            $ownerName = $ownerInfo['name'] ?? $owner;
        } else {
            $ownerName = $owner;
        }
        if (function_exists('posix_getgrgid')) {
            $groupInfo = posix_getgrgid($group);
            $groupName = $groupInfo['name'] ?? $group;
        } else {
            $groupName = $group;
        }
        echo "<p>$path : permissions=$perms, owner=$ownerName, group=$groupName</p>";
    } else {
        echo "<p class='warn'>Path not found: $path</p>";
    }
}
echo "</div>";

echo "<hr><p style='text-align:center;color:red;'>⚠️ Remember to DELETE this file after debugging!</p>";
echo "</body></html>";
?>