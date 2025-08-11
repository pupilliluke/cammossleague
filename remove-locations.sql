-- Remove all city/location data from teams table
-- Set all city values to NULL to remove location data

UPDATE teams SET city = NULL;

-- Verify all cities are now NULL
SELECT id, name, city FROM teams WHERE city IS NOT NULL;

-- Show all teams without city data
SELECT id, name, city, wins, losses FROM teams ORDER BY season_id DESC, wins DESC, name;