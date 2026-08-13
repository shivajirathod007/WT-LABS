CREATE DATABASE IF NOT EXISTS electricity_db;
USE electricity_db;

CREATE TABLE IF NOT EXISTS bill_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    units FLOAT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);