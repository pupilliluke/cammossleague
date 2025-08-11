-- =============================================
-- CAM MOSS LEAGUE - SAMPLE DATA
-- =============================================

-- Insert initial admin user
INSERT INTO users (firebase_uid, email, first_name, last_name, role, is_active) VALUES 
('admin-uid-12345', 'admin@cammossleague.com', 'League', 'Administrator', 'ADMIN', true);

-- Insert sample seasons
INSERT INTO seasons (name, year, season_type, start_date, end_date, registration_open_date, registration_close_date, playoff_start_date, is_active, is_registration_open, description) VALUES 
('Summer 2025 League', 2025, 'SUMMER', '2025-06-01', '2025-08-31', '2025-05-01', '2025-05-25', '2025-08-15', true, true, 'The premier summer basketball league featuring competitive play and community spirit.'),
('Summer 2024 League', 2024, 'SUMMER', '2024-06-01', '2024-08-31', '2024-05-01', '2024-05-25', '2024-08-15', false, false, 'Previous season featuring intense competition and memorable games.');

-- Get the season ID for subsequent inserts (PostgreSQL approach)
-- Note: In real applications, you'd handle this differently or use sequences

-- Insert sample users (players and coaches) - 20 players for 4 teams (5 per team)
INSERT INTO users (firebase_uid, email, first_name, last_name, phone, role, is_free_agent, profile_image_url) VALUES 
-- Thunder Hawks Players (Team 1)
('player1-uid', 'john.smith@email.com', 'John', 'Smith', '555-0101', 'PLAYER', false, null),
('player2-uid', 'mike.johnson@email.com', 'Mike', 'Johnson', '555-0102', 'PLAYER', false, null),
('player3-uid', 'david.brown@email.com', 'David', 'Brown', '555-0103', 'PLAYER', false, null),
('player4-uid', 'chris.davis@email.com', 'Chris', 'Davis', '555-0104', 'PLAYER', false, null),
('player5-uid', 'james.wilson@email.com', 'James', 'Wilson', '555-0105', 'PLAYER', false, null),
-- Fire Dragons Players (Team 2)
('player6-uid', 'robert.garcia@email.com', 'Robert', 'Garcia', '555-0106', 'PLAYER', false, null),
('player7-uid', 'michael.martinez@email.com', 'Michael', 'Martinez', '555-0107', 'PLAYER', false, null),
('player8-uid', 'william.anderson@email.com', 'William', 'Anderson', '555-0108', 'PLAYER', false, null),
('player9-uid', 'thomas.taylor@email.com', 'Thomas', 'Taylor', '555-0109', 'PLAYER', false, null),
('player10-uid', 'daniel.moore@email.com', 'Daniel', 'Moore', '555-0110', 'PLAYER', false, null),
-- Lightning Bolts Players (Team 3)
('player11-uid', 'matthew.jackson@email.com', 'Matthew', 'Jackson', '555-0111', 'PLAYER', false, null),
('player12-uid', 'anthony.white@email.com', 'Anthony', 'White', '555-0112', 'PLAYER', false, null),
('player13-uid', 'joshua.harris@email.com', 'Joshua', 'Harris', '555-0113', 'PLAYER', false, null),
('player14-uid', 'andrew.martin@email.com', 'Andrew', 'Martin', '555-0114', 'PLAYER', false, null),
('player15-uid', 'kenneth.thompson@email.com', 'Kenneth', 'Thompson', '555-0115', 'PLAYER', false, null),
-- Steel Warriors Players (Team 4)
('player16-uid', 'paul.garcia@email.com', 'Paul', 'Garcia', '555-0116', 'PLAYER', false, null),
('player17-uid', 'mark.rodriguez@email.com', 'Mark', 'Rodriguez', '555-0117', 'PLAYER', false, null),
('player18-uid', 'steven.lewis@email.com', 'Steven', 'Lewis', '555-0118', 'PLAYER', false, null),
('player19-uid', 'kevin.lee@email.com', 'Kevin', 'Lee', '555-0119', 'PLAYER', false, null),
('player20-uid', 'brian.walker@email.com', 'Brian', 'Walker', '555-0120', 'PLAYER', false, null),
-- Coaches
('coach1-uid', 'coach.thompson@email.com', 'Coach', 'Thompson', '555-0201', 'COACH', false, null),
('coach2-uid', 'coach.williams@email.com', 'Coach', 'Williams', '555-0202', 'COACH', false, null),
-- Free Agents
('freeagent1-uid', 'alex.rodriguez@email.com', 'Alex', 'Rodriguez', '555-0301', 'PLAYER', true, null),
('freeagent2-uid', 'sarah.wilson@email.com', 'Sarah', 'Wilson', '555-0302', 'PLAYER', true, null);

