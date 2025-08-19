package cammossleague.controller.admin;

import cammossleague.dto.GameDTO;
import cammossleague.service.GameService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/games")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminGameController {
    
    private final GameService gameService;
    
    @GetMapping
    public ResponseEntity<Page<GameDTO>> getAllGames(
            @RequestParam(required = false) Long seasonId,
            @RequestParam(required = false) Integer weekNumber,
            @RequestParam(required = false) Boolean isCompleted,
            Pageable pageable) {
        
        Page<GameDTO> games = gameService.getGames(seasonId, weekNumber, isCompleted, pageable);
        return ResponseEntity.ok(games);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<GameDTO> getGame(@PathVariable Long id) {
        GameDTO game = gameService.getGameById(id);
        return ResponseEntity.ok(game);
    }
    
    @PostMapping
    public ResponseEntity<GameDTO> createGame(@Valid @RequestBody GameDTO gameDTO) {
        GameDTO createdGame = gameService.createGame(gameDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdGame);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<GameDTO> updateGame(@PathVariable Long id, @Valid @RequestBody GameDTO gameDTO) {
        GameDTO updatedGame = gameService.updateGame(id, gameDTO);
        return ResponseEntity.ok(updatedGame);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGame(@PathVariable Long id) {
        gameService.deleteGame(id);
        return ResponseEntity.noContent().build();
    }
    
    @PatchMapping("/{id}/score")
    public ResponseEntity<GameDTO> updateGameScore(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> scores) {
        
        Integer homeScore = scores.get("homeScore");
        Integer awayScore = scores.get("awayScore");
        
        GameDTO updatedGame = gameService.updateGameScore(id, homeScore, awayScore);
        return ResponseEntity.ok(updatedGame);
    }
    
    @PostMapping("/{id}/complete")
    public ResponseEntity<GameDTO> completeGame(@PathVariable Long id) {
        GameDTO completedGame = gameService.completeGame(id);
        return ResponseEntity.ok(completedGame);
    }
    
    @PostMapping("/bulk")
    public ResponseEntity<String> createBulkGames(@RequestBody Map<String, Object> bulkGameData) {
        Long seasonId = Long.valueOf(bulkGameData.get("seasonId").toString());
        Integer startWeek = Integer.valueOf(bulkGameData.get("startWeek").toString());
        Integer endWeek = Integer.valueOf(bulkGameData.get("endWeek").toString());
        String location = bulkGameData.get("location").toString();
        
        int gamesCreated = gameService.createBulkGames(seasonId, startWeek, endWeek, location);
        return ResponseEntity.ok("Created " + gamesCreated + " games");
    }
    
    @GetMapping("/schedule/generate/{seasonId}")
    public ResponseEntity<String> generateSchedule(@PathVariable Long seasonId) {
        int gamesGenerated = gameService.generateSeasonSchedule(seasonId);
        return ResponseEntity.ok("Generated " + gamesGenerated + " games for the season");
    }
    
    @DeleteMapping("/all")
    public ResponseEntity<String> deleteAllGames() {
        int deletedCount = gameService.deleteAllGames();
        return ResponseEntity.ok("Deleted " + deletedCount + " games");
    }
    
    @DeleteMapping("/season/{seasonId}")
    public ResponseEntity<String> deleteGamesBySeason(@PathVariable Long seasonId) {
        int deletedCount = gameService.deleteGamesBySeason(seasonId);
        return ResponseEntity.ok("Deleted " + deletedCount + " games for season " + seasonId);
    }
}