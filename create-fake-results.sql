-- Create fake game results matching team records
-- Records: Yinzers (5-0), Plum's Finest (4-1), Beltzboys (3-2), Diddy's Lawyers (3-2), PA Lakers (3-2), Treyway (3-2), Diddy Party (2-3), PGH Elite (2-3), Indiana Bones & the Womb Raiders (1-4), Nate & Friends (1-4), Redeem Team (1-4)

-- Clear existing results
DELETE FROM game_results WHERE game_id IN (SELECT id FROM games WHERE season_id = 1);

-- Mark some games as completed and add results
-- I'll mark the first 3 weeks as completed (15 games) to match team records

-- Week 1 Results (July 13)
UPDATE games SET is_completed = true WHERE season_id = 1 AND week_number = 1;

INSERT INTO game_results (game_id, home_team_score, away_team_score, winning_team_id, reported_by_user_id, verified_by_user_id, verified_at) 
SELECT 
    g.id,
    CASE 
        -- Yinzers vs Plum's Finest - Yinzers win (Yinzers 1-0, Plum's Finest 0-1)
        WHEN g.home_team_id = 1 AND g.away_team_id = 2 THEN 85
        -- Treyway vs Diddy's Lawyers - Treyway win (Treyway 1-0, Diddy's Lawyers 0-1)
        WHEN g.home_team_id = 3 AND g.away_team_id = 4 THEN 78
        -- Beltzboys vs PA Lakers - Beltzboys win (Beltzboys 1-0, PA Lakers 0-1)
        WHEN g.home_team_id = 5 AND g.away_team_id = 6 THEN 82
        -- PGH Elite vs Diddy Party - PGH Elite win (PGH Elite 1-0, Diddy Party 0-1)
        WHEN g.home_team_id = 7 AND g.away_team_id = 8 THEN 79
        -- Redeem Team vs Nate & Friends - Nate & Friends win (Nate & Friends 1-0, Redeem Team 0-1)
        WHEN g.home_team_id = 9 AND g.away_team_id = 10 THEN 75
    END as home_score,
    CASE 
        WHEN g.home_team_id = 1 AND g.away_team_id = 2 THEN 72
        WHEN g.home_team_id = 3 AND g.away_team_id = 4 THEN 74
        WHEN g.home_team_id = 5 AND g.away_team_id = 6 THEN 80
        WHEN g.home_team_id = 7 AND g.away_team_id = 8 THEN 77
        WHEN g.home_team_id = 9 AND g.away_team_id = 10 THEN 81
    END as away_score,
    CASE 
        WHEN g.home_team_id = 1 AND g.away_team_id = 2 THEN 1  -- Yinzers win
        WHEN g.home_team_id = 3 AND g.away_team_id = 4 THEN 3  -- Treyway win
        WHEN g.home_team_id = 5 AND g.away_team_id = 6 THEN 5  -- Beltzboys win
        WHEN g.home_team_id = 7 AND g.away_team_id = 8 THEN 7  -- PGH Elite win
        WHEN g.home_team_id = 9 AND g.away_team_id = 10 THEN 10 -- Nate & Friends win
    END as winning_team_id,
    1 as reported_by_user_id,
    1 as verified_by_user_id,
    CURRENT_TIMESTAMP as verified_at
FROM games g
WHERE g.season_id = 1 AND g.week_number = 1;

-- Week 2 Results (July 20)
UPDATE games SET is_completed = true WHERE season_id = 1 AND week_number = 2;

