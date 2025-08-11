-- =============================================
-- CAM MOSS LEAGUE - DATABASE SETUP
-- =============================================
-- Run this script as postgres superuser to create databases

-- Create databases for different environments
CREATE DATABASE cammossleague 
    WITH OWNER = postgres 
    ENCODING = 'UTF8' 
    LC_COLLATE = 'English_United States.1252' 
    LC_CTYPE = 'English_United States.1252';

CREATE DATABASE cammossleague_dev 
    WITH OWNER = postgres 
    ENCODING = 'UTF8' 
    LC_COLLATE = 'English_United States.1252' 
    LC_CTYPE = 'English_United States.1252';

CREATE DATABASE cammossleague_test 
    WITH OWNER = postgres 
    ENCODING = 'UTF8' 
    LC_COLLATE = 'English_United States.1252' 
    LC_CTYPE = 'English_United States.1252';

-- Optional: Create a dedicated user (recommended for production)
-- CREATE USER cammoss_user WITH PASSWORD 'your_secure_password';
-- GRANT ALL PRIVILEGES ON DATABASE cammossleague TO cammoss_user;
-- GRANT ALL PRIVILEGES ON DATABASE cammossleague_dev TO cammoss_user;
-- GRANT ALL PRIVILEGES ON DATABASE cammossleague_test TO cammoss_user;

-- Show created databases
SELECT datname FROM pg_database WHERE datname LIKE 'cammoss%';