-- =============================================
-- CAM MOSS LEAGUE - SAMPLE DATA
-- =============================================

-- Insert initial admin user
INSERT INTO users (firebase_uid, email, first_name, last_name, role, is_active) VALUES 
('admin-uid-12345', 'admin@cammossleague.com', 'League', 'Administrator', 'ADMIN', true);

-- Insert sample season
INSERT INTO seasons (name, year, season_type, start_date, end_date, registration_open_date, registration_close_date, playoff_start_date, is_active, is_registration_open, description) VALUES 
('Summer 2025 League', 2025, 'SUMMER', '2025-06-01', '2025-08-31', '2025-05-01', '2025-05-25', '2025-08-15', true, true, 'The premier summer basketball league featuring competitive play and community spirit.');

-- Get the season ID for subsequent inserts (PostgreSQL approach)
-- Note: In real applications, you'd handle this differently or use sequences

-- Insert sample users (players and coaches)
INSERT INTO users (firebase_uid, email, first_name, last_name, phone, role, is_free_agent, profile_image_url) VALUES 
('player1-uid', 'john.smith@email.com', 'John', 'Smith', '555-0101', 'PLAYER', false, null),
('player2-uid', 'mike.johnson@email.com', 'Mike', 'Johnson', '555-0102', 'PLAYER', false, null),
('player3-uid', 'david.brown@email.com', 'David', 'Brown', '555-0103', 'PLAYER', false, null),
('player4-uid', 'chris.davis@email.com', 'Chris', 'Davis', '555-0104', 'PLAYER', false, null),
('player5-uid', 'james.wilson@email.com', 'James', 'Wilson', '555-0105', 'PLAYER', false, null),
('player6-uid', 'robert.garcia@email.com', 'Robert', 'Garcia', '555-0106', 'PLAYER', false, null),
('player7-uid', 'michael.martinez@email.com', 'Michael', 'Martinez', '555-0107', 'PLAYER', false, null),
('player8-uid', 'william.anderson@email.com', 'William', 'Anderson', '555-0108', 'PLAYER', false, null),
('coach1-uid', 'coach.thompson@email.com', 'Coach', 'Thompson', '555-0201', 'COACH', false, null),
('coach2-uid', 'coach.williams@email.com', 'Coach', 'Williams', '555-0202', 'COACH', false, null),
('freeagent1-uid', 'alex.rodriguez@email.com', 'Alex', 'Rodriguez', '555-0301', 'PLAYER', true, null),
('freeagent2-uid', 'sarah.wilson@email.com', 'Sarah', 'Wilson', '555-0302', 'PLAYER', true, null);

-- Insert sample teams (using season_id = 1)
INSERT INTO teams (season_id, name, city, primary_color, secondary_color, captain_user_id, coach_user_id, wins, losses, points_for, points_against, description) VALUES 
(1, 'Thunder Hawks', 'Downtown', '#1E40AF', '#FFFFFF', 2, 10, 3, 1, 312, 289, 'A powerhouse team known for fast breaks and defensive intensity.'),
(1, 'Fire Dragons', 'Eastside', '#DC2626', '#FBBF24', 3, 11, 2, 2, 298, 305, 'Young and energetic squad with explosive offensive capabilities.'),
(1, 'Lightning Bolts', 'Westside', '#7C3AED', '#F3E8FF', 4, null, 2, 2, 285, 290, 'Strategic team that excels in half-court sets and team chemistry.'),
(1, 'Steel Warriors', 'Northside', '#374151', '#9CA3AF', 5, null, 1, 3, 275, 315, 'Defensive-minded team that grinds out tough victories.');

-- Insert sample players for the season
INSERT INTO players (user_id, season_id, jersey_number, position, height_inches, weight_lbs, years_experience, stats_games_played, stats_points, stats_rebounds, stats_assists) VALUES 
(2, 1, 23, 'SF', 78, 195, 3, 4, 72, 28, 16),
(3, 1, 15, 'PG', 72, 175, 2, 4, 56, 16, 32),
(4, 1, 8, 'C', 82, 220, 4, 4, 48, 36, 8),
(5, 1, 12, 'SG', 75, 185, 1, 4, 64, 20, 12),
(6, 1, 7, 'PF', 80, 210, 2, 4, 52, 32, 10),
(7, 1, 21, 'PG', 70, 165, 1, 4, 44, 12, 28),
(8, 1, 33, 'SF', 77, 190, 3, 4, 60, 24, 18),
(9, 1, 42, 'C', 83, 230, 5, 4, 40, 40, 6),
(12, 1, null, 'UTIL', 74, 180, 0, 0, 0, 0, 0),
(13, 1, null, 'UTIL', 68, 155, 1, 0, 0, 0, 0);

-- Insert player-team relationships
INSERT INTO player_teams (player_id, team_id, status, approved_at, approved_by_user_id) VALUES 
(1, 1, 'ACTIVE', CURRENT_TIMESTAMP, 1),
(2, 1, 'ACTIVE', CURRENT_TIMESTAMP, 1),
(3, 2, 'ACTIVE', CURRENT_TIMESTAMP, 1),
(4, 2, 'ACTIVE', CURRENT_TIMESTAMP, 1),
(5, 3, 'ACTIVE', CURRENT_TIMESTAMP, 1),
(6, 3, 'ACTIVE', CURRENT_TIMESTAMP, 1),
(7, 4, 'ACTIVE', CURRENT_TIMESTAMP, 1),
(8, 4, 'ACTIVE', CURRENT_TIMESTAMP, 1);

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