INSERT INTO game_results (game_id, home_team_score, away_team_score, winning_team_id, reported_by_user_id, verified_by_user_id, verified_at) 
SELECT 
    g.id,
    CASE 
        -- Plum's Finest vs Treyway - Plum's Finest win (Plum's Finest 1-1, Treyway 1-1)
        WHEN g.home_team_id = 2 AND g.away_team_id = 3 THEN 88
        -- Diddy's Lawyers vs Beltzboys - Diddy's Lawyers win (Diddy's Lawyers 1-1, Beltzboys 1-1)
        WHEN g.home_team_id = 4 AND g.away_team_id = 5 THEN 83
        -- PA Lakers vs PGH Elite - PA Lakers win (PA Lakers 1-1, PGH Elite 1-1)
        WHEN g.home_team_id = 6 AND g.away_team_id = 7 THEN 76
        -- Diddy Party vs Redeem Team - Diddy Party win (Diddy Party 1-1, Redeem Team 0-2)
        WHEN g.home_team_id = 8 AND g.away_team_id = 9 THEN 84
        -- Nate & Friends vs Indiana Bones - Indiana Bones win (Indiana Bones 1-0, Nate & Friends 1-1)
        WHEN g.home_team_id = 10 AND g.away_team_id = 11 THEN 77
    END as home_score,
    CASE 
        WHEN g.home_team_id = 2 AND g.away_team_id = 3 THEN 85
        WHEN g.home_team_id = 4 AND g.away_team_id = 5 THEN 81
        WHEN g.home_team_id = 6 AND g.away_team_id = 7 THEN 73
        WHEN g.home_team_id = 8 AND g.away_team_id = 9 THEN 82
        WHEN g.home_team_id = 10 AND g.away_team_id = 11 THEN 79
    END as away_score,
    CASE 
        WHEN g.home_team_id = 2 AND g.away_team_id = 3 THEN 2  -- Plum's Finest win
        WHEN g.home_team_id = 4 AND g.away_team_id = 5 THEN 4  -- Diddy's Lawyers win
        WHEN g.home_team_id = 6 AND g.away_team_id = 7 THEN 6  -- PA Lakers win
        WHEN g.home_team_id = 8 AND g.away_team_id = 9 THEN 8  -- Diddy Party win
        WHEN g.home_team_id = 10 AND g.away_team_id = 11 THEN 11 -- Indiana Bones win
    END as winning_team_id,
    1 as reported_by_user_id,
    1 as verified_by_user_id,
    CURRENT_TIMESTAMP as verified_at
FROM games g
WHERE g.season_id = 1 AND g.week_number = 2;

-- Week 3 Results (July 27)
UPDATE games SET is_completed = true WHERE season_id = 1 AND week_number = 3;

INSERT INTO game_results (game_id, home_team_score, away_team_score, winning_team_id, reported_by_user_id, verified_by_user_id, verified_at) 
SELECT 
    g.id,
    CASE 
        -- Yinzers vs Treyway - Yinzers win (Yinzers 2-0, Treyway 1-2)
        WHEN g.home_team_id = 1 AND g.away_team_id = 3 THEN 91
        -- Diddy's Lawyers vs PA Lakers - Diddy's Lawyers win (Diddy's Lawyers 2-1, PA Lakers 1-2)
        WHEN g.home_team_id = 4 AND g.away_team_id = 6 THEN 87
        -- Beltzboys vs PGH Elite - Beltzboys win (Beltzboys 2-1, PGH Elite 1-2)
        WHEN g.home_team_id = 5 AND g.away_team_id = 7 THEN 80
        -- Diddy Party vs Nate & Friends - Diddy Party win (Diddy Party 2-1, Nate & Friends 1-2)
        WHEN g.home_team_id = 8 AND g.away_team_id = 10 THEN 86
        -- Redeem Team vs Indiana Bones - Redeem Team win (Redeem Team 1-2, Indiana Bones 1-1)
        WHEN g.home_team_id = 9 AND g.away_team_id = 11 THEN 78
    END as home_score,
    CASE 
        WHEN g.home_team_id = 1 AND g.away_team_id = 3 THEN 88
        WHEN g.home_team_id = 4 AND g.away_team_id = 6 THEN 84
        WHEN g.home_team_id = 5 AND g.away_team_id = 7 THEN 77
        WHEN g.home_team_id = 8 AND g.away_team_id = 10 THEN 83
        WHEN g.home_team_id = 9 AND g.away_team_id = 11 THEN 75
    END as away_score,
    CASE 
        WHEN g.home_team_id = 1 AND g.away_team_id = 3 THEN 1  -- Yinzers win
        WHEN g.home_team_id = 4 AND g.away_team_id = 6 THEN 4  -- Diddy's Lawyers win
        WHEN g.home_team_id = 5 AND g.away_team_id = 7 THEN 5  -- Beltzboys win
        WHEN g.home_team_id = 8 AND g.away_team_id = 10 THEN 8  -- Diddy Party win (but they should lose more, let me fix this)
        WHEN g.home_team_id = 9 AND g.away_team_id = 11 THEN 9  -- Redeem Team win
    END as winning_team_id,
    1 as reported_by_user_id,
    1 as verified_by_user_id,
    CURRENT_TIMESTAMP as verified_at
FROM games g
WHERE g.season_id = 1 AND g.week_number = 3;

-- Let me fix that last game - Diddy Party should lose more
UPDATE game_results 
SET home_team_score = 78, away_team_score = 83, winning_team_id = 10
WHERE game_id = (SELECT id FROM games WHERE season_id = 1 AND week_number = 3 AND home_team_id = 8 AND away_team_id = 10);

-- Show current records after 3 weeks
SELECT 
    t.name,
    COUNT(CASE WHEN gr.winning_team_id = t.id THEN 1 END) as wins,
    COUNT(CASE WHEN gr.winning_team_id != t.id THEN 1 END) as losses
FROM teams t
LEFT JOIN games g ON (g.home_team_id = t.id OR g.away_team_id = t.id) AND g.season_id = 1 AND g.is_completed = true
LEFT JOIN game_results gr ON gr.game_id = g.id
WHERE t.season_id = 1
GROUP BY t.id, t.name
ORDER BY wins DESC, losses ASC, t.name;