-- Update 2025 season team records
-- Order: Yinzers, Plum's Finest, Treyway, Diddy's Lawyers, Beltzboys, PA Lakers, PGH Elite, Diddy Party, Redeem Team, Nate & Friends, Indiana Bones & the Womb Raiders
-- Records: (5-0, 4-1, 3-2, 3-2, 3-2, 3-2, 2-3, 2-3, 1-4, 1-4, 1-4)

UPDATE teams SET wins = 5, losses = 0 WHERE season_id = 1 AND name = 'Yinzers';
UPDATE teams SET wins = 4, losses = 1 WHERE season_id = 1 AND name = 'Plum''s Finest';
UPDATE teams SET wins = 3, losses = 2 WHERE season_id = 1 AND name = 'Treyway';
UPDATE teams SET wins = 3, losses = 2 WHERE season_id = 1 AND name = 'Diddy''s Lawyers';
UPDATE teams SET wins = 3, losses = 2 WHERE season_id = 1 AND name = 'Beltzboys';
UPDATE teams SET wins = 3, losses = 2 WHERE season_id = 1 AND name = 'PA Lakers';
UPDATE teams SET wins = 2, losses = 3 WHERE season_id = 1 AND name = 'PGH Elite';
UPDATE teams SET wins = 2, losses = 3 WHERE season_id = 1 AND name = 'Diddy Party';
UPDATE teams SET wins = 1, losses = 4 WHERE season_id = 1 AND name = 'Redeem Team';
UPDATE teams SET wins = 1, losses = 4 WHERE season_id = 1 AND name = 'Nate & Friends';
UPDATE teams SET wins = 1, losses = 4 WHERE season_id = 1 AND name = 'Indiana Bones & the Womb Raiders';

-- Show updated records for 2025 season
SELECT name, wins, losses, (wins || '-' || losses) as record 
FROM teams 
WHERE season_id = 1 
ORDER BY wins DESC, losses ASC, name;