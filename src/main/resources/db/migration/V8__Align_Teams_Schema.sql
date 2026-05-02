-- Bring teams table in line with Team entity.
-- V1 created the table with captain_id/coach_id and no city/primary_color/
-- secondary_color, but the entity has captain_user_id, coach_user_id, city,
-- primaryColor, secondaryColor. ddl-auto=update masked this locally.

ALTER TABLE teams ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS primary_color VARCHAR(7);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS secondary_color VARCHAR(7);

-- Rename FK columns to match @JoinColumn(name = ...) on Team. Guarded so the
-- migration is a no-op on environments where the rename has already happened
-- (e.g. local dev, where Hibernate may already have added the new names).
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_name = 'teams' AND column_name = 'captain_id')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_name = 'teams' AND column_name = 'captain_user_id') THEN
        ALTER TABLE teams RENAME COLUMN captain_id TO captain_user_id;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_name = 'teams' AND column_name = 'coach_id')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_name = 'teams' AND column_name = 'coach_user_id') THEN
        ALTER TABLE teams RENAME COLUMN coach_id TO coach_user_id;
    END IF;
END $$;

-- Belt-and-suspenders: make sure the new columns exist regardless of starting state.
ALTER TABLE teams ADD COLUMN IF NOT EXISTS captain_user_id BIGINT;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS coach_user_id BIGINT;
