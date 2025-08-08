-- =============================================
-- CAM MOSS LEAGUE - POSTGRESQL DATABASE SCHEMA
-- =============================================

-- Drop tables in correct order (foreign keys first)
DROP TABLE IF EXISTS game_results CASCADE;
DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS player_teams CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS league_updates CASCADE;
DROP TABLE IF EXISTS seasons CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop types if they exist
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS season_type CASCADE;
DROP TYPE IF EXISTS player_position CASCADE;
DROP TYPE IF EXISTS player_team_status CASCADE;
DROP TYPE IF EXISTS game_type CASCADE;
DROP TYPE IF EXISTS update_type CASCADE;

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('PLAYER', 'COACH', 'ADMIN');
CREATE TYPE season_type AS ENUM ('SUMMER', 'FALL', 'WINTER', 'SPRING');
CREATE TYPE player_position AS ENUM ('PG', 'SG', 'SF', 'PF', 'C', 'UTIL');
CREATE TYPE player_team_status AS ENUM ('ACTIVE', 'PENDING', 'DECLINED', 'RELEASED');
CREATE TYPE game_type AS ENUM ('REGULAR', 'PLAYOFF', 'CHAMPIONSHIP');
CREATE TYPE update_type AS ENUM ('NEWS', 'ANNOUNCEMENT', 'SCHEDULE_CHANGE', 'PLAYOFF_UPDATE');

-- =============================================
-- USERS TABLE - Authentication & Profile
-- =============================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    firebase_uid VARCHAR(128) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role user_role DEFAULT 'PLAYER',
    is_free_agent BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    profile_image_url VARCHAR(500),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_free_agent ON users(is_free_agent);

