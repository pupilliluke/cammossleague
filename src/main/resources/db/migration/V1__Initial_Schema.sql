-- Initial schema migration
-- Creates all core tables for basketball league management

CREATE TABLE seasons (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    season_type VARCHAR(20) NOT NULL CHECK (season_type IN ('SUMMER', 'FALL', 'WINTER', 'SPRING')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    registration_open_date DATE,
    registration_close_date DATE,
    playoff_start_date DATE,
    is_active BOOLEAN DEFAULT false,
    is_registration_open BOOLEAN DEFAULT false,
    max_teams INTEGER DEFAULT 16,
    max_players_per_team INTEGER DEFAULT 12,
    description TEXT,
    rules_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_season_year UNIQUE(name, year)
);

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    firebase_uid VARCHAR(128) UNIQUE,
    username VARCHAR(50) UNIQUE,
    password_hash VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'PLAYER' CHECK (role IN ('PLAYER', 'COACH', 'ADMIN')),
    is_free_agent BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    profile_image_url VARCHAR(500),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE teams (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    season_id BIGINT NOT NULL,
    captain_id BIGINT,
    coach_id BIGINT,
    division VARCHAR(50),
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    points_for INTEGER DEFAULT 0,
    points_against INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    team_color VARCHAR(20),
    logo_url VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE,
    FOREIGN KEY (captain_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (coach_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT unique_team_season UNIQUE(name, season_id)
);

CREATE TABLE players (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    season_id BIGINT NOT NULL,
    jersey_number INTEGER,
    position VARCHAR(20),
    height VARCHAR(10),
    weight INTEGER,
    years_experience INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    stats_points INTEGER DEFAULT 0,
    stats_rebounds INTEGER DEFAULT 0,
    stats_assists INTEGER DEFAULT 0,
    stats_games_played INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE,
    CONSTRAINT unique_player_season UNIQUE(user_id, season_id)
);

CREATE TABLE player_teams (
    id BIGSERIAL PRIMARY KEY,
    player_id BIGINT NOT NULL,
    team_id BIGINT NOT NULL,
    joined_date DATE DEFAULT CURRENT_DATE,
    left_date DATE,
    is_active BOOLEAN DEFAULT true,
    role VARCHAR(20) DEFAULT 'PLAYER' CHECK (role IN ('PLAYER', 'CAPTAIN', 'ASSISTANT_CAPTAIN')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    CONSTRAINT unique_active_player_team UNIQUE(player_id, team_id, is_active)
);

CREATE TABLE games (
    id BIGSERIAL PRIMARY KEY,
    season_id BIGINT NOT NULL,
    home_team_id BIGINT NOT NULL,
    away_team_id BIGINT NOT NULL,
    game_date DATE NOT NULL,
    game_time TIME NOT NULL,
    location VARCHAR(200),
    court_number VARCHAR(10),
    game_type VARCHAR(20) DEFAULT 'REGULAR' CHECK (game_type IN ('REGULAR', 'PLAYOFF', 'CHAMPIONSHIP')),
    week_number INTEGER,
    is_completed BOOLEAN DEFAULT false,
    home_score INTEGER,
    away_score INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE,
    FOREIGN KEY (home_team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (away_team_id) REFERENCES teams(id) ON DELETE CASCADE,
    CONSTRAINT different_teams CHECK (home_team_id != away_team_id)
);

CREATE TABLE playoff_brackets (
    id BIGSERIAL PRIMARY KEY,
    season_id BIGINT NOT NULL,
    bracket_name VARCHAR(100) NOT NULL,
    bracket_type VARCHAR(30) DEFAULT 'SINGLE_ELIMINATION' CHECK (bracket_type IN ('SINGLE_ELIMINATION', 'DOUBLE_ELIMINATION')),
    max_teams INTEGER DEFAULT 8,
    current_round INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT false,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE
);

CREATE TABLE playoff_matches (
    id BIGSERIAL PRIMARY KEY,
    bracket_id BIGINT NOT NULL,
    game_id BIGINT,
    team1_id BIGINT,
    team2_id BIGINT,
    winner_id BIGINT,
    round_number INTEGER NOT NULL,
    match_number INTEGER NOT NULL,
    position_in_round INTEGER NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bracket_id) REFERENCES playoff_brackets(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE SET NULL,
    FOREIGN KEY (team1_id) REFERENCES teams(id) ON DELETE SET NULL,
    FOREIGN KEY (team2_id) REFERENCES teams(id) ON DELETE SET NULL,
    FOREIGN KEY (winner_id) REFERENCES teams(id) ON DELETE SET NULL
);

CREATE TABLE form_submissions (
    id BIGSERIAL PRIMARY KEY,
    form_type VARCHAR(30) NOT NULL CHECK (form_type IN ('COMPLAINT', 'TEAM_SIGNUP', 'PLAYER_REGISTRATION', 'GENERAL_INQUIRY')),
    submitter_name VARCHAR(100) NOT NULL,
    submitter_email VARCHAR(255) NOT NULL,
    submitter_phone VARCHAR(20),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'RESOLVED', 'CLOSED')),
    admin_notes TEXT,
    assigned_to_user_id BIGINT,
    season_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    FOREIGN KEY (assigned_to_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE SET NULL
);

-- Legacy tables support
CREATE TABLE leagues (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE league_updates (
    id BIGSERIAL PRIMARY KEY,
    season_id BIGINT,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100),
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE SET NULL
);

CREATE TABLE schedules (
    id BIGSERIAL PRIMARY KEY,
    season_id BIGINT NOT NULL,
    week_number INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_seasons_active ON seasons(is_active);
CREATE INDEX idx_seasons_year ON seasons(year DESC);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_teams_season ON teams(season_id);
CREATE INDEX idx_players_season ON players(season_id);
CREATE INDEX idx_players_user ON players(user_id);
CREATE INDEX idx_games_season ON games(season_id);
CREATE INDEX idx_games_date ON games(game_date);
CREATE INDEX idx_games_teams ON games(home_team_id, away_team_id);
CREATE INDEX idx_form_submissions_status ON form_submissions(status);
CREATE INDEX idx_form_submissions_type ON form_submissions(form_type);
CREATE INDEX idx_playoff_matches_bracket ON playoff_matches(bracket_id);

-- Update triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_seasons_updated_at BEFORE UPDATE ON seasons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_player_teams_updated_at BEFORE UPDATE ON player_teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON games FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_playoff_brackets_updated_at BEFORE UPDATE ON playoff_brackets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_playoff_matches_updated_at BEFORE UPDATE ON playoff_matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_form_submissions_updated_at BEFORE UPDATE ON form_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();