-- Insert sample teams for 2025 season (season_id = 1)
INSERT INTO teams (season_id, name, city, primary_color, secondary_color, captain_user_id, coach_user_id, wins, losses, points_for, points_against, description) VALUES 
(1, 'Yinzers', 'Pittsburgh', '#FFD700', '#000000', 2, 10, 0, 0, 0, 0, 'Steel City squad representing true Pittsburgh spirit.'),
(1, 'Plum''s Finest', 'Plum', '#800080', '#FFFFFF', 3, 11, 0, 0, 0, 0, 'Elite talent from the Plum community.'),
(1, 'Treyway', 'East Side', '#FF4500', '#000000', 4, null, 0, 0, 0, 0, 'Three-point specialists with downtown swagger.'),
(1, 'Diddy''s Lawyers', 'Downtown', '#2F4F4F', '#C0C0C0', 5, null, 0, 0, 0, 0, 'Sharp legal minds who know how to win cases and games.'),
(1, 'Beltzboys', 'Beltztown', '#008000', '#FFFF00', 6, null, 0, 0, 0, 0, 'Hardworking team with blue-collar determination.'),
(1, 'PA Lakers', 'Pennsylvania', '#552583', '#FDB927', 7, null, 0, 0, 0, 0, 'Purple and gold excellence from the keystone state.'),
(1, 'PGH Elite', 'Pittsburgh', '#000000', '#FFD700', 8, null, 0, 0, 0, 0, 'The cream of the crop from the Steel City.'),
(1, 'Diddy Party', 'Uptown', '#FF1493', '#FFFFFF', 9, null, 0, 0, 0, 0, 'High-energy team that knows how to celebrate wins.'),
(1, 'Redeem Team', 'South Side', '#DC143C', '#FFFFFF', 10, null, 0, 0, 0, 0, 'Looking to redeem themselves and prove their worth.'),
(1, 'Nate & Friends', 'North Hills', '#4169E1', '#FFFFFF', 11, null, 0, 0, 0, 0, 'Friendship and teamwork drive this close-knit squad.'),
(1, 'Indiana Bones & the Womb Raiders', 'West End', '#8B4513', '#F5DEB3', 12, null, 0, 0, 0, 0, 'Archaeological precision meets fearless raiding mentality.');

-- Insert sample teams for 2024 season (season_id = 2) - Different team lineup
INSERT INTO teams (season_id, name, city, primary_color, secondary_color, captain_user_id, coach_user_id, wins, losses, points_for, points_against, description) VALUES 
(2, 'Thunder Hawks', 'Downtown', '#1E40AF', '#FFFFFF', 7, 10, 5, 3, 425, 380, '2024 Champions - dominated with strong offensive play.'),
(2, 'Fire Dragons', 'Eastside', '#DC2626', '#FBBF24', 12, 11, 4, 4, 389, 395, 'Consistent performers who made the playoffs.'),
(2, 'Cyber Wolves', 'Southside', '#059669', '#D1FAE5', 17, null, 3, 5, 356, 410, 'New franchise that joined in 2024 with hungry young talent.'),
(2, 'Storm Riders', 'Uptown', '#7C2D12', '#FED7AA', 2, null, 2, 6, 342, 435, 'Rebuilding team focused on developing chemistry.');

