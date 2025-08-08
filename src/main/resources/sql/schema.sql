-- =============================================
-- CAM MOSS LEAGUE - DATABASE SCHEMA
-- =============================================

USE cammossleague;

-- Drop tables in correct order (foreign keys first)
DROP TABLE IF EXISTS game_results;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS player_teams;
DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS league_updates;
DROP TABLE IF EXISTS seasons;
DROP TABLE IF EXISTS users;

-- =============================================
-- USERS TABLE - Authentication & Profile
-- =============================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    firebase_uid VARCHAR(128) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role ENUM('PLAYER', 'COACH', 'ADMIN') DEFAULT 'PLAYER',
    is_free_agent BOOLEAN DEFAULT FALSE,
    profile_image_url VARCHAR(500),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_firebase_uid (firebase_uid),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_free_agent (is_free_agent)
);

-- =============================================
-- SEASONS TABLE - Season Management
-- =============================================
CREATE TABLE seasons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    season_type ENUM('SUMMER', 'FALL', 'WINTER', 'SPRING') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    registration_open_date DATE,
    registration_close_date DATE,
    playoff_start_date DATE,
    is_active BOOLEAN DEFAULT FALSE,
    is_registration_open BOOLEAN DEFAULT FALSE,
    max_teams INT DEFAULT 16,
    max_players_per_team INT DEFAULT 12,
    description TEXT,
    rules_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_year (year),
    INDEX idx_active (is_active),
    INDEX idx_dates (start_date, end_date)
);

-- =============================================
-- TEAMS TABLE - Team Information
-- =============================================
CREATE TABLE teams (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    season_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    logo_url VARCHAR(500),
    primary_color VARCHAR(7),
    secondary_color VARCHAR(7),
    captain_user_id BIGINT,
    coach_user_id BIGINT,
    wins INT DEFAULT 0,
    losses INT DEFAULT 0,
    points_for INT DEFAULT 0,
    points_against INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE,
    FOREIGN KEY (captain_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (coach_user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    UNIQUE KEY unique_team_season (season_id, name),
    INDEX idx_season (season_id),
    INDEX idx_active (is_active),
    INDEX idx_wins_losses (wins, losses)
);

-- =============================================
-- PLAYERS TABLE - Extended Player Info
-- =============================================
CREATE TABLE players (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    season_id BIGINT NOT NULL,
    jersey_number INT,
    position ENUM('PG', 'SG', 'SF', 'PF', 'C', 'UTIL') DEFAULT 'UTIL',
    height_inches INT,
    weight_lbs INT,
    years_experience INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    stats_games_played INT DEFAULT 0,
    stats_points INT DEFAULT 0,
    stats_rebounds INT DEFAULT 0,
    stats_assists INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_user_season (user_id, season_id),
    INDEX idx_user (user_id),
    INDEX idx_season (season_id),
    INDEX idx_position (position),
    INDEX idx_active (is_active)
);

-- =============================================
-- PLAYER_TEAMS TABLE - Team Roster Management
-- =============================================
CREATE TABLE player_teams (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    player_id BIGINT NOT NULL,
    team_id BIGINT NOT NULL,
    status ENUM('ACTIVE', 'PENDING', 'DECLINED', 'RELEASED') DEFAULT 'PENDING',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP NULL,
    approved_by_user_id BIGINT,
    notes TEXT,
    
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_player (player_id),
    INDEX idx_team (team_id),
    INDEX idx_status (status)
);

-- =============================================
-- GAMES TABLE - Game Schedule
-- =============================================
CREATE TABLE games (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    season_id BIGINT NOT NULL,
    home_team_id BIGINT NOT NULL,
    away_team_id BIGINT NOT NULL,
    game_date DATE NOT NULL,
    game_time TIME NOT NULL,
    location VARCHAR(255),
    court_number VARCHAR(10),
    game_type ENUM('REGULAR', 'PLAYOFF', 'CHAMPIONSHIP') DEFAULT 'REGULAR',
    week_number INT,
    is_completed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE,
    FOREIGN KEY (home_team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (away_team_id) REFERENCES teams(id) ON DELETE CASCADE,
    
    INDEX idx_season (season_id),
    INDEX idx_date (game_date, game_time),
    INDEX idx_teams (home_team_id, away_team_id),
    INDEX idx_week (week_number),
    INDEX idx_completed (is_completed),
    INDEX idx_game_type (game_type)
);

-- =============================================
-- GAME_RESULTS TABLE - Game Outcomes
-- =============================================
CREATE TABLE game_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    game_id BIGINT NOT NULL,
    home_team_score INT NOT NULL DEFAULT 0,
    away_team_score INT NOT NULL DEFAULT 0,
    winning_team_id BIGINT,
    overtime BOOLEAN DEFAULT FALSE,
    forfeit BOOLEAN DEFAULT FALSE,
    forfeit_team_id BIGINT,
    reported_by_user_id BIGINT,
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_by_user_id BIGINT,
    verified_at TIMESTAMP NULL,
    notes TEXT,
    
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (winning_team_id) REFERENCES teams(id) ON DELETE SET NULL,
    FOREIGN KEY (forfeit_team_id) REFERENCES teams(id) ON DELETE SET NULL,
    FOREIGN KEY (reported_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (verified_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    UNIQUE KEY unique_game_result (game_id),
    INDEX idx_winning_team (winning_team_id),
    INDEX idx_scores (home_team_score, away_team_score)
);

-- =============================================
-- LEAGUE_UPDATES TABLE - News & Announcements
-- =============================================
CREATE TABLE league_updates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    season_id BIGINT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    update_type ENUM('NEWS', 'ANNOUNCEMENT', 'SCHEDULE_CHANGE', 'PLAYOFF_UPDATE') DEFAULT 'NEWS',
    is_pinned BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP NULL,
    author_user_id BIGINT NOT NULL,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE SET NULL,
    FOREIGN KEY (author_user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_season (season_id),
    INDEX idx_published (is_published, published_at),
    INDEX idx_pinned (is_pinned),
    INDEX idx_type (update_type)
);
