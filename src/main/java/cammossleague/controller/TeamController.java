package cammossleague.controller;

import cammossleague.model.Team;
import cammossleague.model.Season;
import cammossleague.model.User;
import cammossleague.repository.TeamRepository;
import cammossleague.repository.SeasonRepository;
import cammossleague.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class TeamController {
    
    @Autowired
    private TeamRepository teamRepository;
    
    @Autowired
    private SeasonRepository seasonRepository;
    
    @Autowired
    private UserRepository userRepository;

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
    
    @PostMapping
    public ResponseEntity<?> createTeam(@RequestBody Map<String, Object> teamData) {
        try {
            // Get authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "You must be logged in to create a team"));
            }
            
            String usernameOrEmail = authentication.getName();
            
            // First try to find by username (for traditional users)
            User captain = userRepository.findByUsername(usernameOrEmail).orElse(null);
            
            // If not found by username, try to find by email (for Google OAuth users)
            if (captain == null) {
                captain = userRepository.findByEmail(usernameOrEmail).orElse(null);
            }
            
            if (captain == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User not found"));
            }
            
            // Extract team data
            String teamName = (String) teamData.get("name");
            Long seasonId = Long.valueOf(teamData.get("season_id").toString());
            Long captainId = Long.valueOf(teamData.get("captain_id").toString());
            
            // Validate captain matches authenticated user
            if (!captain.getId().equals(captainId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "You can only create teams for yourself"));
            }
            
            // Validate season exists
            Optional<Season> seasonOpt = seasonRepository.findById(seasonId);
            if (seasonOpt.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Season not found"));
            }
            
            // Check if user already has a team in this season
            List<Team> existingTeams = teamRepository.findBySeasonIdAndCaptainId(seasonId, captainId);
            if (!existingTeams.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "You already have a team in this season"));
            }
            
            // Create team
            Team team = new Team();
            team.setName(teamName);
            team.setSeason(seasonOpt.get());
            team.setCaptain(captain);
            team.setIsActive(true);
            team.setWins(0);
            team.setLosses(0);
            team.setPointsFor(0);
            team.setPointsAgainst(0);
            
            Team savedTeam = teamRepository.save(team);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(savedTeam);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to create team: " + e.getMessage()));
        }
    }
}