-- Insert sample players for 2025 season (20 players total - 5 per team)
INSERT INTO players (user_id, season_id, jersey_number, position, height_inches, weight_lbs, years_experience, stats_games_played, stats_points, stats_rebounds, stats_assists) VALUES 
-- Thunder Hawks Players (Team 1) - users 2-6
(2, 1, 23, 'SF', 78, 195, 3, 4, 72, 28, 16),
(3, 1, 15, 'PG', 72, 175, 2, 4, 56, 16, 32),
(4, 1, 8, 'C', 82, 220, 4, 4, 48, 36, 8),
(5, 1, 12, 'SG', 75, 185, 1, 4, 64, 20, 12),
(6, 1, 7, 'PF', 80, 210, 2, 4, 52, 32, 10),
-- Fire Dragons Players (Team 2) - users 7-11
(7, 1, 21, 'PG', 70, 165, 1, 4, 44, 12, 28),
(8, 1, 33, 'SF', 77, 190, 3, 4, 60, 24, 18),
(9, 1, 42, 'C', 83, 230, 5, 4, 40, 40, 6),
(10, 1, 14, 'SG', 74, 180, 2, 4, 55, 18, 22),
(11, 1, 25, 'PF', 79, 205, 3, 4, 58, 30, 14),
-- Lightning Bolts Players (Team 3) - users 12-16
(12, 1, 11, 'PG', 71, 170, 4, 4, 62, 14, 35),
(13, 1, 22, 'SG', 76, 188, 2, 4, 67, 22, 18),
(14, 1, 34, 'SF', 78, 192, 3, 4, 54, 26, 20),
(15, 1, 45, 'PF', 81, 215, 1, 4, 49, 35, 9),
(16, 1, 5, 'C', 84, 240, 6, 4, 43, 42, 5),
-- Steel Warriors Players (Team 4) - users 17-21
(17, 1, 9, 'PG', 69, 160, 2, 4, 38, 10, 30),
(18, 1, 18, 'SG', 73, 175, 1, 4, 41, 15, 16),
(19, 1, 31, 'SF', 77, 185, 3, 4, 47, 20, 12),
(20, 1, 40, 'PF', 80, 200, 4, 4, 52, 28, 8),
(21, 1, 50, 'C', 82, 225, 2, 4, 44, 32, 4),
-- Free Agents
(23, 1, null, 'UTIL', 74, 180, 0, 0, 0, 0, 0),
(24, 1, null, 'UTIL', 68, 155, 1, 0, 0, 0, 0);

-- Insert sample players for 2024 season - DEMONSTRATING MULTI-SEASON FUNCTIONALITY
-- Shows how same users can be on different teams in different seasons
INSERT INTO players (user_id, season_id, jersey_number, position, height_inches, weight_lbs, years_experience, stats_games_played, stats_points, stats_rebounds, stats_assists) VALUES 
-- Thunder Hawks 2024 (Team 5) - Different roster than 2025
(7, 2, 21, 'PG', 70, 165, 0, 8, 88, 24, 56), -- Robert Garcia - Was on Fire Dragons in 2025, now Thunder Hawks captain
(12, 2, 11, 'PG', 71, 170, 3, 8, 124, 28, 70), -- Matthew Jackson - Was on Lightning Bolts in 2025
(3, 2, 15, 'SG', 72, 175, 1, 8, 96, 32, 52), -- Mike Johnson - Same team as 2025, but different stats
(19, 2, 31, 'SF', 77, 185, 2, 8, 94, 40, 24), -- Steven Lewis - Was on Steel Warriors in 2025
(9, 2, 42, 'C', 83, 230, 4, 8, 80, 80, 12), -- Thomas Taylor - Was on Fire Dragons in 2025
-- Fire Dragons 2024 (Team 6) - Different roster
(13, 2, 22, 'SG', 76, 188, 1, 8, 134, 44, 36), -- Anthony White - Was on Lightning Bolts in 2025, now captain
(2, 2, 23, 'SF', 78, 195, 2, 8, 112, 48, 28), -- John Smith - Was on Thunder Hawks in 2025
(16, 2, 5, 'C', 84, 240, 5, 8, 86, 84, 10), -- Kenneth Thompson - Was on Lightning Bolts in 2025
(18, 2, 18, 'SG', 73, 175, 0, 8, 82, 30, 32), -- Mark Rodriguez - Was on Steel Warriors in 2025
(11, 2, 25, 'PF', 79, 205, 2, 8, 116, 60, 28), -- Daniel Moore - Same team as 2025
-- Cyber Wolves 2024 (Team 7) - New team
(17, 2, 9, 'PG', 69, 160, 1, 8, 76, 20, 60), -- Paul Garcia - Was on Steel Warriors in 2025, now captain
(14, 2, 34, 'SF', 78, 192, 2, 8, 108, 52, 40), -- Joshua Harris - Was on Lightning Bolts in 2025
(6, 2, 7, 'PF', 80, 210, 1, 8, 104, 64, 20), -- James Wilson - Was on Thunder Hawks in 2025
(21, 2, 50, 'C', 82, 225, 1, 8, 88, 64, 8), -- Brian Walker - Was on Steel Warriors in 2025
(8, 2, 33, 'SF', 77, 190, 2, 8, 120, 48, 36), -- William Anderson - Was on Fire Dragons in 2025
-- Storm Riders 2024 (Team 8) - Different roster
(4, 2, 8, 'C', 82, 220, 3, 8, 96, 72, 16), -- David Brown - Was on Thunder Hawks in 2025
(15, 2, 45, 'PF', 81, 215, 0, 8, 98, 70, 18), -- Andrew Martin - Was on Lightning Bolts in 2025
(10, 2, 14, 'SG', 74, 180, 1, 8, 110, 36, 44), -- Thomas Taylor - Was on Fire Dragons in 2025
(20, 2, 40, 'PF', 80, 200, 3, 8, 104, 56, 16), -- Kevin Lee - Was on Steel Warriors in 2025
(5, 2, 12, 'SG', 75, 185, 0, 8, 128, 40, 24); -- Chris Davis - Was on Thunder Hawks in 2025

