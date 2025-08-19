-- Seed data for basketball league management system

-- Create initial admin user (password: admin123)
INSERT INTO users (username, password_hash, email, first_name, last_name, role, is_active) VALUES
('admin', '$2a$10$8cjz47bjbR4Mn8GMg9IZx.vyjhLXR/SKKXUA7qBwSh6WVyO8M2e96', 'admin@cammossleague.com', 'System', 'Administrator', 'ADMIN', true);

-- Create sample league
INSERT INTO leagues (name, description, is_active) VALUES
('Cam Moss Basketball League', 'Premier adult basketball league featuring competitive play and community engagement', true);

-- Create 2025 Summer Season
INSERT INTO seasons (name, year, season_type, start_date, end_date, registration_open_date, registration_close_date, playoff_start_date, is_active, is_registration_open, max_teams, description) VALUES
('Summer League', 2025, 'SUMMER', '2025-06-01', '2025-08-31', '2025-04-01', '2025-05-15', '2025-08-01', true, true, 12, 'Summer 2025 basketball season featuring 12 weeks of regular season play followed by playoffs');

-- Create sample players/users
INSERT INTO users (username, email, first_name, last_name, role, phone, is_active) VALUES
('jdoe', 'john.doe@email.com', 'John', 'Doe', 'PLAYER', '555-0101', true),
('msmith', 'mike.smith@email.com', 'Mike', 'Smith', 'PLAYER', '555-0102', true),
('sjones', 'sarah.jones@email.com', 'Sarah', 'Jones', 'PLAYER', '555-0103', true),
('bwilson', 'bob.wilson@email.com', 'Bob', 'Wilson', 'COACH', '555-0104', true),
('ljohnson', 'lisa.johnson@email.com', 'Lisa', 'Johnson', 'PLAYER', '555-0105', true),
('dbrook', 'david.brook@email.com', 'David', 'Brook', 'PLAYER', '555-0106', true),
('amartin', 'anna.martin@email.com', 'Anna', 'Martin', 'PLAYER', '555-0107', true),
('cgarcia', 'carlos.garcia@email.com', 'Carlos', 'Garcia', 'PLAYER', '555-0108', true);

-- Create sample teams for 2025 season
INSERT INTO teams (name, season_id, captain_id, coach_id, division, team_color) VALUES
('Thunder Bolts', 1, 2, 4, 'Division A', 'Blue'),
('Lightning Hawks', 1, 3, NULL, 'Division A', 'Red'),
('Storm Riders', 1, 5, NULL, 'Division A', 'Green'),
('Fire Dragons', 1, 6, NULL, 'Division B', 'Orange'),
('Ice Warriors', 1, 7, NULL, 'Division B', 'Purple'),
('Wind Runners', 1, 8, NULL, 'Division B', 'Yellow');

-- Create player records for 2025 season
INSERT INTO players (user_id, season_id, jersey_number, position, height, years_experience) VALUES
(2, 1, 23, 'Forward', '6''2"', 3),
(3, 1, 15, 'Guard', '5''8"', 2),
(5, 1, 7, 'Center', '6''5"', 4),
(6, 1, 12, 'Guard', '5''10"', 1),
(7, 1, 33, 'Forward', '6''1"', 2),
(8, 1, 21, 'Guard', '5''9"', 3);

-- Assign players to teams
INSERT INTO player_teams (player_id, team_id, role) VALUES
(1, 1, 'CAPTAIN'),
(2, 2, 'CAPTAIN'),
(3, 3, 'CAPTAIN'),
(4, 4, 'CAPTAIN'),
(5, 5, 'CAPTAIN'),
(6, 6, 'CAPTAIN');

-- Create sample schedule for first 4 weeks
INSERT INTO schedules (season_id, week_number, start_date, end_date, is_published) VALUES
(1, 1, '2025-06-02', '2025-06-08', true),
(1, 2, '2025-06-09', '2025-06-15', true),
(1, 3, '2025-06-16', '2025-06-22', true),
(1, 4, '2025-06-23', '2025-06-29', true);

-- Create sample games for first 2 weeks
INSERT INTO games (season_id, home_team_id, away_team_id, game_date, game_time, location, week_number, court_number) VALUES
-- Week 1
(1, 1, 2, '2025-06-02', '19:00:00', 'Community Center', 1, 'Court 1'),
(1, 3, 4, '2025-06-02', '20:00:00', 'Community Center', 1, 'Court 1'),
(1, 5, 6, '2025-06-02', '21:00:00', 'Community Center', 1, 'Court 1'),
-- Week 2
(1, 2, 3, '2025-06-09', '19:00:00', 'Community Center', 2, 'Court 1'),
(1, 4, 5, '2025-06-09', '20:00:00', 'Community Center', 2, 'Court 1'),
(1, 6, 1, '2025-06-09', '21:00:00', 'Community Center', 2, 'Court 1');

-- Create some completed games with scores
UPDATE games SET is_completed = true, home_score = 85, away_score = 78 WHERE id = 1;
UPDATE games SET is_completed = true, home_score = 72, away_score = 89 WHERE id = 2;
UPDATE games SET is_completed = true, home_score = 91, away_score = 83 WHERE id = 3;

-- Update team records based on completed games
UPDATE teams SET wins = 1, losses = 0, points_for = 85, points_against = 78 WHERE id = 1;
UPDATE teams SET wins = 0, losses = 1, points_for = 78, points_against = 85 WHERE id = 2;
UPDATE teams SET wins = 0, losses = 1, points_for = 72, points_against = 89 WHERE id = 3;
UPDATE teams SET wins = 1, losses = 0, points_for = 89, points_against = 72 WHERE id = 4;
UPDATE teams SET wins = 1, losses = 0, points_for = 91, points_against = 83 WHERE id = 5;
UPDATE teams SET wins = 0, losses = 1, points_for = 83, points_against = 91 WHERE id = 6;

-- Create sample league updates
INSERT INTO league_updates (season_id, title, content, author, is_published) VALUES
(1, 'Welcome to Summer 2025 Season!', 'The Summer 2025 season is officially underway! We have 6 competitive teams ready to battle it out over the next 12 weeks. Games are played every Monday at the Community Center starting at 7 PM.', 'League Commissioner', true),
(1, 'Week 1 Recap', 'Week 1 is in the books! Thunder Bolts, Fire Dragons, and Ice Warriors all secured victories in their opening games. Great basketball all around!', 'League Commissioner', true);

-- Create sample form submissions
INSERT INTO form_submissions (form_type, submitter_name, submitter_email, subject, message, status) VALUES
('COMPLAINT', 'John Player', 'john.player@email.com', 'Referee Decision Complaint', 'I would like to file a complaint about the referee''s decision in last night''s game between Thunder Bolts and Lightning Hawks.', 'PENDING'),
('TEAM_SIGNUP', 'New Team Captain', 'newteam@email.com', 'Team Registration for Summer 2025', 'We would like to register a new team called "Golden Eagles" for the Summer 2025 season. We have 8 committed players.', 'IN_REVIEW'),
('GENERAL_INQUIRY', 'Interested Player', 'player@email.com', 'How to Join the League', 'Hi, I''m new to the area and interested in joining the basketball league. What''s the process?', 'PENDING');

-- Create sample playoff bracket (not active yet)
INSERT INTO playoff_brackets (season_id, bracket_name, bracket_type, max_teams, is_active) VALUES
(1, 'Summer 2025 Playoffs', 'SINGLE_ELIMINATION', 4, false);