-- Fix teams table to match Team entity model
-- Add missing columns: logo_url and is_active

ALTER TABLE teams 
ADD COLUMN IF NOT EXISTS logo_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Update existing records to have is_active = true
UPDATE teams SET is_active = TRUE WHERE is_active IS NULL;

-- Show the updated table structure
\d teams;

-- Show current data
SELECT id, name, city, is_active, logo_url FROM teams ORDER BY season_id DESC, name;