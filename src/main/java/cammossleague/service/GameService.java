package cammossleague.service;

import cammossleague.dto.GameDTO;
import cammossleague.model.Game;
import cammossleague.model.Season;
import cammossleague.model.Team;
import cammossleague.repository.GameRepository;
import cammossleague.repository.SeasonRepository;
import cammossleague.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class GameService {
    
    private final GameRepository gameRepository;
    private final SeasonRepository seasonRepository;
    private final TeamRepository teamRepository;
    
    public Page<GameDTO> getGames(Long seasonId, Integer weekNumber, Boolean isCompleted, Pageable pageable) {
        Page<Game> games;
        
        if (seasonId != null && weekNumber != null) {
            games = gameRepository.findBySeasonIdAndWeekNumber(seasonId, weekNumber, pageable);
        } else if (seasonId != null) {
            games = gameRepository.findBySeasonId(seasonId, pageable);
        } else if (isCompleted != null) {
            games = gameRepository.findByIsCompleted(isCompleted, pageable);
        } else {
            games = gameRepository.findAllByOrderByGameDateDescGameTimeDesc(pageable);
        }
        
        List<GameDTO> gameDTOs = games.getContent().stream()
                .map(GameDTO::fromEntity)
                .collect(Collectors.toList());
        
        return new PageImpl<>(gameDTOs, pageable, games.getTotalElements());
    }
    
    public GameDTO getGameById(Long id) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Game not found with id: " + id));
        return GameDTO.fromEntity(game);
    }
    
    public GameDTO createGame(GameDTO gameDTO) {
        Season season = seasonRepository.findById(gameDTO.getSeasonId())
                .orElseThrow(() -> new RuntimeException("Season not found with id: " + gameDTO.getSeasonId()));
        
        Team homeTeam = teamRepository.findById(gameDTO.getHomeTeamId())
                .orElseThrow(() -> new RuntimeException("Home team not found with id: " + gameDTO.getHomeTeamId()));
        
        Team awayTeam = teamRepository.findById(gameDTO.getAwayTeamId())
                .orElseThrow(() -> new RuntimeException("Away team not found with id: " + gameDTO.getAwayTeamId()));
        
        if (homeTeam.getId().equals(awayTeam.getId())) {
            throw new RuntimeException("Home team and away team cannot be the same");
        }
        
        Game game = Game.builder()
                .season(season)
                .homeTeam(homeTeam)
                .awayTeam(awayTeam)
                .gameDate(gameDTO.getGameDate())
                .gameTime(gameDTO.getGameTime())
                .location(gameDTO.getLocation())
                .courtNumber(gameDTO.getCourtNumber())
                .gameType(Game.GameType.valueOf(gameDTO.getGameType() != null ? gameDTO.getGameType() : "REGULAR"))
                .weekNumber(gameDTO.getWeekNumber())
                .notes(gameDTO.getNotes())
                .isCompleted(false)
                .build();
        
        Game savedGame = gameRepository.save(game);
        return GameDTO.fromEntity(savedGame);
    }
    
    public GameDTO updateGame(Long id, GameDTO gameDTO) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Game not found with id: " + id));
        
        if (gameDTO.getGameDate() != null) {
            game.setGameDate(gameDTO.getGameDate());
        }
        if (gameDTO.getGameTime() != null) {
            game.setGameTime(gameDTO.getGameTime());
        }
        if (gameDTO.getLocation() != null) {
            game.setLocation(gameDTO.getLocation());
        }
        if (gameDTO.getCourtNumber() != null) {
            game.setCourtNumber(gameDTO.getCourtNumber());
        }
        if (gameDTO.getWeekNumber() != null) {
            game.setWeekNumber(gameDTO.getWeekNumber());
        }
        if (gameDTO.getNotes() != null) {
            game.setNotes(gameDTO.getNotes());
        }
        if (gameDTO.getHomeScore() != null) {
            game.setHomeScore(gameDTO.getHomeScore());
        }
        if (gameDTO.getAwayScore() != null) {
            game.setAwayScore(gameDTO.getAwayScore());
        }
        
        Game updatedGame = gameRepository.save(game);
        return GameDTO.fromEntity(updatedGame);
    }
    
    public void deleteGame(Long id) {
        if (!gameRepository.existsById(id)) {
            throw new RuntimeException("Game not found with id: " + id);
        }
        gameRepository.deleteById(id);
    }
    
    public GameDTO updateGameScore(Long id, Integer homeScore, Integer awayScore) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Game not found with id: " + id));
        
        game.setHomeScore(homeScore);
        game.setAwayScore(awayScore);
        game.setIsCompleted(homeScore != null && awayScore != null);
        
        if (game.getIsCompleted()) {
            updateTeamRecords(game);
        }
        
        Game updatedGame = gameRepository.save(game);
        return GameDTO.fromEntity(updatedGame);
    }
    
    public GameDTO completeGame(Long id) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Game not found with id: " + id));
        
        if (game.getHomeScore() == null || game.getAwayScore() == null) {
            throw new RuntimeException("Cannot complete game without scores");
        }
        
        game.setIsCompleted(true);
        updateTeamRecords(game);
        
        Game completedGame = gameRepository.save(game);
        return GameDTO.fromEntity(completedGame);
    }
    
    private void updateTeamRecords(Game game) {
        Team homeTeam = game.getHomeTeam();
        Team awayTeam = game.getAwayTeam();
        
        // Update points for/against
        homeTeam.setPointsFor(homeTeam.getPointsFor() + game.getHomeScore());
        homeTeam.setPointsAgainst(homeTeam.getPointsAgainst() + game.getAwayScore());
        awayTeam.setPointsFor(awayTeam.getPointsFor() + game.getAwayScore());
        awayTeam.setPointsAgainst(awayTeam.getPointsAgainst() + game.getHomeScore());
        
        // Update wins/losses
        if (game.getHomeScore() > game.getAwayScore()) {
            homeTeam.setWins(homeTeam.getWins() + 1);
            awayTeam.setLosses(awayTeam.getLosses() + 1);
        } else if (game.getAwayScore() > game.getHomeScore()) {
            awayTeam.setWins(awayTeam.getWins() + 1);
            homeTeam.setLosses(homeTeam.getLosses() + 1);
        }
        
        teamRepository.save(homeTeam);
        teamRepository.save(awayTeam);
    }
    
    public int createBulkGames(Long seasonId, Integer startWeek, Integer endWeek, String location) {
        Season season = seasonRepository.findById(seasonId)
                .orElseThrow(() -> new RuntimeException("Season not found with id: " + seasonId));
        
        List<Team> teams = teamRepository.findBySeasonId(seasonId);
        if (teams.size() < 2) {
            throw new RuntimeException("Need at least 2 teams to create games");
        }
        
        List<Game> games = new ArrayList<>();
        LocalDate currentDate = season.getStartDate();
        
        for (int week = startWeek; week <= endWeek; week++) {
            List<Game> weekGames = createWeekGames(season, teams, week, currentDate, location);
            games.addAll(weekGames);
            currentDate = currentDate.plusWeeks(1);
        }
        
        gameRepository.saveAll(games);
        return games.size();
    }
    
    private List<Game> createWeekGames(Season season, List<Team> teams, int weekNumber, LocalDate gameDate, String location) {
        List<Game> games = new ArrayList<>();
        List<Team> shuffledTeams = new ArrayList<>(teams);
        Collections.shuffle(shuffledTeams);
        
        LocalTime gameTime = LocalTime.of(19, 0); // 7:00 PM
        
        for (int i = 0; i < shuffledTeams.size(); i += 2) {
            if (i + 1 < shuffledTeams.size()) {
                Game game = Game.builder()
                        .season(season)
                        .homeTeam(shuffledTeams.get(i))
                        .awayTeam(shuffledTeams.get(i + 1))
                        .gameDate(gameDate)
                        .gameTime(gameTime)
                        .location(location)
                        .weekNumber(weekNumber)
                        .gameType(Game.GameType.REGULAR)
                        .isCompleted(false)
                        .build();
                
                games.add(game);
                gameTime = gameTime.plusHours(1); // Next game 1 hour later
            }
        }
        
        return games;
    }
    
    public int generateSeasonSchedule(Long seasonId) {
        Season season = seasonRepository.findById(seasonId)
                .orElseThrow(() -> new RuntimeException("Season not found with id: " + seasonId));
        
        List<Team> teams = teamRepository.findBySeasonId(seasonId);
        if (teams.size() < 2) {
            throw new RuntimeException("Need at least 2 teams to generate schedule");
        }
        
        // Generate round-robin schedule
        List<Game> games = generateRoundRobinSchedule(season, teams);
        gameRepository.saveAll(games);
        
        return games.size();
    }
    
    private List<Game> generateRoundRobinSchedule(Season season, List<Team> teams) {
        List<Game> games = new ArrayList<>();
        int numTeams = teams.size();
        
        // If odd number of teams, add a "bye" team
        if (numTeams % 2 != 0) {
            numTeams++;
        }
        
        int numRounds = numTeams - 1;
        int numMatchesPerRound = numTeams / 2;
        
        LocalDate currentDate = season.getStartDate();
        
        for (int round = 0; round < numRounds; round++) {
            LocalTime gameTime = LocalTime.of(19, 0);
            
            for (int match = 0; match < numMatchesPerRound; match++) {
                int home = (round + match) % (numTeams - 1);
                int away = (numTeams - 1 - match + round) % (numTeams - 1);
                
                // Last team stays in same position for half the rounds
                if (match == 0) {
                    away = numTeams - 1;
                }
                
                // Skip if this would be a bye game (when we had odd number of teams)
                if (home < teams.size() && away < teams.size() && home != away) {
                    Game game = Game.builder()
                            .season(season)
                            .homeTeam(teams.get(home))
                            .awayTeam(teams.get(away))
                            .gameDate(currentDate)
                            .gameTime(gameTime)
                            .location("Community Center")
                            .weekNumber(round + 1)
                            .gameType(Game.GameType.REGULAR)
                            .isCompleted(false)
                            .build();
                    
                    games.add(game);
                    gameTime = gameTime.plusHours(1);
                }
            }
            
            currentDate = currentDate.plusWeeks(1);
        }
        
        return games;
    }
    
    @Transactional
    public int deleteAllGames() {
        List<Game> allGames = gameRepository.findAll();
        int count = allGames.size();
        gameRepository.deleteAll();
        return count;
    }
    
    @Transactional
    public int deleteGamesBySeason(Long seasonId) {
        List<Game> seasonGames = gameRepository.findBySeasonId(seasonId);
        int count = seasonGames.size();
        gameRepository.deleteAll(seasonGames);
        return count;
    }
}