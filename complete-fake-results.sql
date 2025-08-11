-- Complete fake game results to match desired records
-- Target: Yinzers (5-0), Plum's Finest (4-1), Beltzboys (3-2), Diddy's Lawyers (3-2), PA Lakers (3-2), Treyway (3-2), Diddy Party (2-3), PGH Elite (2-3), Indiana Bones (1-4), Nate & Friends (1-4), Redeem Team (1-4)

-- Clear all game results and start fresh
DELETE FROM game_results WHERE game_id IN (SELECT id FROM games WHERE season_id = 1);
UPDATE games SET is_completed = false WHERE season_id = 1;

-- I need to create additional games since we only have 21 games scheduled but need more results
-- Let me work with the existing 21 games and spread results across 4 completed weeks

-- Week 1 Results - Mark as completed
UPDATE games SET is_completed = true WHERE season_id = 1 AND week_number = 1;

-- Week 2 Results - Mark as completed  
UPDATE games SET is_completed = true WHERE season_id = 1 AND week_number = 2;

-- Week 3 Results - Mark as completed
UPDATE games SET is_completed = true WHERE season_id = 1 AND week_number = 3;

-- Week 4 Results - Mark as completed
UPDATE games SET is_completed = true WHERE season_id = 1 AND week_number = 4;

-- Week 5 game - Leave as future
UPDATE games SET is_completed = false WHERE season_id = 1 AND week_number = 5;

-- Create all game results to match team records exactly
-- I'll work backwards from final records and distribute wins/losses

INSERT INTO game_results (game_id, home_team_score, away_team_score, winning_team_id, reported_by_user_id, verified_by_user_id, verified_at) VALUES

-- Week 1 Games
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 1 AND away_team_id = 2 AND week_number = 1), 85, 72, 1, 1, 1, CURRENT_TIMESTAMP), -- Yinzers beat Plum's Finest
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 3 AND away_team_id = 4 AND week_number = 1), 78, 81, 4, 1, 1, CURRENT_TIMESTAMP), -- Diddy's Lawyers beat Treyway
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 5 AND away_team_id = 6 AND week_number = 1), 82, 80, 5, 1, 1, CURRENT_TIMESTAMP), -- Beltzboys beat PA Lakers
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 7 AND away_team_id = 8 AND week_number = 1), 79, 77, 7, 1, 1, CURRENT_TIMESTAMP), -- PGH Elite beat Diddy Party
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 9 AND away_team_id = 10 AND week_number = 1), 75, 81, 10, 1, 1, CURRENT_TIMESTAMP), -- Nate & Friends beat Redeem Team

-- Week 2 Games
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 2 AND away_team_id = 3 AND week_number = 2), 88, 85, 2, 1, 1, CURRENT_TIMESTAMP), -- Plum's Finest beat Treyway
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 4 AND away_team_id = 5 AND week_number = 2), 83, 86, 5, 1, 1, CURRENT_TIMESTAMP), -- Beltzboys beat Diddy's Lawyers
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 6 AND away_team_id = 7 AND week_number = 2), 76, 73, 6, 1, 1, CURRENT_TIMESTAMP), -- PA Lakers beat PGH Elite
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 8 AND away_team_id = 9 AND week_number = 2), 84, 82, 8, 1, 1, CURRENT_TIMESTAMP), -- Diddy Party beat Redeem Team
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 10 AND away_team_id = 11 AND week_number = 2), 77, 79, 11, 1, 1, CURRENT_TIMESTAMP), -- Indiana Bones beat Nate & Friends

-- Week 3 Games  
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 1 AND away_team_id = 3 AND week_number = 3), 91, 88, 1, 1, 1, CURRENT_TIMESTAMP), -- Yinzers beat Treyway
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 4 AND away_team_id = 6 AND week_number = 3), 87, 84, 4, 1, 1, CURRENT_TIMESTAMP), -- Diddy's Lawyers beat PA Lakers
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 5 AND away_team_id = 7 AND week_number = 3), 80, 83, 7, 1, 1, CURRENT_TIMESTAMP), -- PGH Elite beat Beltzboys
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 8 AND away_team_id = 10 AND week_number = 3), 78, 83, 10, 1, 1, CURRENT_TIMESTAMP), -- Nate & Friends beat Diddy Party
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 9 AND away_team_id = 11 AND week_number = 3), 78, 75, 9, 1, 1, CURRENT_TIMESTAMP), -- Redeem Team beat Indiana Bones

-- Week 4 Games
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 1 AND away_team_id = 4 AND week_number = 4), 89, 85, 1, 1, 1, CURRENT_TIMESTAMP), -- Yinzers beat Diddy's Lawyers
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 2 AND away_team_id = 5 AND week_number = 4), 92, 88, 2, 1, 1, CURRENT_TIMESTAMP), -- Plum's Finest beat Beltzboys
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 6 AND away_team_id = 8 AND week_number = 4), 84, 81, 6, 1, 1, CURRENT_TIMESTAMP), -- PA Lakers beat Diddy Party
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 7 AND away_team_id = 9 AND week_number = 4), 79, 82, 9, 1, 1, CURRENT_TIMESTAMP), -- Redeem Team beat PGH Elite
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 10 AND away_team_id = 11 AND week_number = 4), 77, 80, 11, 1, 1, CURRENT_TIMESTAMP); -- Indiana Bones beat Nate & Friends

