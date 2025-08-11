-- Direct update of game scores for completed games
-- Based on the game history data

BEGIN;

-- Update scores for our Week 1 games
UPDATE games SET 
  home_score = 21, 
  away_score = 18, 
  is_completed = true 
WHERE id = 22 AND week_number = 1;

UPDATE games SET 
  home_score = 22, 
  away_score = 17, 
  is_completed = true 
WHERE id = 23 AND week_number = 1;

-- Update Week 2 games
UPDATE games SET 
  home_score = 26, 
  away_score = 15, 
  is_completed = true 
WHERE id = 24 AND week_number = 2;

UPDATE games SET 
  home_score = 27, 
  away_score = 18, 
  is_completed = true 
WHERE id = 25 AND week_number = 2;

-- Update Week 3 games
UPDATE games SET 
  home_score = 25, 
  away_score = 21, 
  is_completed = true 
WHERE id = 26 AND week_number = 3;

UPDATE games SET 
  home_score = 29, 
  away_score = 16, 
  is_completed = true 
WHERE id = 27 AND week_number = 3;

-- Update Week 4 games
UPDATE games SET 
  home_score = 30, 
  away_score = 17, 
  is_completed = true 
WHERE id = 28 AND week_number = 4;

UPDATE games SET 
  home_score = 23, 
  away_score = 20, 
  is_completed = true 
WHERE id = 29 AND week_number = 4;

-- Update Week 5 games
UPDATE games SET 
  home_score = 31, 
  away_score = 17, 
  is_completed = true 
WHERE id = 30 AND week_number = 5;

COMMIT;