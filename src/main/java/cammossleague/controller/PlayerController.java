package cammossleague.controller;

import cammossleague.model.Player;
import cammossleague.service.PlayerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/players")
@RequiredArgsConstructor
public class PlayerController {
    
    private final PlayerService playerService;
    
    @GetMapping
    public ResponseEntity<List<Player>> getAllPlayers(
            @RequestParam(required = false) Long seasonId,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Long teamId,
            @RequestParam(required = false) String position,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(defaultValue = "false") boolean activePlayersOnly) {
        
        List<Player> players;
        
        // Start with the most specific filter first
        if (teamId != null && seasonId != null) {
            // Filter by both team and season
            players = playerService.getPlayersByTeamAndSeason(teamId, seasonId);
        } else if (teamId != null) {
            // Filter by team only
            players = playerService.getPlayersByTeam(teamId);
        } else if (seasonId != null) {
            // Filter by season only
            if (activePlayersOnly) {
                players = playerService.getActivePlayersInSeason(seasonId);
            } else {
                players = playerService.getPlayersBySeason(seasonId);
            }
        } else if (year != null) {
            // Filter by season year
            players = playerService.getPlayersByYear(year);
        } else {
            // Get all players
            players = playerService.getAllPlayers();
        }
        
        // Apply additional filters
        if (position != null && !position.isEmpty()) {
            players = players.stream()
                .filter(p -> p.getPosition().name().equals(position.toUpperCase()))
                .toList();
        }
        
        if (isActive != null) {
            players = players.stream()
                .filter(p -> p.getIsActive().equals(isActive))
                .toList();
        }
        
        return ResponseEntity.ok(players);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Player> getPlayerById(@PathVariable Long id) {
        return playerService.getPlayerById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/season/{seasonId}")
    public ResponseEntity<List<Player>> getPlayersBySeason(@PathVariable Long seasonId) {
        List<Player> players = playerService.getPlayersBySeason(seasonId);
        return ResponseEntity.ok(players);
    }
    
    @GetMapping("/season/{seasonId}/active")
    public ResponseEntity<List<Player>> getActivePlayersBySeason(@PathVariable Long seasonId) {
        List<Player> players = playerService.getActivePlayersInSeason(seasonId);
        return ResponseEntity.ok(players);
    }
    
    @GetMapping("/year/{year}")
    public ResponseEntity<List<Player>> getPlayersByYear(@PathVariable Integer year) {
        List<Player> players = playerService.getPlayersByYear(year);
        return ResponseEntity.ok(players);
    }
    
    @GetMapping("/team/{teamId}/season/{seasonId}")
    public ResponseEntity<List<Player>> getPlayersByTeamAndSeason(
            @PathVariable Long teamId, @PathVariable Long seasonId) {
        List<Player> players = playerService.getPlayersByTeamAndSeason(teamId, seasonId);
        return ResponseEntity.ok(players);
    }
    
    @GetMapping("/free-agents")
    public ResponseEntity<List<Player>> getFreeAgents() {
        List<Player> freeAgents = playerService.getFreeAgents();
        return ResponseEntity.ok(freeAgents);
    }
    
    @GetMapping("/{id}/stats")
    public ResponseEntity<Player> getPlayerStats(@PathVariable Long id) {
        return playerService.getPlayerById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/{id}/team-history")
    public ResponseEntity<Map<String, Object>> getPlayerTeamHistory(@PathVariable Long id) {
        Map<String, Object> teamHistory = playerService.getPlayerTeamHistory(id);
        if (teamHistory.containsKey("error")) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(teamHistory);
    }
}