-- =============================================
-- CAM MOSS LEAGUE - SAMPLE DATA
-- =============================================

-- Insert initial admin user (Firebase UID will be updated in production)
INSERT INTO users (firebase_uid, email, first_name, last_name, role) VALUES
('temp-admin-uid-001', 'admin@cammossleague.com', 'League', 'Admin', 'ADMIN');

-- Insert current active season
INSERT INTO seasons (name, year, season_type, start_date, end_date, registration_open_date, registration_close_date, playoff_start_date, is_active, is_registration_open, description) VALUES
('Summer 2025', 2025, 'SUMMER', '2025-06-01', '2025-08-31', '2025-04-01', '2025-05-15', '2025-08-01', TRUE, TRUE, 'Summer Basketball League 2025 - Recreational basketball for all skill levels');

-- Insert sample teams
INSERT INTO teams (season_id, name, city, primary_color, secondary_color, wins, losses) VALUES
(1, 'Thunder Hawks', 'Downtown', '#1E40AF', '#F59E0B', 3, 1),
(1, 'Fire Dragons', 'Westside', '#DC2626', '#000000', 2, 2),
(1, 'Lightning Bolts', 'Eastport', '#7C3AED', '#FFFFFF', 4, 0),
(1, 'Steel Warriors', 'Northfield', '#374151', '#EF4444', 1, 3),
(1, 'Green Hornets', 'Riverside', '#059669', '#FCD34D', 2, 2),
(1, 'Blue Sharks', 'Oceanview', '#0EA5E9', '#1F2937', 3, 1);

-- Insert sample users/players
INSERT INTO users (firebase_uid, email, first_name, last_name, role, phone, is_free_agent) VALUES
('temp-uid-001', 'john.smith@email.com', 'John', 'Smith', 'PLAYER', '555-0101', FALSE),
('temp-uid-002', 'mike.johnson@email.com', 'Mike', 'Johnson', 'PLAYER', '555-0102', FALSE),
('temp-uid-003', 'david.wilson@email.com', 'David', 'Wilson', 'COACH', '555-0103', FALSE),
('temp-uid-004', 'chris.brown@email.com', 'Chris', 'Brown', 'PLAYER', '555-0104', FALSE),
('temp-uid-005', 'alex.davis@email.com', 'Alex', 'Davis', 'PLAYER', '555-0105', TRUE),
('temp-uid-006', 'sam.miller@email.com', 'Sam', 'Miller', 'PLAYER', '555-0106', TRUE),
('temp-uid-007', 'jordan.wilson@email.com', 'Jordan', 'Wilson', 'PLAYER', '555-0107', FALSE),
('temp-uid-008', 'taylor.moore@email.com', 'Taylor', 'Moore', 'PLAYER', '555-0108', FALSE);

-- Insert players for current season
INSERT INTO players (user_id, season_id, jersey_number, position, height_inches, weight_lbs, years_experience) VALUES
(2, 1, 23, 'PG', 72, 180, 3),
(3, 1, 15, 'SG', 74, 190, 5),
(4, 1, 32, 'C', 78, 220, 2),
(5, 1, 7, 'SF', 75, 200, 4),
(6, 1, NULL, 'PF', 76, 210, 1),
(7, 1, NULL, 'PG', 70, 165, 1),
(8, 1, 44, 'SF', 73, 185, 2),
(9, 1, 12, 'SG', 71, 175, 3);

-- Assign team captains and coaches
UPDATE teams SET captain_user_id = 2 WHERE id = 1;
UPDATE teams SET captain_user_id = 3 WHERE id = 2;
UPDATE teams SET coach_user_id = 4 WHERE id = 2;
UPDATE teams SET captain_user_id = 5 WHERE id = 3;

-- Insert player-team relationships
INSERT INTO player_teams (player_id, team_id, status, approved_at, approved_by_user_id) VALUES
(1, 1, 'ACTIVE', NOW(), 2),
(2, 1, 'ACTIVE', NOW(), 2),
(3, 2, 'ACTIVE', NOW(), 3),
(4, 2, 'ACTIVE', NOW(), 3),
(5, 3, 'ACTIVE', NOW(), 5),
(6, 4, 'ACTIVE', NOW(), 1),
(7, 5, 'ACTIVE', NOW(), 1),
(8, 6, 'ACTIVE', NOW(), 1);

-- Insert sample games for current season
INSERT INTO games (season_id, home_team_id, away_team_id, game_date, game_time, location, court_number, week_number, game_type) VALUES
-- Week 1
(1, 1, 2, '2025-06-07', '18:00:00', 'Community Center', 'Court 1', 1, 'REGULAR'),
(1, 3, 4, '2025-06-07', '19:00:00', 'Community Center', 'Court 2', 1, 'REGULAR'),
(1, 5, 6, '2025-06-07', '20:00:00', 'Community Center', 'Court 1', 1, 'REGULAR'),
-- Week 2  
(1, 2, 3, '2025-06-14', '18:00:00', 'Community Center', 'Court 1', 2, 'REGULAR'),
(1, 4, 5, '2025-06-14', '19:00:00', 'Community Center', 'Court 2', 2, 'REGULAR'),
(1, 6, 1, '2025-06-14', '20:00:00', 'Community Center', 'Court 1', 2, 'REGULAR'),
-- Week 3
(1, 1, 3, '2025-06-21', '18:00:00', 'Community Center', 'Court 1', 3, 'REGULAR'),
(1, 2, 4, '2025-06-21', '19:00:00', 'Community Center', 'Court 2', 3, 'REGULAR'),
(1, 5, 6, '2025-06-21', '20:00:00', 'Community Center', 'Court 1', 3, 'REGULAR');

-- Insert some game results for completed games
INSERT INTO game_results (game_id, home_team_score, away_team_score, winning_team_id, reported_by_user_id, verified_by_user_id, verified_at) VALUES
(1, 78, 72, 1, 2, 1, NOW()),
(2, 65, 82, 4, 4, 1, NOW()),
(3, 91, 85, 5, 1, 1, NOW()),
(4, 73, 79, 3, 3, 1, NOW());

-- Insert sample league updates
INSERT INTO league_updates (season_id, title, content, update_type, is_published, published_at, author_user_id, is_pinned) VALUES
(1, 'Welcome to Summer 2025 Season!', 'Get ready for another exciting season of basketball! Registration is now open and games start June 7th. Check out the schedule and get your teams ready!', 'ANNOUNCEMENT', TRUE, NOW(), 1, TRUE),
(1, 'New Court Rules Update', 'Please note the updated court rules for this season. No dunking allowed during warm-ups, and all players must wear non-marking shoes.', 'NEWS', TRUE, NOW(), 1, FALSE),
(1, 'Week 2 Schedule Change', 'Due to facility maintenance, all Week 2 games have been moved to Saturday instead of Friday. Please check the updated schedule.', 'SCHEDULE_CHANGE', TRUE, NOW(), 1, TRUE),
(1, 'Playoff Format Announced', 'The top 4 teams will make playoffs starting August 1st. Single elimination format with championship game on August 15th.', 'PLAYOFF_UPDATE', TRUE, NOW(), 1, FALSE);
    