-- Insert player-team relationships for 2025 season (5 players per team)
INSERT INTO player_teams (player_id, team_id, status, approved_at, approved_by_user_id) VALUES 
-- Thunder Hawks 2025 (Team 1) - Players 1-5
(1, 1, 'ACTIVE', CURRENT_TIMESTAMP, 1),
(2, 1, 'ACTIVE', CURRENT_TIMESTAMP, 1),
(3, 1, 'ACTIVE', CURRENT_TIMESTAMP, 1),
(4, 1, 'ACTIVE', CURRENT_TIMESTAMP, 1),
(5, 1, 'ACTIVE', CURRENT_TIMESTAMP, 1),
-- Fire Dragons 2025 (Team 2) - Players 6-10
(6, 2, 'ACTIVE', CURRENT_TIMESTAMP, 1),
(7, 2, 'ACTIVE', CURRENT_TIMESTAMP, 1),
(8, 2, 'ACTIVE', CURRENT_TIMESTAMP, 1),
(9, 2, 'ACTIVE', CURRENT_TIMESTAMP, 1),
(10, 2, 'ACTIVE', CURRENT_TIMESTAMP, 1),
-- Lightning Bolts 2025 (Team 3) - Players 11-15
(11, 3, 'ACTIVE', CURRENT_TIMESTAMP, 1),
(12, 3, 'ACTIVE', CURRENT_TIMESTAMP, 1),
(13, 3, 'ACTIVE', CURRENT_TIMESTAMP, 1),
(14, 3, 'ACTIVE', CURRENT_TIMESTAMP, 1),
(15, 3, 'ACTIVE', CURRENT_TIMESTAMP, 1),
-- Steel Warriors 2025 (Team 4) - Players 16-20
(16, 4, 'ACTIVE', CURRENT_TIMESTAMP, 1),
(17, 4, 'ACTIVE', CURRENT_TIMESTAMP, 1),
(18, 4, 'ACTIVE', CURRENT_TIMESTAMP, 1),
(19, 4, 'ACTIVE', CURRENT_TIMESTAMP, 1),
(20, 4, 'ACTIVE', CURRENT_TIMESTAMP, 1);

