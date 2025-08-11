-- Add username and password columns to users table
ALTER TABLE users 
ADD COLUMN username VARCHAR(50) UNIQUE,
ADD COLUMN password_hash TEXT;

-- Make firebase_uid nullable since we now support username/password auth
ALTER TABLE users 
ALTER COLUMN firebase_uid DROP NOT NULL;

-- Update existing users with sample usernames and passwords for testing
-- Admin user
UPDATE users 
SET username = 'admin', password_hash = '$2a$10$rZ1zQjKHVxzZvCl5P5xjAeEqRlvJ5qK4TzVGFz8pN8rXkSdVwD1D2' 
WHERE email = 'admin@cammossleague.com';

-- Player users - create simple usernames based on their names
UPDATE users 
SET username = LOWER(CONCAT(SUBSTRING(first_name, 1, 1), last_name)), 
    password_hash = '$2a$10$rZ1zQjKHVxzZvCl5P5xjAeEqRlvJ5qK4TzVGFz8pN8rXkSdVwD1D2'  -- password: 'password'
WHERE role = 'PLAYER';

-- Coach users  
UPDATE users 
SET username = LOWER(CONCAT(SUBSTRING(first_name, 1, 1), last_name)),
    password_hash = '$2a$10$rZ1zQjKHVxzZvCl5P5xjAeEqRlvJ5qK4TzVGFz8pN8rXkSdVwD1D2'  -- password: 'password'
WHERE role = 'COACH';

-- Handle duplicates by adding numbers
UPDATE users u1
SET username = CONCAT(u1.username, '2')
WHERE EXISTS (
    SELECT 1 FROM users u2 
    WHERE u2.username = u1.username AND u2.id < u1.id
);