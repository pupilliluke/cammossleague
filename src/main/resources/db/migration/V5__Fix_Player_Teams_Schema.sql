-- Fix player_teams table to match PlayerTeam entity
-- Add missing columns and modify existing structure

-- Remove old unique constraint that conflicts with new design
ALTER TABLE player_teams DROP CONSTRAINT IF EXISTS unique_active_player_team;

-- Add missing columns
ALTER TABLE player_teams 
ADD COLUMN status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('PENDING', 'ACTIVE', 'DECLINED', 'RELEASED')),
ADD COLUMN requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN approved_at TIMESTAMP,
ADD COLUMN approved_by_user_id BIGINT,
ADD COLUMN notes TEXT;

-- Add foreign key constraint for approved_by_user_id
ALTER TABLE player_teams 
ADD CONSTRAINT fk_player_teams_approved_by 
FOREIGN KEY (approved_by_user_id) REFERENCES users(id) ON DELETE SET NULL;

-- Update existing records
UPDATE player_teams 
SET status = CASE 
    WHEN is_active = true THEN 'ACTIVE'
    ELSE 'DECLINED'
END,
requested_at = created_at,
approved_at = CASE 
    WHEN is_active = true THEN created_at
    ELSE NULL
END;

-- Remove old columns that are no longer needed
ALTER TABLE player_teams 
DROP COLUMN IF EXISTS joined_date,
DROP COLUMN IF EXISTS left_date,
DROP COLUMN IF EXISTS is_active,
DROP COLUMN IF EXISTS role;