-- Insert player-team relationships for 2024 season - DEMONSTRATING MULTI-SEASON FUNCTIONALITY
INSERT INTO player_teams (player_id, team_id, status, approved_at, approved_by_user_id) VALUES 
-- Thunder Hawks 2024 (Team 5) - Players 23-27 (note: player IDs continue from 2025 season)
(23, 5, 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '365 days', 1), -- Robert Garcia
(24, 5, 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '365 days', 1), -- Matthew Jackson  
(25, 5, 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '365 days', 1), -- Mike Johnson
(26, 5, 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '365 days', 1), -- Steven Lewis
(27, 5, 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '365 days', 1), -- Thomas Taylor
-- Fire Dragons 2024 (Team 6) - Players 28-32
(28, 6, 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '365 days', 1), -- Anthony White
(29, 6, 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '365 days', 1), -- John Smith
(30, 6, 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '365 days', 1), -- Kenneth Thompson
(31, 6, 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '365 days', 1), -- Mark Rodriguez
(32, 6, 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '365 days', 1), -- Daniel Moore
-- Cyber Wolves 2024 (Team 7) - Players 33-37
(33, 7, 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '365 days', 1), -- Paul Garcia
(34, 7, 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '365 days', 1), -- Joshua Harris
(35, 7, 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '365 days', 1), -- James Wilson
(36, 7, 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '365 days', 1), -- Brian Walker
(37, 7, 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '365 days', 1), -- William Anderson
-- Storm Riders 2024 (Team 8) - Players 38-42
(38, 8, 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '365 days', 1), -- David Brown
(39, 8, 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '365 days', 1), -- Andrew Martin
(40, 8, 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '365 days', 1), -- Thomas Taylor
(41, 8, 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '365 days', 1), -- Kevin Lee
(42, 8, 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '365 days', 1); -- Chris Davis

-- Insert sample games
INSERT INTO games (season_id, home_team_id, away_team_id, game_date, game_time, location, game_type, week_number, is_completed) VALUES 
(1, 1, 2, '2025-06-15', '18:00', 'Central Community Center', 'REGULAR', 1, true),
(1, 3, 4, '2025-06-15', '19:30', 'Central Community Center', 'REGULAR', 1, true),
(1, 2, 3, '2025-06-22', '18:00', 'East Side Gym', 'REGULAR', 2, true),
(1, 1, 4, '2025-06-22', '19:30', 'East Side Gym', 'REGULAR', 2, true),
(1, 1, 3, '2025-06-29', '18:00', 'West Side Recreation', 'REGULAR', 3, false),
(1, 2, 4, '2025-06-29', '19:30', 'West Side Recreation', 'REGULAR', 3, false);

-- Insert sample game results for completed games
INSERT INTO game_results (game_id, home_team_score, away_team_score, winning_team_id, reported_by_user_id, verified_by_user_id, verified_at) VALUES 
(1, 78, 72, 1, 2, 1, CURRENT_TIMESTAMP),
(2, 65, 82, 4, 5, 1, CURRENT_TIMESTAMP),
(3, 76, 74, 2, 3, 1, CURRENT_TIMESTAMP),
(4, 68, 71, 4, 8, 1, CURRENT_TIMESTAMP);

-- Insert sample league updates
INSERT INTO league_updates (season_id, title, content, update_type, is_pinned, is_published, published_at, author_user_id) VALUES 
(1, 'Welcome to Summer 2025 Season!', 'We''re excited to kick off another incredible season of basketball! This summer promises to be our most competitive yet with 4 amazing teams ready to battle it out on the court. Games start June 15th at Central Community Center.', 'ANNOUNCEMENT', true, true, CURRENT_TIMESTAMP, 1),
(1, 'Week 2 Results Summary', 'What an exciting week of basketball! Thunder Hawks maintained their perfect record with a solid victory over Steel Warriors, while Fire Dragons bounced back with a narrow win against Lightning Bolts. Check out the full standings on our league page.', 'NEWS', false, true, CURRENT_TIMESTAMP - INTERVAL '2 days', 1),
(1, 'Playoff Bracket Preview', 'With just a few weeks left in the regular season, the playoff picture is starting to take shape. Currently, Thunder Hawks lead the standings, followed closely by Fire Dragons and Lightning Bolts. Every game counts as teams fight for playoff positioning!', 'PLAYOFF_UPDATE', false, true, CURRENT_TIMESTAMP - INTERVAL '1 day', 1);

