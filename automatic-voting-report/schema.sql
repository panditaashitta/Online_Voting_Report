CREATE DATABASE IF NOT EXISTS voting_db;

USE voting_db;

CREATE TABLE IF NOT EXISTS eligible_voters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    address VARCHAR(42) UNIQUE NOT NULL,
    age_group VARCHAR(10) NOT NULL -- e.g., '18-25', '26-35', etc.
);

CREATE TABLE IF NOT EXISTS votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    voter_address VARCHAR(42) NOT NULL,
    choice VARCHAR(50) NOT NULL,
    age_group VARCHAR(10) NOT NULL,
    timestamp DATETIME NOT NULL,
    block_number BIGINT NOT NULL,
    transaction_hash VARCHAR(66) UNIQUE NOT NULL
);

-- Insert sample eligible voters (for demo)
INSERT INTO eligible_voters (address, age_group) VALUES
('0x1234567890123456789012345678901234567890', '18-25'),
('0x0987654321098765432109876543210987654321', '26-35'),
('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', '36-45'),
('0xfedcba0987654321fedcba0987654321fedcba0987', '46-55'),
('0x1111111111111111111111111111111111111111', '56+');
