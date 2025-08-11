-- Create 2025 Season Schedule
-- Clear existing games for 2025 season first
DELETE FROM game_results WHERE game_id IN (SELECT id FROM games WHERE season_id = 1);
DELETE FROM games WHERE season_id = 1;

-- July 13, 2025 - Week 1 (5 games, Team 11 bye)
INSERT INTO games (season_id, home_team_id, away_team_id, game_date, game_time, location, game_type, week_number, is_completed) VALUES 
(1, 1, 2, '2025-07-13', '10:00', 'Main Court', 'REGULAR', 1, false),  -- Yinzers vs Plum's Finest
(1, 3, 4, '2025-07-13', '11:30', 'Main Court', 'REGULAR', 1, false),  -- Treyway vs Diddy's Lawyers
(1, 5, 6, '2025-07-13', '13:00', 'Main Court', 'REGULAR', 1, false),  -- Beltzboys vs PA Lakers
(1, 7, 8, '2025-07-13', '14:30', 'Main Court', 'REGULAR', 1, false),  -- PGH Elite vs Diddy Party
(1, 9, 10, '2025-07-13', '16:00', 'Main Court', 'REGULAR', 1, false); -- Redeem Team vs Nate & Friends
-- Indiana Bones & the Womb Raiders (11) - BYE

-- July 20, 2025 - Week 2 (5 games, Team 1 bye)
INSERT INTO games (season_id, home_team_id, away_team_id, game_date, game_time, location, game_type, week_number, is_completed) VALUES 
(1, 2, 3, '2025-07-20', '10:00', 'Main Court', 'REGULAR', 2, false),  -- Plum's Finest vs Treyway
(1, 4, 5, '2025-07-20', '11:30', 'Main Court', 'REGULAR', 2, false),  -- Diddy's Lawyers vs Beltzboys
(1, 6, 7, '2025-07-20', '13:00', 'Main Court', 'REGULAR', 2, false),  -- PA Lakers vs PGH Elite
(1, 8, 9, '2025-07-20', '14:30', 'Main Court', 'REGULAR', 2, false),  -- Diddy Party vs Redeem Team
(1, 10, 11, '2025-07-20', '16:00', 'Main Court', 'REGULAR', 2, false); -- Nate & Friends vs Indiana Bones & the Womb Raiders
-- Yinzers (1) - BYE

-- July 27, 2025 - Week 3 (5 games, Team 2 bye)
INSERT INTO games (season_id, home_team_id, away_team_id, game_date, game_time, location, game_type, week_number, is_completed) VALUES 
(1, 1, 3, '2025-07-27', '10:00', 'Main Court', 'REGULAR', 3, false),  -- Yinzers vs Treyway
(1, 4, 6, '2025-07-27', '11:30', 'Main Court', 'REGULAR', 3, false),  -- Diddy's Lawyers vs PA Lakers
(1, 5, 7, '2025-07-27', '13:00', 'Main Court', 'REGULAR', 3, false),  -- Beltzboys vs PGH Elite
(1, 8, 10, '2025-07-27', '14:30', 'Main Court', 'REGULAR', 3, false),  -- Diddy Party vs Nate & Friends
(1, 9, 11, '2025-07-27', '16:00', 'Main Court', 'REGULAR', 3, false);  -- Redeem Team vs Indiana Bones & the Womb Raiders
-- Plum's Finest (2) - BYE

-- August 3, 2025 - Week 4 (5 games, Team 3 bye)
INSERT INTO games (season_id, home_team_id, away_team_id, game_date, game_time, location, game_type, week_number, is_completed) VALUES 
(1, 1, 4, '2025-08-03', '10:00', 'Main Court', 'REGULAR', 4, false),  -- Yinzers vs Diddy's Lawyers
(1, 2, 5, '2025-08-03', '11:30', 'Main Court', 'REGULAR', 4, false),  -- Plum's Finest vs Beltzboys
(1, 6, 8, '2025-08-03', '13:00', 'Main Court', 'REGULAR', 4, false),  -- PA Lakers vs Diddy Party
(1, 7, 9, '2025-08-03', '14:30', 'Main Court', 'REGULAR', 4, false),  -- PGH Elite vs Redeem Team
(1, 10, 11, '2025-08-03', '16:00', 'Main Court', 'REGULAR', 4, false); -- Nate & Friends vs Indiana Bones & the Womb Raiders
-- Treyway (3) - BYE

-- August 7, 2025 - Week 5 Special Game (Championship or Rivalry Game)
INSERT INTO games (season_id, home_team_id, away_team_id, game_date, game_time, location, game_type, week_number, is_completed) VALUES 
(1, 1, 4, '2025-08-07', '19:00', 'Championship Arena', 'CHAMPIONSHIP', 5, false); -- Yinzers vs Diddy's Lawyers (Top teams rivalry)

-- Show the created schedule
SELECT 
    g.game_date,
    g.game_time,
    ht.name as home_team,
    at.name as away_team,
    g.location,
    g.game_type,
    g.week_number
FROM games g
JOIN teams ht ON g.home_team_id = ht.id
JOIN teams at ON g.away_team_id = at.id
WHERE g.season_id = 1
ORDER BY g.game_date, g.game_time;