-- Insert additional games for a complete schedule (2025 Season - Season ID 1)
-- Each team plays each other team 3 times (12 games per team total)
INSERT INTO games (season_id, home_team_id, away_team_id, game_date, game_time, location, game_type, week_number, is_completed) VALUES 
-- Week 4 games
(1, 3, 1, '2025-07-06', '18:00', 'North Side Arena', 'REGULAR', 4, false),
(1, 4, 2, '2025-07-06', '19:30', 'North Side Arena', 'REGULAR', 4, false),
-- Week 5 games
(1, 2, 1, '2025-07-13', '18:00', 'Central Community Center', 'REGULAR', 5, false),
(1, 4, 3, '2025-07-13', '19:30', 'Central Community Center', 'REGULAR', 5, false),
-- Week 6 games
(1, 1, 2, '2025-07-20', '18:00', 'East Side Gym', 'REGULAR', 6, false),
(1, 3, 4, '2025-07-20', '19:30', 'East Side Gym', 'REGULAR', 6, false),
-- Week 7 games
(1, 2, 3, '2025-07-27', '18:00', 'West Side Recreation', 'REGULAR', 7, false),
(1, 1, 4, '2025-07-27', '19:30', 'West Side Recreation', 'REGULAR', 7, false),
-- Week 8 games
(1, 1, 3, '2025-08-03', '18:00', 'North Side Arena', 'REGULAR', 8, false),
(1, 2, 4, '2025-08-03', '19:30', 'North Side Arena', 'REGULAR', 8, false),
-- Week 9 games (final regular season)
(1, 3, 2, '2025-08-10', '18:00', 'Central Community Center', 'REGULAR', 9, false),
(1, 4, 1, '2025-08-10', '19:30', 'Central Community Center', 'REGULAR', 9, false),
-- Playoff games (Week 10-11)
(1, 1, 4, '2025-08-17', '18:00', 'Championship Arena', 'PLAYOFF', 10, false),
(1, 2, 3, '2025-08-17', '19:30', 'Championship Arena', 'PLAYOFF', 10, false),
-- Championship game
(1, 1, 2, '2025-08-24', '19:00', 'Championship Arena', 'CHAMPIONSHIP', 11, false);

-- Insert games for 2024 season (Season ID 2) - completed season
INSERT INTO games (season_id, home_team_id, away_team_id, game_date, game_time, location, game_type, week_number, is_completed) VALUES 
-- 2024 Regular Season (all completed)
(2, 5, 6, '2024-06-15', '18:00', 'Central Community Center', 'REGULAR', 1, true),
(2, 7, 8, '2024-06-15', '19:30', 'Central Community Center', 'REGULAR', 1, true),
(2, 6, 7, '2024-06-22', '18:00', 'East Side Gym', 'REGULAR', 2, true),
(2, 5, 8, '2024-06-22', '19:30', 'East Side Gym', 'REGULAR', 2, true),
(2, 5, 7, '2024-06-29', '18:00', 'West Side Recreation', 'REGULAR', 3, true),
(2, 6, 8, '2024-06-29', '19:30', 'West Side Recreation', 'REGULAR', 3, true),
(2, 7, 5, '2024-07-06', '18:00', 'North Side Arena', 'REGULAR', 4, true),
(2, 8, 6, '2024-07-06', '19:30', 'North Side Arena', 'REGULAR', 4, true),
(2, 6, 5, '2024-07-13', '18:00', 'Central Community Center', 'REGULAR', 5, true),
(2, 8, 7, '2024-07-13', '19:30', 'Central Community Center', 'REGULAR', 5, true),
(2, 5, 6, '2024-07-20', '18:00', 'East Side Gym', 'REGULAR', 6, true),
(2, 7, 8, '2024-07-20', '19:30', 'East Side Gym', 'REGULAR', 6, true),
(2, 6, 7, '2024-07-27', '18:00', 'West Side Recreation', 'REGULAR', 7, true),
(2, 5, 8, '2024-07-27', '19:30', 'West Side Recreation', 'REGULAR', 7, true),
(2, 5, 7, '2024-08-03', '18:00', 'North Side Arena', 'REGULAR', 8, true),
(2, 6, 8, '2024-08-03', '19:30', 'North Side Arena', 'REGULAR', 8, true),
(2, 7, 6, '2024-08-10', '18:00', 'Central Community Center', 'REGULAR', 9, true),
(2, 8, 5, '2024-08-10', '19:30', 'Central Community Center', 'REGULAR', 9, true),
-- 2024 Playoffs (completed)
(2, 5, 8, '2024-08-17', '18:00', 'Championship Arena', 'PLAYOFF', 10, true),
(2, 6, 7, '2024-08-17', '19:30', 'Championship Arena', 'PLAYOFF', 10, true),
-- 2024 Championship game
(2, 5, 6, '2024-08-24', '19:00', 'Championship Arena', 'CHAMPIONSHIP', 11, true);

