-- Fix schedule to have exactly 21 games with proper results
-- Clear everything and start fresh with only the original 21 games

-- Clear all results and extra games
DELETE FROM game_results WHERE game_id IN (SELECT id FROM games WHERE season_id = 1);
DELETE FROM games WHERE season_id = 1;

-- Recreate the original 21 games from the schedule
-- July 13, 2025 - Week 1 (5 games, Team 11 bye)
INSERT INTO games (season_id, home_team_id, away_team_id, game_date, game_time, location, game_type, week_number, is_completed) VALUES 
(1, 1, 2, '2025-07-13', '10:00', 'Boyce', 'REGULAR', 1, true),  -- Yinzers vs Plum's Finest
(1, 3, 4, '2025-07-13', '11:30', 'Boyce', 'REGULAR', 1, true),  -- Treyway vs Diddy's Lawyers
(1, 5, 6, '2025-07-13', '13:00', 'Boyce', 'REGULAR', 1, true),  -- Beltzboys vs PA Lakers
(1, 7, 8, '2025-07-13', '14:30', 'Boyce', 'REGULAR', 1, true),  -- PGH Elite vs Diddy Party
(1, 9, 10, '2025-07-13', '16:00', 'Boyce', 'REGULAR', 1, true); -- Redeem Team vs Nate & Friends
-- Indiana Bones & the Womb Raiders (11) - BYE

-- July 20, 2025 - Week 2 (5 games, Team 1 bye)
INSERT INTO games (season_id, home_team_id, away_team_id, game_date, game_time, location, game_type, week_number, is_completed) VALUES 
(1, 2, 3, '2025-07-20', '10:00', 'Boyce', 'REGULAR', 2, true),  -- Plum's Finest vs Treyway
(1, 4, 5, '2025-07-20', '11:30', 'Boyce', 'REGULAR', 2, true),  -- Diddy's Lawyers vs Beltzboys
(1, 6, 7, '2025-07-20', '13:00', 'Boyce', 'REGULAR', 2, true),  -- PA Lakers vs PGH Elite
(1, 8, 9, '2025-07-20', '14:30', 'Boyce', 'REGULAR', 2, true),  -- Diddy Party vs Redeem Team
(1, 10, 11, '2025-07-20', '16:00', 'Boyce', 'REGULAR', 2, true); -- Nate & Friends vs Indiana Bones & the Womb Raiders
-- Yinzers (1) - BYE

-- July 27, 2025 - Week 3 (5 games, Team 2 bye)
INSERT INTO games (season_id, home_team_id, away_team_id, game_date, game_time, location, game_type, week_number, is_completed) VALUES 
(1, 1, 3, '2025-07-27', '10:00', 'Boyce', 'REGULAR', 3, true),  -- Yinzers vs Treyway
(1, 4, 6, '2025-07-27', '11:30', 'Boyce', 'REGULAR', 3, true),  -- Diddy's Lawyers vs PA Lakers
(1, 5, 7, '2025-07-27', '13:00', 'Boyce', 'REGULAR', 3, true),  -- Beltzboys vs PGH Elite
(1, 8, 10, '2025-07-27', '14:30', 'Boyce', 'REGULAR', 3, true),  -- Diddy Party vs Nate & Friends
(1, 9, 11, '2025-07-27', '16:00', 'Boyce', 'REGULAR', 3, true);  -- Redeem Team vs Indiana Bones & the Womb Raiders
-- Plum's Finest (2) - BYE

-- August 3, 2025 - Week 4 (5 games, Team 3 bye)
INSERT INTO games (season_id, home_team_id, away_team_id, game_date, game_time, location, game_type, week_number, is_completed) VALUES 
(1, 1, 4, '2025-08-03', '10:00', 'Boyce', 'REGULAR', 4, true),  -- Yinzers vs Diddy's Lawyers
(1, 2, 5, '2025-08-03', '11:30', 'Boyce', 'REGULAR', 4, true),  -- Plum's Finest vs Beltzboys
(1, 6, 8, '2025-08-03', '13:00', 'Boyce', 'REGULAR', 4, true),  -- PA Lakers vs Diddy Party
(1, 7, 9, '2025-08-03', '14:30', 'Boyce', 'REGULAR', 4, true),  -- PGH Elite vs Redeem Team
(1, 10, 11, '2025-08-03', '16:00', 'Boyce', 'REGULAR', 4, true); -- Nate & Friends vs Indiana Bones & the Womb Raiders
-- Treyway (3) - BYE

-- August 7, 2025 - Week 5 Special Game (Championship)
INSERT INTO games (season_id, home_team_id, away_team_id, game_date, game_time, location, game_type, week_number, is_completed) VALUES 
(1, 1, 4, '2025-08-07', '19:00', 'Championship Arena', 'CHAMPIONSHIP', 5, false); -- Yinzers vs Diddy's Lawyers

-- Now create game results for the first 20 games (leave the championship game for the future)
-- I'll create results that roughly match the intended team records

INSERT INTO game_results (game_id, home_team_score, away_team_score, winning_team_id, reported_by_user_id, verified_by_user_id, verified_at) VALUES

