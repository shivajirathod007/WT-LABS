<?php
$host = '127.0.0.1';
$port = '3308'; // 👈 Specified port from your XAMPP control panel
$username = 'root';
$password = ''; // Put your password here if you configured one
$dbname = 'electricity_db';

try {
    // 1. Connect specifying the host AND port
    $pdo = new PDO("mysql:host=$host;port=$port;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 2. Automatically create the database if missing
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8 COLLATE utf8_general_ci;");
    
    // 3. Switch to using that database
    $pdo->exec("USE `$dbname`;");

    // 4. Automatically create the table if missing
    $tableQuery = "CREATE TABLE IF NOT EXISTS bill_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        units FLOAT NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );";
    $pdo->exec($tableQuery);

    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>