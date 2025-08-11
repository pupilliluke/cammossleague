-- Direct score update with explicit casting
BEGIN;

-- First, let's check the current data type and add some debug info
UPDATE games SET 
  home_score = CAST(21 AS INTEGER), 
  away_score = CAST(18 AS INTEGER)
WHERE id = 22;

UPDATE games SET 
  home_score = CAST(22 AS INTEGER), 
  away_score = CAST(17 AS INTEGER)
WHERE id = 23;

UPDATE games SET 
  home_score = CAST(26 AS INTEGER), 
  away_score = CAST(15 AS INTEGER)
WHERE id = 24;

-- Test a few more
UPDATE games SET 
  home_score = CAST(27 AS INTEGER), 
  away_score = CAST(18 AS INTEGER)
WHERE id = 25;

UPDATE games SET 
  home_score = CAST(25 AS INTEGER), 
  away_score = CAST(21 AS INTEGER)
WHERE id = 26;

COMMIT;