-- =============================================
-- SEASONS TABLE - Season Management
-- =============================================
CREATE TABLE seasons (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    season_type season_type NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    registration_open_date DATE,
    registration_close_date DATE,
    playoff_start_date DATE,
    is_active BOOLEAN DEFAULT FALSE,
    is_registration_open BOOLEAN DEFAULT FALSE,
    max_teams INTEGER DEFAULT 16,
    max_players_per_team INTEGER DEFAULT 12,
    description TEXT,
    rules_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_seasons_year ON seasons(year);
CREATE INDEX idx_seasons_active ON seasons(is_active);
CREATE INDEX idx_seasons_dates ON seasons(start_date, end_date);

-- =============================================
-- TEAMS TABLE - Team Information
-- =============================================
CREATE TABLE teams (
    id BIGSERIAL PRIMARY KEY,
    season_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    logo_url VARCHAR(500),
    primary_color VARCHAR(7),
    secondary_color VARCHAR(7),
    captain_user_id BIGINT,
    coach_user_id BIGINT,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    points_for INTEGER DEFAULT 0,
    points_against INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_playoff_eligible BOOLEAN DEFAULT TRUE,
    max_players INTEGER DEFAULT 12,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_teams_season FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE,
    CONSTRAINT fk_teams_captain FOREIGN KEY (captain_user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_teams_coach FOREIGN KEY (coach_user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT unique_team_season UNIQUE(season_id, name)
);

-- Create indexes
CREATE INDEX idx_teams_season ON teams(season_id);
CREATE INDEX idx_teams_active ON teams(is_active);
CREATE INDEX idx_teams_wins_losses ON teams(wins, losses);

-- =============================================
-- PLAYERS TABLE - Extended Player Info
-- =============================================
CREATE TABLE players (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    season_id BIGINT NOT NULL,
    jersey_number INTEGER,
    position player_position DEFAULT 'UTIL',
    height_inches INTEGER,
    weight_lbs INTEGER,
    years_experience INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    stats_games_played INTEGER DEFAULT 0,
    stats_points INTEGER DEFAULT 0,
    stats_rebounds INTEGER DEFAULT 0,
    stats_assists INTEGER DEFAULT 0,
    stats_steals INTEGER DEFAULT 0,
    stats_blocks INTEGER DEFAULT 0,
    stats_fouls INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_players_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_players_season FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_season UNIQUE(user_id, season_id)
);

-- Create indexes
CREATE INDEX idx_players_user ON players(user_id);
CREATE INDEX idx_players_season ON players(season_id);
CREATE INDEX idx_players_position ON players(position);
CREATE INDEX idx_players_active ON players(is_active);

-- =============================================
-- PLAYER_TEAMS TABLE - Team Roster Management
-- =============================================
CREATE TABLE player_teams (
    id BIGSERIAL PRIMARY KEY,
    player_id BIGINT NOT NULL,
    team_id BIGINT NOT NULL,
    status player_team_status DEFAULT 'PENDING',
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP WITH TIME ZONE NULL,
    approved_by_user_id BIGINT,
    notes TEXT,
    
    CONSTRAINT fk_player_teams_player FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    CONSTRAINT fk_player_teams_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    CONSTRAINT fk_player_teams_approver FOREIGN KEY (approved_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX idx_player_teams_player ON player_teams(player_id);
CREATE INDEX idx_player_teams_team ON player_teams(team_id);
CREATE INDEX idx_player_teams_status ON player_teams(status);

-- =============================================
-- GAMES TABLE - Game Schedule
-- =============================================
CREATE TABLE games (
    id BIGSERIAL PRIMARY KEY,
    season_id BIGINT NOT NULL,
    home_team_id BIGINT NOT NULL,
    away_team_id BIGINT NOT NULL,
    game_date DATE NOT NULL,
    game_time TIME NOT NULL,
    location VARCHAR(255),
    court_number VARCHAR(10),
    game_type game_type DEFAULT 'REGULAR',
    week_number INTEGER,
    is_completed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_games_season FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE,
    CONSTRAINT fk_games_home_team FOREIGN KEY (home_team_id) REFERENCES teams(id) ON DELETE CASCADE,
    CONSTRAINT fk_games_away_team FOREIGN KEY (away_team_id) REFERENCES teams(id) ON DELETE CASCADE,
    CONSTRAINT chk_different_teams CHECK (home_team_id != away_team_id)
);

-- Create indexes
CREATE INDEX idx_games_season ON games(season_id);
CREATE INDEX idx_games_date ON games(game_date, game_time);
CREATE INDEX idx_games_teams ON games(home_team_id, away_team_id);
CREATE INDEX idx_games_week ON games(week_number);
CREATE INDEX idx_games_completed ON games(is_completed);
CREATE INDEX idx_games_type ON games(game_type);

-- =============================================
-- GAME_RESULTS TABLE - Game Outcomes
-- =============================================
CREATE TABLE game_results (
    id BIGSERIAL PRIMARY KEY,
    game_id BIGINT NOT NULL,
    home_team_score INTEGER NOT NULL DEFAULT 0,
    away_team_score INTEGER NOT NULL DEFAULT 0,
    winning_team_id BIGINT,
    overtime BOOLEAN DEFAULT FALSE,
    forfeit BOOLEAN DEFAULT FALSE,
    forfeit_team_id BIGINT,
    reported_by_user_id BIGINT,
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    verified_by_user_id BIGINT,
    verified_at TIMESTAMP WITH TIME ZONE NULL,
    notes TEXT,
    
    CONSTRAINT fk_game_results_game FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    CONSTRAINT fk_game_results_winner FOREIGN KEY (winning_team_id) REFERENCES teams(id) ON DELETE SET NULL,
    CONSTRAINT fk_game_results_forfeit FOREIGN KEY (forfeit_team_id) REFERENCES teams(id) ON DELETE SET NULL,
    CONSTRAINT fk_game_results_reporter FOREIGN KEY (reported_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_game_results_verifier FOREIGN KEY (verified_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT unique_game_result UNIQUE(game_id)
);

-- Create indexes
CREATE INDEX idx_game_results_winning_team ON game_results(winning_team_id);
CREATE INDEX idx_game_results_scores ON game_results(home_team_score, away_team_score);

-- =============================================
-- LEAGUE_UPDATES TABLE - News & Announcements
-- =============================================
CREATE TABLE league_updates (
    id BIGSERIAL PRIMARY KEY,
    season_id BIGINT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    update_type update_type DEFAULT 'NEWS',
    is_pinned BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE NULL,
    author_user_id BIGINT NOT NULL,
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_league_updates_season FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE SET NULL,
    CONSTRAINT fk_league_updates_author FOREIGN KEY (author_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_league_updates_season ON league_updates(season_id);
CREATE INDEX idx_league_updates_published ON league_updates(is_published, published_at);
CREATE INDEX idx_league_updates_pinned ON league_updates(is_pinned);
CREATE INDEX idx_league_updates_type ON league_updates(update_type);

-- =============================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =============================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_seasons_updated_at BEFORE UPDATE ON seasons 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON games 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_league_updates_updated_at BEFORE UPDATE ON league_updates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- TEAM RECORD UPDATE TRIGGER
-- =============================================

-- Function to update team records when game results are added/updated
CREATE OR REPLACE FUNCTION update_team_records()
RETURNS TRIGGER AS $$
BEGIN
    -- Update team records based on game results
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        -- Update winning team
        IF NEW.winning_team_id IS NOT NULL THEN
            UPDATE teams SET 
                wins = wins + 1,
                points_for = points_for + 
                    CASE 
                        WHEN NEW.winning_team_id = (SELECT home_team_id FROM games WHERE id = NEW.game_id) 
                        THEN NEW.home_team_score 
                        ELSE NEW.away_team_score 
                    END,
                points_against = points_against + 
                    CASE 
                        WHEN NEW.winning_team_id = (SELECT home_team_id FROM games WHERE id = NEW.game_id) 
                        THEN NEW.away_team_score 
                        ELSE NEW.home_team_score 
                    END
            WHERE id = NEW.winning_team_id;
            
            -- Update losing team
            UPDATE teams SET 
                losses = losses + 1,
                points_for = points_for + 
                    CASE 
                        WHEN NEW.winning_team_id != (SELECT home_team_id FROM games WHERE id = NEW.game_id) 
                        THEN NEW.home_team_score 
                        ELSE NEW.away_team_score 
                    END,
                points_against = points_against + 
                    CASE 
                        WHEN NEW.winning_team_id != (SELECT home_team_id FROM games WHERE id = NEW.game_id) 
                        THEN NEW.away_team_score 
                        ELSE NEW.home_team_score 
                    END
            WHERE id = (
                SELECT CASE 
                    WHEN NEW.winning_team_id = home_team_id THEN away_team_id 
                    ELSE home_team_id 
                END 
                FROM games WHERE id = NEW.game_id
            );
        END IF;
        
        -- Mark game as completed
        UPDATE games SET is_completed = true WHERE id = NEW.game_id;
        
        RETURN NEW;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for team record updates
CREATE TRIGGER trigger_update_team_records 
    AFTER INSERT OR UPDATE ON game_results
    FOR EACH ROW EXECUTE FUNCTION update_team_records();