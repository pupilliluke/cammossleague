-- Consolidate game_results into games table
-- Add home_score and away_score columns to games table

BEGIN;

-- Add the new columns to games table
ALTER TABLE games ADD COLUMN home_score INTEGER;
ALTER TABLE games ADD COLUMN away_score INTEGER;

-- Migrate data from game_results to games
UPDATE games 
SET 
    home_score = gr.home_team_score,
    away_score = gr.away_team_score
FROM game_results gr 
WHERE games.id = gr.game_id;

-- Drop the trigger that updates team records (we'll need to recreate it for the games table)
DROP TRIGGER IF EXISTS trigger_update_team_records ON game_results;

-- Drop the game_results table
DROP TABLE game_results;

COMMIT;