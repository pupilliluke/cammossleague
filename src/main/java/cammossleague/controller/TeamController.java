package cammossleague.controller;

import cammossleague.model.Team;
import cammossleague.repository.TeamRepository;
import cammossleague.repository.SeasonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class TeamController {
    
    @Autowired
    private TeamRepository teamRepository;
    
    @Autowired
    private SeasonRepository seasonRepository;

    @GetMapping
    public ResponseEntity<List<Team>> getAllTeams(
            @RequestParam(required = false) Long seasonId,
            @RequestParam(required = false) Integer year,
            @RequestParam(defaultValue = "false") boolean orderByStandings) {
        
        List<Team> teams;
        
        if (seasonId != null) {
            // Filter by specific season ID
            if (orderByStandings) {
                teams = teamRepository.findBySeasonIdOrderByWinsDesc(seasonId);
            } else {
                teams = teamRepository.findBySeasonId(seasonId);
            }
        } else if (year != null) {
            // Filter by season year
            teams = teamRepository.findBySeasonYear(year);
        } else {
            // Get all teams (default behavior)
            teams = teamRepository.findAll();
        }
        
        return ResponseEntity.ok(teams);
    }
    
    @GetMapping("/season/{seasonId}")
    public ResponseEntity<List<Team>> getTeamsBySeason(@PathVariable Long seasonId) {
        List<Team> teams = teamRepository.findBySeasonId(seasonId);
        return ResponseEntity.ok(teams);
    }
    
    @GetMapping("/season/{seasonId}/standings")
    public ResponseEntity<List<Team>> getTeamStandingsBySeason(@PathVariable Long seasonId) {
        List<Team> teams = teamRepository.findBySeasonIdOrderByWinsDesc(seasonId);
        return ResponseEntity.ok(teams);
    }
    
    @GetMapping("/year/{year}")
    public ResponseEntity<List<Team>> getTeamsByYear(@PathVariable Integer year) {
        List<Team> teams = teamRepository.findBySeasonYear(year);
        return ResponseEntity.ok(teams);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Team> getTeamById(@PathVariable Long id) {
        return teamRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}