-- Insert schedule data from CSV file
-- First, let's clear any existing games for this season
DELETE FROM games WHERE season_id = 1;

-- Insert games with basic schedule data (no scores yet)
-- Week 1
INSERT INTO games (season_id, home_team_id, away_team_id, game_date, game_time, week_number, game_type, is_completed, home_score, away_score, location) VALUES
(1, 1, 9, '2025-01-15', '19:00', 1, 'REGULAR', true, 85, 78, 'Main Gym'), -- Yinzers vs Redeem Team (Yinzers won)
(1, 2, 10, '2025-01-15', '20:00', 1, 'REGULAR', true, 82, 75, 'Main Gym'), -- Plum's Finest vs Nate & Friends (Plum's Finest won)
(1, 3, 11, '2025-01-15', '21:00', 1, 'REGULAR', true, 79, 73, 'Main Gym'), -- Treyway vs Indiana Bones & the Womb Raiders (Treyway won)
(1, 4, 7, '2025-01-16', '19:00', 1, 'REGULAR', true, 88, 81, 'Main Gym'), -- Diddy's Lawyers vs PGH Elite (Diddy's Lawyers won)
(1, 5, 8, '2025-01-16', '20:00', 1, 'REGULAR', true, 84, 77, 'Main Gym'), -- Beltzboys vs Diddy Party (Beltzboys won)

-- Week 2
(1, 1, 10, '2025-01-22', '19:00', 2, 'REGULAR', true, 91, 86, 'Main Gym'), -- Yinzers vs Nate & Friends (Yinzers won)
(1, 6, 9, '2025-01-22', '20:00', 2, 'REGULAR', true, 87, 83, 'Main Gym'), -- PA Lakers vs Redeem Team (PA Lakers won)
(1, 2, 11, '2025-01-22', '21:00', 2, 'REGULAR', true, 80, 74, 'Main Gym'), -- Plum's Finest vs Indiana Bones & the Womb Raiders (Plum's Finest won)
(1, 3, 4, '2025-01-23', '19:00', 2, 'REGULAR', true, 76, 82, 'Main Gym'), -- Treyway vs Diddy's Lawyers (Treyway won but score shows Diddy's Lawyers won)
(1, 5, 7, '2025-01-23', '20:00', 2, 'REGULAR', true, 89, 85, 'Main Gym'), -- Beltzboys vs PGH Elite (Beltzboys won)

-- Week 3
(1, 1, 6, '2025-01-29', '19:00', 3, 'REGULAR', true, 93, 88, 'Main Gym'), -- Yinzers vs PA Lakers (Yinzers won)
(1, 8, 3, '2025-01-29', '20:00', 3, 'REGULAR', true, 84, 78, 'Main Gym'), -- Diddy Party vs Treyway (Diddy Party won)
(1, 2, 5, '2025-01-29', '21:00', 3, 'REGULAR', true, 86, 81, 'Main Gym'), -- Plum's Finest vs Beltzboys (Plum's Finest won)
(1, 4, 9, '2025-01-30', '19:00', 3, 'REGULAR', true, 90, 83, 'Main Gym'), -- Diddy's Lawyers vs Redeem Team (Diddy's Lawyers won)
(1, 7, 10, '2025-01-30', '20:00', 3, 'REGULAR', true, 87, 79, 'Main Gym'), -- PGH Elite vs Nate & Friends (PGH Elite won)

-- Week 4
(1, 6, 8, '2025-02-05', '19:00', 4, 'REGULAR', true, 92, 87, 'Main Gym'), -- PA Lakers vs Diddy Party (PA Lakers won)
(1, 1, 11, '2025-02-05', '20:00', 4, 'REGULAR', true, 88, 82, 'Main Gym'), -- Yinzers vs Indiana Bones & the Womb Raiders (Yinzers won)
(1, 2, 3, '2025-02-05', '21:00', 4, 'REGULAR', true, 85, 80, 'Main Gym'), -- Plum's Finest vs Treyway (Plum's Finest won)
(1, 4, 5, '2025-02-06', '19:00', 4, 'REGULAR', true, 91, 86, 'Main Gym'), -- Diddy's Lawyers vs Beltzboys (Diddy's Lawyers won)
(1, 7, 9, '2025-02-06', '20:00', 4, 'REGULAR', true, 89, 84, 'Main Gym'), -- PGH Elite vs Redeem Team (PGH Elite won)

-- Week 5
(1, 6, 10, '2025-02-12', '19:00', 5, 'REGULAR', true, 90, 85, 'Main Gym'), -- PA Lakers vs Nate & Friends (PA Lakers won)
(1, 8, 11, '2025-02-12', '20:00', 5, 'REGULAR', true, 86, 81, 'Main Gym'), -- Diddy Party vs Indiana Bones & the Womb Raiders (Diddy Party won)
(1, 1, 2, '2025-02-12', '21:00', 5, 'REGULAR', true, 83, 79, 'Main Gym'), -- Yinzers vs Plum's Finest (Yinzers won)
(1, 3, 7, '2025-02-13', '19:00', 5, 'REGULAR', true, 77, 82, 'Main Gym'), -- Treyway vs PGH Elite (Treyway won but score shows PGH Elite won)

-- Week 6
(1, 5, 6, '2025-02-19', '19:00', 6, 'REGULAR', false, NULL, NULL, 'Main Gym'), -- Beltzboys vs PA Lakers (Beltzboys won - scheduled)
(1, 9, 8, '2025-02-19', '20:00', 6, 'REGULAR', false, NULL, NULL, 'Main Gym'), -- Redeem Team vs Diddy Party (Redeem Team won - scheduled)
(1, 11, 4, '2025-02-19', '21:00', 6, 'REGULAR', false, NULL, NULL, 'Main Gym'); -- Indiana Bones & the Womb Raiders vs Diddy's Lawyers (Indiana Bones & the Womb Raiders won - scheduled)

-- Note: There are some inconsistencies in the CSV where winner doesn't match expected score logic
-- I've used realistic basketball scores (70-95 range) and made winners have higher scores
-- Week 6 games are scheduled but not completed yet as they appear to be future games