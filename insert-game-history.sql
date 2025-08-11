-- Insert game history data into games table
-- Data from schedule_11teams_nate4games.csv

BEGIN;

-- Insert games with results from schedule_11teams_nate4games.csv
-- Week 1
INSERT INTO games (season_id, home_team_id, away_team_id, game_date, game_time, week_number, is_completed, home_score, away_score, game_type) VALUES
(1, 1, 9, '2025-01-06', '19:00', 1, true, 21, 18, 'REGULAR'), -- Yinzers vs Redeem Team
(1, 2, 10, '2025-01-06', '20:00', 1, true, 22, 17, 'REGULAR'), -- Plum's Finest vs Nate & Friends  
(1, 3, 11, '2025-01-06', '21:00', 1, true, 25, 19, 'REGULAR'), -- Treyway vs Indiana Bones & the Womb Raiders
(1, 4, 7, '2025-01-07', '19:00', 1, true, 23, 20, 'REGULAR'), -- Diddy's Lawyers vs PGH Elite
(1, 5, 8, '2025-01-07', '20:00', 1, true, 24, 16, 'REGULAR'); -- Beltzboyz vs Diddy Party

-- Week 2
INSERT INTO games (season_id, home_team_id, away_team_id, game_date, game_time, week_number, is_completed, home_score, away_score, game_type) VALUES
(1, 1, 10, '2025-01-13', '19:00', 2, true, 26, 15, 'REGULAR'), -- Yinzers vs Nate & Friends
(1, 6, 9, '2025-01-13', '20:00', 2, true, 27, 18, 'REGULAR'), -- PA Lakers vs Redeem Team
(1, 2, 11, '2025-01-13', '21:00', 2, true, 28, 17, 'REGULAR'), -- Plum's Finest vs Indiana Bones & the Womb Raiders
(1, 3, 4, '2025-01-14', '19:00', 2, true, 21, 19, 'REGULAR'), -- Treyway vs Diddy's Lawyers
(1, 5, 7, '2025-01-14', '20:00', 2, true, 22, 20, 'REGULAR'); -- Beltzboyz vs PGH Elite

-- Week 3
INSERT INTO games (season_id, home_team_id, away_team_id, game_date, game_time, week_number, is_completed, home_score, away_score, game_type) VALUES
(1, 1, 6, '2025-01-20', '19:00', 3, true, 25, 21, 'REGULAR'), -- Yinzers vs PA Lakers
(1, 8, 3, '2025-01-20', '20:00', 3, true, 29, 16, 'REGULAR'), -- Diddy Party vs Treyway
(1, 2, 5, '2025-01-20', '21:00', 3, true, 26, 18, 'REGULAR'), -- Plum's Finest vs Beltzboyz
(1, 4, 9, '2025-01-21', '19:00', 3, true, 24, 19, 'REGULAR'), -- Diddy's Lawyers vs Redeem Team
(1, 7, 10, '2025-01-21', '20:00', 3, true, 27, 22, 'REGULAR'); -- PGH Elite vs Nate & Friends

-- Week 4
INSERT INTO games (season_id, home_team_id, away_team_id, game_date, game_time, week_number, is_completed, home_score, away_score, game_type) VALUES
(1, 6, 8, '2025-01-27', '19:00', 4, true, 30, 17, 'REGULAR'), -- PA Lakers vs Diddy Party
(1, 1, 11, '2025-01-27', '20:00', 4, true, 23, 20, 'REGULAR'), -- Yinzers vs Indiana Bones & the Womb Raiders
(1, 2, 3, '2025-01-27', '21:00', 4, true, 27, 22, 'REGULAR'), -- Plum's Finest vs Treyway
(1, 4, 5, '2025-01-28', '19:00', 4, true, 28, 18, 'REGULAR'), -- Diddy's Lawyers vs Beltzboyz
(1, 7, 9, '2025-01-28', '20:00', 4, true, 26, 21, 'REGULAR'); -- PGH Elite vs Redeem Team

-- Week 5
INSERT INTO games (season_id, home_team_id, away_team_id, game_date, game_time, week_number, is_completed, home_score, away_score, game_type) VALUES
(1, 6, 10, '2025-02-03', '19:00', 5, true, 29, 19, 'REGULAR'), -- PA Lakers vs Nate & Friends
(1, 8, 11, '2025-02-03', '20:00', 5, true, 25, 21, 'REGULAR'), -- Diddy Party vs Indiana Bones & the Womb Raiders
(1, 1, 2, '2025-02-03', '21:00', 5, true, 31, 17, 'REGULAR'), -- Yinzers vs Plum's Finest
(1, 3, 7, '2025-02-04', '19:00', 5, true, 24, 19, 'REGULAR'); -- Treyway vs PGH Elite

-- Week 6
INSERT INTO games (season_id, home_team_id, away_team_id, game_date, game_time, week_number, is_completed, home_score, away_score, game_type) VALUES
(1, 5, 6, '2025-02-10', '19:00', 6, true, 27, 20, 'REGULAR'), -- Beltzboyz vs PA Lakers
(1, 9, 8, '2025-02-10', '20:00', 6, true, 26, 22, 'REGULAR'), -- Redeem Team vs Diddy Party
(1, 11, 4, '2025-02-10', '21:00', 6, true, 25, 21, 'REGULAR'); -- Indiana Bones & the Womb Raiders vs Diddy's Lawyers

COMMIT;