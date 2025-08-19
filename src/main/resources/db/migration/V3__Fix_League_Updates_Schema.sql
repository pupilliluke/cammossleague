-- Fix league_updates table to match entity fields
-- Add missing columns that exist in the LeagueUpdate entity

-- Add missing columns to league_updates table
ALTER TABLE league_updates 
ADD COLUMN update_type VARCHAR(30) DEFAULT 'NEWS' CHECK (update_type IN ('NEWS', 'ANNOUNCEMENT', 'SCHEDULE_CHANGE', 'PLAYOFF_UPDATE')),
ADD COLUMN is_pinned BOOLEAN DEFAULT false,
ADD COLUMN published_at TIMESTAMP,
ADD COLUMN author_user_id BIGINT,
ADD COLUMN image_url VARCHAR(500);

-- Add foreign key constraint for author_user_id
ALTER TABLE league_updates 
ADD CONSTRAINT fk_league_updates_author 
FOREIGN KEY (author_user_id) REFERENCES users(id) ON DELETE SET NULL;

-- Update existing records to have an author (use admin user if exists)
UPDATE league_updates 
SET author_user_id = (SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1)
WHERE author_user_id IS NULL;

-- Set published_at for already published records
UPDATE league_updates 
SET published_at = created_at 
WHERE is_published = true AND published_at IS NULL;