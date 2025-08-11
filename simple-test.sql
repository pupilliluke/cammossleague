-- Simple test to create database and users table
CREATE DATABASE IF NOT EXISTS cammossleague_local;

-- Use simple table structure that matches your Java model
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    password_hash VARCHAR(255),
    firebase_uid VARCHAR(128) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'PLAYER',
    is_free_agent BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    profile_image_url VARCHAR(500),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Test insert
INSERT INTO users (username, password_hash, email, first_name, last_name) 
VALUES ('testuser', '$2a$10$dummy.hash.for.testing', 'test@example.com', 'Test', 'User');

SELECT * FROM users;