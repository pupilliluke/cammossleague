-- Test database setup for Cam Moss League
-- Simple approach to create database and users table

-- Drop and recreate database
DROP DATABASE IF EXISTS cammossleague_local;
CREATE DATABASE cammossleague_local 
    WITH OWNER = postgres 
    ENCODING = 'UTF8';

-- Connect to the database
\c cammossleague_local;

-- Create basic users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'PLAYER',
    is_free_agent BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert a test user for validation
INSERT INTO users (username, password_hash, email, first_name, last_name, role) 
VALUES ('testuser', '$2a$10$example.hash.here', 'test@example.com', 'Test', 'User', 'PLAYER');

SELECT 'Database and users table created successfully' as status;
SELECT COUNT(*) as user_count FROM users;