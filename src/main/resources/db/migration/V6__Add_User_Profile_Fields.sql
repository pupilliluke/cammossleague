-- Add new profile fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS years_played INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS team_history TEXT;

-- Add comments for documentation
COMMENT ON COLUMN users.years_played IS 'Number of years the user has played basketball';
COMMENT ON COLUMN users.bio IS 'User biography or personal description';
COMMENT ON COLUMN users.team_history IS 'History of teams the user has played for';