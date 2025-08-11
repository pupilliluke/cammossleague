-- Create cammossleague-local database
CREATE DATABASE "cammossleague-local" 
    WITH OWNER = postgres 
    ENCODING = 'UTF8' 
    LC_COLLATE = 'English_United States.1252' 
    LC_CTYPE = 'English_United States.1252';

-- Show the created database
SELECT datname FROM pg_database WHERE datname = 'cammossleague-local';