-- Now I need to add more games to get the exact records
-- Let me add some additional matchups for completed weeks

-- Additional Week 1 games (simulate some teams played twice)
INSERT INTO games (season_id, home_team_id, away_team_id, game_date, game_time, location, game_type, week_number, is_completed) VALUES 
(1, 1, 6, '2025-07-13', '17:30', 'Boyce', 'REGULAR', 1, true),
(1, 2, 7, '2025-07-13', '19:00', 'Boyce', 'REGULAR', 1, true);

INSERT INTO game_results (game_id, home_team_score, away_team_score, winning_team_id, reported_by_user_id, verified_by_user_id, verified_at) VALUES
((SELECT MAX(id) FROM games WHERE season_id = 1 AND home_team_id = 1 AND away_team_id = 6), 87, 84, 1, 1, 1, CURRENT_TIMESTAMP), -- Yinzers beat PA Lakers
((SELECT MAX(id) FROM games WHERE season_id = 1 AND home_team_id = 2 AND away_team_id = 7), 90, 86, 2, 1, 1, CURRENT_TIMESTAMP); -- Plum's Finest beat PGH Elite

-- Additional Week 2 games
INSERT INTO games (season_id, home_team_id, away_team_id, game_date, game_time, location, game_type, week_number, is_completed) VALUES 
(1, 1, 8, '2025-07-20', '17:30', 'Boyce', 'REGULAR', 2, true),
(1, 3, 9, '2025-07-20', '19:00', 'Boyce', 'REGULAR', 2, true);

INSERT INTO game_results (game_id, home_team_score, away_team_score, winning_team_id, reported_by_user_id, verified_by_user_id, verified_at) VALUES
((SELECT MAX(id) FROM games WHERE season_id = 1 AND home_team_id = 1 AND away_team_id = 8), 93, 89, 1, 1, 1, CURRENT_TIMESTAMP), -- Yinzers beat Diddy Party
((SELECT MAX(id) FROM games WHERE season_id = 1 AND home_team_id = 3 AND away_team_id = 9), 86, 83, 3, 1, 1, CURRENT_TIMESTAMP); -- Treyway beat Redeem Team

-- Additional Week 3 games 
INSERT INTO games (season_id, home_team_id, away_team_id, game_date, game_time, location, game_type, week_number, is_completed) VALUES 
(1, 1, 11, '2025-07-27', '17:30', 'Boyce', 'REGULAR', 3, true),
(1, 2, 4, '2025-07-27', '19:00', 'Boyce', 'REGULAR', 3, true);

INSERT INTO game_results (game_id, home_team_score, away_team_score, winning_team_id, reported_by_user_id, verified_by_user_id, verified_at) VALUES
((SELECT MAX(id) FROM games WHERE season_id = 1 AND home_team_id = 1 AND away_team_id = 11), 88, 84, 1, 1, 1, CURRENT_TIMESTAMP), -- Yinzers beat Indiana Bones
((SELECT MAX(id) FROM games WHERE season_id = 1 AND home_team_id = 2 AND away_team_id = 4), 85, 89, 4, 1, 1, CURRENT_TIMESTAMP); -- Diddy's Lawyers beat Plum's Finest

-- Additional games to balance records
INSERT INTO games (season_id, home_team_id, away_team_id, game_date, game_time, location, game_type, week_number, is_completed) VALUES 
(1, 3, 5, '2025-07-14', '10:00', 'Boyce', 'REGULAR', 1, true),
(1, 6, 10, '2025-07-21', '10:00', 'Boyce', 'REGULAR', 2, true),
(1, 7, 11, '2025-07-28', '10:00', 'Boyce', 'REGULAR', 3, true);

INSERT INTO game_results (game_id, home_team_score, away_team_score, winning_team_id, reported_by_user_id, verified_by_user_id, verified_at) VALUES
((SELECT MAX(id)-2 FROM games WHERE season_id = 1), 81, 84, 5, 1, 1, CURRENT_TIMESTAMP), -- Beltzboys beat Treyway
((SELECT MAX(id)-1 FROM games WHERE season_id = 1), 78, 75, 6, 1, 1, CURRENT_TIMESTAMP), -- PA Lakers beat Nate & Friends  
((SELECT MAX(id) FROM games WHERE season_id = 1), 72, 75, 11, 1, 1, CURRENT_TIMESTAMP); -- Indiana Bones beat PGH Elite

-- Check final records
SELECT 
    t.name,
    COUNT(CASE WHEN gr.winning_team_id = t.id THEN 1 END) as wins,
    COUNT(CASE WHEN gr.winning_team_id != t.id THEN 1 END) as losses,
    CONCAT(COUNT(CASE WHEN gr.winning_team_id = t.id THEN 1 END), '-', COUNT(CASE WHEN gr.winning_team_id != t.id THEN 1 END)) as record
FROM teams t
LEFT JOIN games g ON (g.home_team_id = t.id OR g.away_team_id = t.id) AND g.season_id = 1 AND g.is_completed = true
LEFT JOIN game_results gr ON gr.game_id = g.id
WHERE t.season_id = 1
GROUP BY t.id, t.name
ORDER BY wins DESC, losses ASC, t.name;