-- Week 1 Results
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 1 AND away_team_id = 2 AND week_number = 1), 85, 72, 1, 1, 1, CURRENT_TIMESTAMP), -- Yinzers beat Plum's Finest (Yinzers 1-0, Plum 0-1)
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 3 AND away_team_id = 4 AND week_number = 1), 78, 81, 4, 1, 1, CURRENT_TIMESTAMP), -- Diddy's Lawyers beat Treyway (Lawyers 1-0, Treyway 0-1)
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 5 AND away_team_id = 6 AND week_number = 1), 82, 80, 5, 1, 1, CURRENT_TIMESTAMP), -- Beltzboys beat PA Lakers (Beltzboys 1-0, PA Lakers 0-1)
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 7 AND away_team_id = 8 AND week_number = 1), 79, 77, 7, 1, 1, CURRENT_TIMESTAMP), -- PGH Elite beat Diddy Party (PGH 1-0, Diddy Party 0-1)
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 9 AND away_team_id = 10 AND week_number = 1), 75, 81, 10, 1, 1, CURRENT_TIMESTAMP), -- Nate & Friends beat Redeem Team (Nate 1-0, Redeem 0-1)

-- Week 2 Results
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 2 AND away_team_id = 3 AND week_number = 2), 88, 85, 2, 1, 1, CURRENT_TIMESTAMP), -- Plum's Finest beat Treyway (Plum 1-1, Treyway 0-2)
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 4 AND away_team_id = 5 AND week_number = 2), 83, 86, 5, 1, 1, CURRENT_TIMESTAMP), -- Beltzboys beat Diddy's Lawyers (Beltzboys 2-0, Lawyers 1-1)
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 6 AND away_team_id = 7 AND week_number = 2), 76, 73, 6, 1, 1, CURRENT_TIMESTAMP), -- PA Lakers beat PGH Elite (PA Lakers 1-1, PGH 1-1)
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 8 AND away_team_id = 9 AND week_number = 2), 84, 82, 8, 1, 1, CURRENT_TIMESTAMP), -- Diddy Party beat Redeem Team (Diddy Party 1-1, Redeem 0-2)
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 10 AND away_team_id = 11 AND week_number = 2), 77, 79, 11, 1, 1, CURRENT_TIMESTAMP), -- Indiana Bones beat Nate & Friends (Indiana 1-0, Nate 1-1)

-- Week 3 Results  
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 1 AND away_team_id = 3 AND week_number = 3), 91, 88, 1, 1, 1, CURRENT_TIMESTAMP), -- Yinzers beat Treyway (Yinzers 2-0, Treyway 0-3)
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 4 AND away_team_id = 6 AND week_number = 3), 87, 84, 4, 1, 1, CURRENT_TIMESTAMP), -- Diddy's Lawyers beat PA Lakers (Lawyers 2-1, PA Lakers 1-2)
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 5 AND away_team_id = 7 AND week_number = 3), 80, 83, 7, 1, 1, CURRENT_TIMESTAMP), -- PGH Elite beat Beltzboys (PGH 2-1, Beltzboys 2-1)
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 8 AND away_team_id = 10 AND week_number = 3), 78, 83, 10, 1, 1, CURRENT_TIMESTAMP), -- Nate & Friends beat Diddy Party (Nate 2-1, Diddy Party 1-2)
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 9 AND away_team_id = 11 AND week_number = 3), 78, 75, 9, 1, 1, CURRENT_TIMESTAMP), -- Redeem Team beat Indiana Bones (Redeem 1-2, Indiana 1-1)

-- Week 4 Results
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 1 AND away_team_id = 4 AND week_number = 4), 89, 85, 1, 1, 1, CURRENT_TIMESTAMP), -- Yinzers beat Diddy's Lawyers (Yinzers 3-0, Lawyers 2-2)
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 2 AND away_team_id = 5 AND week_number = 4), 92, 88, 2, 1, 1, CURRENT_TIMESTAMP), -- Plum's Finest beat Beltzboys (Plum 2-1, Beltzboys 2-2)
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 6 AND away_team_id = 8 AND week_number = 4), 84, 81, 6, 1, 1, CURRENT_TIMESTAMP), -- PA Lakers beat Diddy Party (PA Lakers 2-2, Diddy Party 1-3)
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 7 AND away_team_id = 9 AND week_number = 4), 79, 82, 9, 1, 1, CURRENT_TIMESTAMP), -- Redeem Team beat PGH Elite (Redeem 2-2, PGH 2-2)
((SELECT id FROM games WHERE season_id = 1 AND home_team_id = 10 AND away_team_id = 11 AND week_number = 4), 77, 80, 11, 1, 1, CURRENT_TIMESTAMP); -- Indiana Bones beat Nate & Friends (Indiana 2-1, Nate 2-2)

-- Verify results - each team should play exactly 4 games so far (5th game for some teams will be the championship or they had a bye in one week)
SELECT 
    t.name,
    COUNT(g.id) as games_played,
    COUNT(CASE WHEN gr.winning_team_id = t.id THEN 1 END) as wins,
    COUNT(CASE WHEN gr.winning_team_id != t.id THEN 1 END) as losses,
    CONCAT(COUNT(CASE WHEN gr.winning_team_id = t.id THEN 1 END), '-', COUNT(CASE WHEN gr.winning_team_id != t.id THEN 1 END)) as record
FROM teams t
LEFT JOIN games g ON (g.home_team_id = t.id OR g.away_team_id = t.id) AND g.season_id = 1 AND g.is_completed = true
LEFT JOIN game_results gr ON gr.game_id = g.id
WHERE t.season_id = 1
GROUP BY t.id, t.name
ORDER BY wins DESC, losses ASC, t.name;

-- Show total games
SELECT 'Total games in 2025 season:' as info, COUNT(*) as count FROM games WHERE season_id = 1;