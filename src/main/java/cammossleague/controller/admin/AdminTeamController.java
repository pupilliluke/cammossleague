package cammossleague.controller.admin;

import cammossleague.dto.TeamDTO;
import cammossleague.model.Team;
import cammossleague.service.TeamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/teams")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminTeamController {
    
    private final TeamService teamService;
    
    @GetMapping
    public ResponseEntity<?> getAllTeams(
            @RequestParam(required = false) Long seasonId,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean unpaged,
            Pageable pageable) {
        
        if (Boolean.TRUE.equals(unpaged)) {
            List<Team> teams = teamService.getAllTeamsWithFilters(seasonId, isActive, search);
            return ResponseEntity.ok(teams);
        } else {
            Page<Team> teams = teamService.getTeamsWithFilters(seasonId, isActive, search, pageable);
            return ResponseEntity.ok(teams);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Team> getTeam(@PathVariable Long id) {
        Team team = teamService.getTeamById(id);
        return ResponseEntity.ok(team);
    }
    
    @PostMapping
    public ResponseEntity<Team> createTeam(@Valid @RequestBody TeamDTO teamDTO) {
        try {
            Team createdTeam = teamService.createTeam(teamDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTeam);
        } catch (Exception e) {
            // Handle database sequence issues
            if (e.getMessage().contains("duplicate key") || e.getMessage().contains("teams_pkey")) {
                throw new RuntimeException("Unable to create team due to database sequence issue. Please contact administrator.");
            }
            throw e;
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Team> updateTeam(@PathVariable Long id, @Valid @RequestBody TeamDTO teamDTO) {
        Team updatedTeam = teamService.updateTeam(id, teamDTO);
        return ResponseEntity.ok(updatedTeam);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
        teamService.deleteTeam(id);
        return ResponseEntity.noContent().build();
    }
    
    @PatchMapping("/{id}/record")
    public ResponseEntity<Team> updateTeamRecord(
            @PathVariable Long id,
            @RequestBody Map<String, Object> recordData) {
        
        Integer wins = recordData.get("wins") != null ? 
            Integer.valueOf(recordData.get("wins").toString()) : null;
        Integer losses = recordData.get("losses") != null ? 
            Integer.valueOf(recordData.get("losses").toString()) : null;
        Integer pointsFor = recordData.get("pointsFor") != null ? 
            Integer.valueOf(recordData.get("pointsFor").toString()) : null;
        Integer pointsAgainst = recordData.get("pointsAgainst") != null ? 
            Integer.valueOf(recordData.get("pointsAgainst").toString()) : null;
        
        Team updatedTeam = teamService.updateTeamRecord(id, wins, losses, pointsFor, pointsAgainst);
        return ResponseEntity.ok(updatedTeam);
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<Team> updateTeamStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> statusData) {
        
        Boolean isActive = statusData.get("isActive");
        Boolean isPlayoffEligible = statusData.get("isPlayoffEligible");
        
        Team updatedTeam = teamService.updateTeamStatus(id, isActive, isPlayoffEligible);
        return ResponseEntity.ok(updatedTeam);
    }
    
    @PostMapping("/{id}/reset-record")
    public ResponseEntity<Team> resetTeamRecord(@PathVariable Long id) {
        Team updatedTeam = teamService.resetTeamRecord(id);
        return ResponseEntity.ok(updatedTeam);
    }
    
    @GetMapping("/season/{seasonId}")
    public ResponseEntity<List<Team>> getTeamsBySeason(@PathVariable Long seasonId) {
        List<Team> teams = teamService.getTeamsBySeason(seasonId);
        return ResponseEntity.ok(teams);
    }
    
    @GetMapping("/season/{seasonId}/standings")
    public ResponseEntity<List<Team>> getSeasonStandings(@PathVariable Long seasonId) {
        List<Team> standings = teamService.getStandings(seasonId);
        return ResponseEntity.ok(standings);
    }
    
    @PostMapping("/bulk-create")
    public ResponseEntity<List<Team>> createBulkTeams(
            @RequestBody Map<String, Object> bulkData) {
        
        Long seasonId = Long.valueOf(bulkData.get("seasonId").toString());
        @SuppressWarnings("unchecked")
        List<String> teamNames = (List<String>) bulkData.get("teamNames");
        
        List<Team> createdTeams = teamService.createBulkTeams(seasonId, teamNames);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTeams);
    }
    
    @PostMapping("/{teamId}/players/{playerId}")
    public ResponseEntity<Void> addPlayerToTeam(
            @PathVariable Long teamId, 
            @PathVariable Long playerId) {
        
        teamService.addPlayerToTeam(teamId, playerId);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/{teamId}/players/{playerId}")
    public ResponseEntity<Void> removePlayerFromTeam(
            @PathVariable Long teamId, 
            @PathVariable Long playerId) {
        
        teamService.removePlayerFromTeam(teamId, playerId);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/reset-sequence")
    public ResponseEntity<Map<String, String>> resetTeamSequence() {
        teamService.resetTeamSequence();
        return ResponseEntity.ok(Map.of("message", "Team ID sequence reset successfully"));
    }
}