package cammossleague.controller;

import cammossleague.model.Player;
import cammossleague.model.Team;
import cammossleague.model.Season;
import cammossleague.model.Game;
import cammossleague.service.PlayerService;
import cammossleague.repository.TeamRepository;
import cammossleague.repository.SeasonRepository;
import cammossleague.repository.GameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/league")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
@RequiredArgsConstructor
public class LeagueStatsController {
    
    private final PlayerService playerService;
    private final TeamRepository teamRepository;
    private final SeasonRepository seasonRepository;
    private final GameRepository gameRepository;
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getLeagueStats(
            @RequestParam(required = false) Long seasonId,
            @RequestParam(required = false) Integer year) {
        
        Map<String, Object> stats = new HashMap<>();
        
        // Determine which season to use
        Season season = null;
        if (seasonId != null) {
            Optional<Season> seasonOpt = seasonRepository.findById(seasonId);
            if (seasonOpt.isPresent()) {
                season = seasonOpt.get();
            }
        } else if (year != null) {
            Optional<Season> seasonOpt = seasonRepository.findByYear(year);
            if (seasonOpt.isPresent()) {
                season = seasonOpt.get();
            }
        } else {
            // Default to active season
            Optional<Season> seasonOpt = seasonRepository.findByIsActiveTrue();
            if (seasonOpt.isPresent()) {
                season = seasonOpt.get();
            }
        }
        
        if (season == null) {
            stats.put("error", "No season found");
            return ResponseEntity.badRequest().body(stats);
        }
        
        // Get season data
        stats.put("season", Map.of(
            "id", season.getId(),
            "name", season.getName(),
            "year", season.getYear(),
            "isActive", season.getIsActive()
        ));
        
        // Get teams for this season
        List<Team> teams = teamRepository.findBySeasonIdOrderByWinsDesc(season.getId());
        stats.put("totalTeams", teams.size());
        
        // Get players for this season
        List<Player> players = playerService.getActivePlayersInSeason(season.getId());
        stats.put("totalPlayers", players.size());
        
        // Calculate team statistics
        if (!teams.isEmpty()) {
            stats.put("teamStats", Map.of(
                "totalWins", teams.stream().mapToInt(Team::getWins).sum(),
                "totalLosses", teams.stream().mapToInt(Team::getLosses).sum(),
                "totalPointsScored", teams.stream().mapToInt(Team::getPointsFor).sum(),
                "totalPointsAllowed", teams.stream().mapToInt(Team::getPointsAgainst).sum(),
                "averageWins", teams.stream().mapToInt(Team::getWins).average().orElse(0.0),
                "averageLosses", teams.stream().mapToInt(Team::getLosses).average().orElse(0.0)
            ));
            
            // Top team standings
            stats.put("topTeams", teams.stream()
                .limit(5)
                .map(team -> Map.of(
                    "id", team.getId(),
                    "name", team.getDisplayName(),
                    "wins", team.getWins(),
                    "losses", team.getLosses(),
                    "winPercentage", team.getWinPercentage(),
                    "pointsDifferential", team.getPointsDifferential()
                ))
                .collect(Collectors.toList()));
        }
        
        // Calculate player statistics
        if (!players.isEmpty()) {
            stats.put("playerStats", Map.of(
                "totalGamesPlayed", players.stream().mapToInt(Player::getStatsGamesPlayed).sum(),
                "totalPoints", players.stream().mapToInt(Player::getStatsPoints).sum(),
                "totalRebounds", players.stream().mapToInt(Player::getStatsRebounds).sum(),
                "totalAssists", players.stream().mapToInt(Player::getStatsAssists).sum(),
                "averagePointsPerGame", players.stream().mapToDouble(Player::getPointsPerGame).average().orElse(0.0),
                "averageReboundsPerGame", players.stream().mapToDouble(Player::getReboundsPerGame).average().orElse(0.0),
                "averageAssistsPerGame", players.stream().mapToDouble(Player::getAssistsPerGame).average().orElse(0.0)
            ));
            
            // Top scorers
            stats.put("topScorers", players.stream()
                .sorted((a, b) -> Double.compare(b.getPointsPerGame(), a.getPointsPerGame()))
                .limit(5)
                .map(player -> Map.of(
                    "id", player.getId(),
                    "name", player.getDisplayName(),
                    "position", player.getPosition().getDisplayName(),
                    "pointsPerGame", player.getPointsPerGame(),
                    "totalPoints", player.getStatsPoints(),
                    "gamesPlayed", player.getStatsGamesPlayed()
                ))
                .collect(Collectors.toList()));
            
            // Top rebounders
            stats.put("topRebounders", players.stream()
                .sorted((a, b) -> Double.compare(b.getReboundsPerGame(), a.getReboundsPerGame()))
                .limit(5)
                .map(player -> Map.of(
                    "id", player.getId(),
                    "name", player.getDisplayName(),
                    "position", player.getPosition().getDisplayName(),
                    "reboundsPerGame", player.getReboundsPerGame(),
                    "totalRebounds", player.getStatsRebounds(),
                    "gamesPlayed", player.getStatsGamesPlayed()
                ))
                .collect(Collectors.toList()));
        }
        
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/season/{seasonId}/stats")
    public ResponseEntity<Map<String, Object>> getSeasonStats(@PathVariable Long seasonId) {
        return getLeagueStats(seasonId, null);
    }
    
    @GetMapping("/year/{year}/stats")
    public ResponseEntity<Map<String, Object>> getYearStats(@PathVariable Integer year) {
        return getLeagueStats(null, year);
    }
    
    @GetMapping("/seasons")
    public ResponseEntity<List<Map<String, Object>>> getAllSeasonsWithStats() {
        List<Season> seasons = seasonRepository.findAll();
        
        List<Map<String, Object>> seasonsWithStats = seasons.stream()
            .map(season -> {
                List<Team> teams = teamRepository.findBySeasonId(season.getId());
                List<Player> players = playerService.getPlayersBySeason(season.getId());
                
                Map<String, Object> seasonData = new HashMap<>();
                seasonData.put("id", season.getId());
                seasonData.put("name", season.getName());
                seasonData.put("year", season.getYear());
                seasonData.put("isActive", season.getIsActive());
                seasonData.put("teamCount", teams.size());
                seasonData.put("playerCount", players.size());
                seasonData.put("totalGames", teams.stream().mapToInt(t -> t.getWins() + t.getLosses()).sum());
                
                return seasonData;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(seasonsWithStats);
    }
    
    @GetMapping("/schedule")
    public ResponseEntity<Map<String, Object>> getLeagueSchedule(
            @RequestParam(required = false) Long seasonId,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer weekNumber) {
        
        Map<String, Object> response = new HashMap<>();
        
        // Determine which season to use
        Season season = null;
        if (seasonId != null) {
            Optional<Season> seasonOpt = seasonRepository.findById(seasonId);
            if (seasonOpt.isPresent()) {
                season = seasonOpt.get();
            }
        } else if (year != null) {
            Optional<Season> seasonOpt = seasonRepository.findByYear(year);
            if (seasonOpt.isPresent()) {
                season = seasonOpt.get();
            }
        } else {
            // Default to active season
            Optional<Season> seasonOpt = seasonRepository.findByIsActiveTrue();
            if (seasonOpt.isPresent()) {
                season = seasonOpt.get();
            }
        }
        
        if (season == null) {
            response.put("error", "No season found");
            return ResponseEntity.badRequest().body(response);
        }
        
        // Get games for the season
        List<Game> games;
        if (weekNumber != null) {
            games = gameRepository.findBySeasonIdAndWeekNumberOrderByGameDateAscGameTimeAsc(season.getId(), weekNumber);
        } else {
            games = gameRepository.findBySeasonIdOrderByGameDateAscGameTimeAsc(season.getId());
        }
        
        // Add season info
        response.put("season", Map.of(
            "id", season.getId(),
            "name", season.getName(),
            "year", season.getYear(),
            "isActive", season.getIsActive()
        ));
        
        // Group games by week for better organization
        Map<Integer, List<Map<String, Object>>> gamesByWeek = games.stream()
            .collect(Collectors.groupingBy(
                Game::getWeekNumber,
                Collectors.mapping(game -> {
                    Map<String, Object> gameMap = new HashMap<>();
                    gameMap.put("id", game.getId());
                    gameMap.put("weekNumber", game.getWeekNumber());
                    gameMap.put("gameDate", game.getGameDate().toString());
                    gameMap.put("gameTime", game.getGameTime().toString());
                    gameMap.put("homeTeam", Map.of(
                        "id", game.getHomeTeam().getId(),
                        "name", game.getHomeTeam().getName(),
                        "displayName", game.getHomeTeam().getDisplayName(),
                        "city", game.getHomeTeam().getCity()
                    ));
                    gameMap.put("awayTeam", Map.of(
                        "id", game.getAwayTeam().getId(),
                        "name", game.getAwayTeam().getName(),
                        "displayName", game.getAwayTeam().getDisplayName(),
                        "city", game.getAwayTeam().getCity()
                    ));
                    gameMap.put("location", game.getLocation());
                    gameMap.put("gameType", game.getGameType().toString());
                    gameMap.put("isCompleted", game.getIsCompleted());
                    gameMap.put("homeScore", game.getHomeScore());
                    gameMap.put("awayScore", game.getAwayScore());
                    gameMap.put("winner", game.getIsCompleted() && game.getHomeScore() != null && game.getAwayScore() != null
                        ? (game.getHomeScore() > game.getAwayScore() 
                            ? game.getHomeTeam().getDisplayName() 
                            : game.getAwayTeam().getDisplayName())
                        : null);
                    return gameMap;
                }, Collectors.toList())
            ));
        
        // Add schedule data
        response.put("schedule", gamesByWeek);
        response.put("totalGames", games.size());
        response.put("completedGames", games.stream().mapToInt(g -> g.getIsCompleted() ? 1 : 0).sum());
        response.put("upcomingGames", games.stream().mapToInt(g -> g.getIsCompleted() ? 0 : 1).sum());
        
        // Add week summary
        if (weekNumber == null) {
            List<Map<String, Object>> weekSummary = gamesByWeek.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> {
                    Map<String, Object> weekMap = new HashMap<>();
                    weekMap.put("weekNumber", entry.getKey());
                    weekMap.put("gameCount", entry.getValue().size());
                    weekMap.put("completedGames", entry.getValue().stream().mapToInt(g -> 
                        (Boolean) g.get("isCompleted") ? 1 : 0).sum());
                    return weekMap;
                })
                .collect(Collectors.toList());
            response.put("weekSummary", weekSummary);
        }
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/schedule/season/{seasonId}")
    public ResponseEntity<Map<String, Object>> getSeasonSchedule(@PathVariable Long seasonId) {
        return getLeagueSchedule(seasonId, null, null);
    }
    
    @GetMapping("/schedule/year/{year}")
    public ResponseEntity<Map<String, Object>> getYearSchedule(@PathVariable Integer year) {
        return getLeagueSchedule(null, year, null);
    }
    
    @GetMapping("/schedule/week/{weekNumber}")
    public ResponseEntity<Map<String, Object>> getWeekSchedule(
            @PathVariable Integer weekNumber,
            @RequestParam(required = false) Long seasonId,
            @RequestParam(required = false) Integer year) {
        return getLeagueSchedule(seasonId, year, weekNumber);
    }
}