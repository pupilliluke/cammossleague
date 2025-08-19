package cammossleague.controller;

import cammossleague.model.Game;
import cammossleague.repository.GameRepository;
import cammossleague.repository.SeasonRepository;
import cammossleague.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/schedule")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
@RequiredArgsConstructor
public class ScheduleController {
    
    private final GameRepository gameRepository;
    private final SeasonRepository seasonRepository;
    private final TeamRepository teamRepository;
    
    @GetMapping
    public ResponseEntity<List<Game>> getAllGames() {
        List<Game> games = gameRepository.findAll();
        return ResponseEntity.ok(games);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Game> getGameById(@PathVariable Long id) {
        Optional<Game> game = gameRepository.findById(id);
        return game.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/season/{seasonId}")
    public ResponseEntity<List<Game>> getGamesBySeason(@PathVariable Long seasonId) {
        List<Game> games = gameRepository.findBySeasonIdOrderByGameDateAscGameTimeAsc(seasonId);
        return ResponseEntity.ok(games);
    }
    
    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<Game>> getGamesByTeam(@PathVariable Long teamId) {
        List<Game> games = gameRepository.findByTeamId(teamId);
        return ResponseEntity.ok(games);
    }
    
    @GetMapping("/team/{teamId}/season/{seasonId}")
    public ResponseEntity<List<Game>> getGamesByTeamAndSeason(
            @PathVariable Long teamId, 
            @PathVariable Long seasonId) {
        List<Game> games = gameRepository.findByTeamIdAndSeasonId(teamId, seasonId);
        return ResponseEntity.ok(games);
    }
    
    @GetMapping("/week/{seasonId}/{weekNumber}")
    public ResponseEntity<List<Game>> getGamesByWeek(
            @PathVariable Long seasonId, 
            @PathVariable Integer weekNumber) {
        List<Game> games = gameRepository.findBySeasonIdAndWeekNumberOrderByGameDateAscGameTimeAsc(seasonId, weekNumber);
        return ResponseEntity.ok(games);
    }
    
    @GetMapping("/upcoming")
    public ResponseEntity<List<Game>> getUpcomingGames() {
        List<Game> games = gameRepository.findUpcomingGames(LocalDate.now());
        return ResponseEntity.ok(games);
    }
    
    @GetMapping("/upcoming/season/{seasonId}")
    public ResponseEntity<List<Game>> getUpcomingGamesBySeason(@PathVariable Long seasonId) {
        List<Game> games = gameRepository.findUpcomingGamesBySeason(seasonId, LocalDate.now());
        return ResponseEntity.ok(games);
    }
    
    @GetMapping("/completed/season/{seasonId}")
    public ResponseEntity<List<Game>> getCompletedGamesBySeason(@PathVariable Long seasonId) {
        List<Game> games = gameRepository.findBySeasonIdAndIsCompletedOrderByGameDateAscGameTimeAsc(seasonId, true);
        return ResponseEntity.ok(games);
    }
    
    @GetMapping("/type/{seasonId}/{gameType}")
    public ResponseEntity<List<Game>> getGamesByType(
            @PathVariable Long seasonId, 
            @PathVariable Game.GameType gameType) {
        List<Game> games = gameRepository.findBySeasonIdAndGameTypeOrderByGameDateAscGameTimeAsc(seasonId, gameType);
        return ResponseEntity.ok(games);
    }
    
    @GetMapping("/stats/season/{seasonId}")
    public ResponseEntity<Object> getSeasonScheduleStats(@PathVariable Long seasonId) {
        Long totalGames = gameRepository.countGamesBySeason(seasonId);
        Long completedGames = gameRepository.countCompletedGamesBySeason(seasonId);
        Long upcomingGames = totalGames - completedGames;
        Double completionPercentage = totalGames > 0 ? (double) completedGames / totalGames * 100 : 0.0;
        
        var stats = new java.util.HashMap<String, Object>();
        stats.put("totalGames", totalGames);
        stats.put("completedGames", completedGames);
        stats.put("upcomingGames", upcomingGames);
        stats.put("completionPercentage", completionPercentage);
        
        return ResponseEntity.ok(stats);
    }
}

