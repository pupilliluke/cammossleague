-- Bring the players table in line with the Player entity.
-- V1 created `height VARCHAR(10)` and `weight INTEGER`, but the entity has
-- `height_inches INTEGER` and `weight_lbs INTEGER`. Local dev hid the drift
-- because ddl-auto=update silently added the new columns; production
-- (ddl-auto=validate) fails Hibernate schema validation.

ALTER TABLE players DROP COLUMN IF EXISTS height;
ALTER TABLE players DROP COLUMN IF EXISTS weight;

ALTER TABLE players ADD COLUMN IF NOT EXISTS height_inches INTEGER;
ALTER TABLE players ADD COLUMN IF NOT EXISTS weight_lbs INTEGER;
