-- Recreate teams table and insert 2025 teams
-- Drop table if exists (in case it's partially corrupted)
DROP TABLE IF EXISTS teams CASCADE;

-- Recreate teams table
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    season_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    primary_color VARCHAR(7),
    secondary_color VARCHAR(7),
    captain_user_id INTEGER,
    coach_user_id INTEGER,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    points_for INTEGER DEFAULT 0,
    points_against INTEGER DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE,
    FOREIGN KEY (captain_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (coach_user_id) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE(season_id, name)
);

-- Add indexes for better performance
CREATE INDEX idx_teams_season_id ON teams(season_id);
CREATE INDEX idx_teams_captain_user_id ON teams(captain_user_id);
CREATE INDEX idx_teams_coach_user_id ON teams(coach_user_id);

-- Insert 2025 season teams
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

-- Insert 2024 season teams (historical data)
INSERT INTO teams (season_id, name, city, primary_color, secondary_color, captain_user_id, coach_user_id, wins, losses, points_for, points_against, description) VALUES 
(2, 'Thunder Hawks', 'Downtown', '#1E40AF', '#FFFFFF', 7, 10, 5, 3, 425, 380, '2024 Champions - dominated with strong offensive play.'),
(2, 'Fire Dragons', 'Eastside', '#DC2626', '#FBBF24', 12, 11, 4, 4, 389, 395, 'Consistent performers who made the playoffs.'),
(2, 'Cyber Wolves', 'Southside', '#059669', '#D1FAE5', 17, null, 3, 5, 356, 410, 'New franchise that joined in 2024 with hungry young talent.'),
(2, 'Storm Riders', 'Uptown', '#7C2D12', '#FED7AA', 2, null, 2, 6, 342, 435, 'Rebuilding team focused on developing chemistry.');

-- Show the results
SELECT 'Teams table recreated successfully!' as status;
SELECT season_id, name, city, wins, losses FROM teams ORDER BY season_id DESC, name;