-- Insert additional game results for 2024 season (all games completed)
INSERT INTO game_results (game_id, home_team_score, away_team_score, winning_team_id, reported_by_user_id, verified_by_user_id, verified_at) VALUES 
-- 2024 season results (game IDs will be 16+ based on previous inserts)
(16, 85, 78, 5, 23, 1, '2024-06-15 20:30:00'), -- Thunder Hawks beat Fire Dragons
(17, 72, 69, 7, 33, 1, '2024-06-15 21:45:00'), -- Cyber Wolves beat Storm Riders
(18, 81, 79, 6, 28, 1, '2024-06-22 20:15:00'), -- Fire Dragons beat Cyber Wolves
(19, 76, 74, 5, 23, 1, '2024-06-22 21:30:00'), -- Thunder Hawks beat Storm Riders
(20, 88, 82, 5, 23, 1, '2024-06-29 20:00:00'), -- Thunder Hawks beat Cyber Wolves  
(21, 79, 77, 6, 28, 1, '2024-06-29 21:15:00'), -- Fire Dragons beat Storm Riders
(22, 83, 80, 7, 33, 1, '2024-07-06 20:30:00'), -- Cyber Wolves beat Thunder Hawks
(23, 75, 73, 8, 38, 1, '2024-07-06 21:45:00'), -- Storm Riders beat Fire Dragons
(24, 91, 87, 6, 28, 1, '2024-07-13 20:00:00'), -- Fire Dragons beat Thunder Hawks
(25, 78, 76, 8, 38, 1, '2024-07-13 21:15:00'), -- Storm Riders beat Cyber Wolves
(26, 84, 81, 5, 23, 1, '2024-07-20 20:30:00'), -- Thunder Hawks beat Fire Dragons
(27, 86, 84, 7, 33, 1, '2024-07-20 21:45:00'), -- Cyber Wolves beat Storm Riders
(28, 89, 85, 6, 28, 1, '2024-07-27 20:00:00'), -- Fire Dragons beat Cyber Wolves
(29, 82, 79, 5, 23, 1, '2024-07-27 21:15:00'), -- Thunder Hawks beat Storm Riders
(30, 87, 84, 5, 23, 1, '2024-08-03 20:30:00'), -- Thunder Hawks beat Cyber Wolves
(31, 90, 88, 6, 28, 1, '2024-08-03 21:45:00'), -- Fire Dragons beat Storm Riders
(32, 85, 83, 7, 33, 1, '2024-08-10 20:00:00'), -- Cyber Wolves beat Fire Dragons
(33, 81, 78, 8, 38, 1, '2024-08-10 21:15:00'), -- Storm Riders beat Thunder Hawks
-- Playoff results
(34, 92, 88, 5, 23, 1, '2024-08-17 20:30:00'), -- Thunder Hawks beat Storm Riders
(35, 86, 84, 6, 28, 1, '2024-08-17 21:45:00'), -- Fire Dragons beat Cyber Wolves
-- Championship game
(36, 94, 91, 5, 23, 1, '2024-08-24 21:00:00'); -- Thunder Hawks beat Fire Dragons (2024 Champions)