package cammossleague.controller;

import cammossleague.dto.FormSubmissionDTO;
import cammossleague.dto.GameDTO;
import cammossleague.dto.PlayoffBracketDTO;
import cammossleague.model.LeagueUpdate;
import cammossleague.model.Player;
import cammossleague.model.Season;
import cammossleague.model.Team;
import cammossleague.service.FormSubmissionService;
import cammossleague.service.GameService;
import cammossleague.service.PlayerService;
import cammossleague.service.PlayoffService;
import cammossleague.service.SeasonService;
import cammossleague.service.TeamService;
import cammossleague.repository.LeagueUpdateRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {
    
    private final SeasonService seasonService;
    private final TeamService teamService;
    private final GameService gameService;
    private final PlayoffService playoffService;
    private final FormSubmissionService formSubmissionService;
    private final PlayerService playerService;
    private final LeagueUpdateRepository leagueUpdateRepository;
    
    // Season endpoints
    @GetMapping("/seasons")
    public ResponseEntity<List<Season>> getActiveSeasons() {
        List<Season> seasons = seasonService.getActiveSeasons();
        return ResponseEntity.ok(seasons);
    }
    
    @GetMapping("/seasons/{id}")
    public ResponseEntity<Season> getSeason(@PathVariable Long id) {
        Season season = seasonService.getSeasonById(id);
        return ResponseEntity.ok(season);
    }
    
    @GetMapping("/seasons/current")
    public ResponseEntity<Season> getCurrentSeason() {
        Season currentSeason = seasonService.getCurrentSeason();
        return ResponseEntity.ok(currentSeason);
    }
    
    // Team endpoints
    @GetMapping("/seasons/{seasonId}/teams")
    public ResponseEntity<List<Team>> getSeasonTeams(@PathVariable Long seasonId) {
        List<Team> teams = teamService.getTeamsBySeason(seasonId);
        return ResponseEntity.ok(teams);
    }
    
    @GetMapping("/teams/{id}")
    public ResponseEntity<Team> getTeam(@PathVariable Long id) {
        Team team = teamService.getTeamById(id);
        return ResponseEntity.ok(team);
    }
    
    @GetMapping("/seasons/{seasonId}/standings")
    public ResponseEntity<List<Team>> getStandings(@PathVariable Long seasonId) {
        List<Team> standings = teamService.getStandings(seasonId);
        return ResponseEntity.ok(standings);
    }
    
    // Game/Schedule endpoints
    @GetMapping("/seasons/{seasonId}/games")
    public ResponseEntity<Page<GameDTO>> getSeasonGames(
            @PathVariable Long seasonId,
            @RequestParam(required = false) Integer week,
            Pageable pageable) {
        
        Page<GameDTO> games = gameService.getGames(seasonId, week, null, pageable);
        return ResponseEntity.ok(games);
    }
    
    @GetMapping("/games/{id}")
    public ResponseEntity<GameDTO> getGame(@PathVariable Long id) {
        GameDTO game = gameService.getGameById(id);
        return ResponseEntity.ok(game);
    }
    
    @GetMapping("/seasons/{seasonId}/schedule")
    public ResponseEntity<Page<GameDTO>> getSchedule(
            @PathVariable Long seasonId,
            @RequestParam(required = false) Integer week,
            Pageable pageable) {
        
        Page<GameDTO> schedule = gameService.getGames(seasonId, week, null, pageable);
        return ResponseEntity.ok(schedule);
    }
    
    @GetMapping("/games/recent")
    public ResponseEntity<Page<GameDTO>> getRecentGames(Pageable pageable) {
        Page<GameDTO> recentGames = gameService.getGames(null, null, true, pageable);
        return ResponseEntity.ok(recentGames);
    }
    
    // Playoff endpoints
    @GetMapping("/seasons/{seasonId}/playoffs")
    public ResponseEntity<List<PlayoffBracketDTO>> getSeasonPlayoffs(@PathVariable Long seasonId) {
        // This would need to be implemented in PlayoffService
        return ResponseEntity.ok(List.of());
    }
    
    @GetMapping("/playoffs/{bracketId}/bracket")
    public ResponseEntity<PlayoffBracketDTO> getPlayoffBracket(@PathVariable Long bracketId) {
        PlayoffBracketDTO bracket = playoffService.getBracketById(bracketId);
        return ResponseEntity.ok(bracket);
    }
    
    // Form submission endpoints
    @PostMapping("/forms/submit/complaint")
    public ResponseEntity<FormSubmissionDTO> submitComplaint(@Valid @RequestBody FormSubmissionDTO complaintDTO) {
        complaintDTO.setFormType("COMPLAINT");
        FormSubmissionDTO submission = formSubmissionService.createSubmission(complaintDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(submission);
    }
    
    @PostMapping("/forms/submit/team-signup")
    public ResponseEntity<FormSubmissionDTO> submitTeamSignup(@Valid @RequestBody FormSubmissionDTO signupDTO) {
        signupDTO.setFormType("TEAM_SIGNUP");
        FormSubmissionDTO submission = formSubmissionService.createSubmission(signupDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(submission);
    }
    
    @PostMapping("/forms/submit/inquiry")
    public ResponseEntity<FormSubmissionDTO> submitInquiry(@Valid @RequestBody FormSubmissionDTO inquiryDTO) {
        inquiryDTO.setFormType("GENERAL_INQUIRY");
        FormSubmissionDTO submission = formSubmissionService.createSubmission(inquiryDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(submission);
    }
    
    // ===== MISSING ENDPOINTS THAT FRONTEND EXPECTS =====
    
    // Dashboard endpoint - provides overview data for home page
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        
        try {
            // Get current season
            Season currentSeason = seasonService.getCurrentSeason();
            dashboard.put("currentSeason", currentSeason);
            
            // Get recent games (completed)
            Page<GameDTO> recentGames = gameService.getGames(null, null, true, PageRequest.of(0, 5));
            dashboard.put("recentGames", recentGames.getContent());
            
            // Get upcoming games
            Page<GameDTO> upcomingGames = gameService.getGames(null, null, false, PageRequest.of(0, 5));
            dashboard.put("upcomingGames", upcomingGames.getContent());
            
            // Get teams for current season
            if (currentSeason != null) {
                List<Team> teams = teamService.getTeamsBySeason(currentSeason.getId());
                dashboard.put("teams", teams);
                
                // Get standings
                List<Team> standings = teamService.getStandings(currentSeason.getId());
                dashboard.put("standings", standings);
            }
            
            // Get recent league updates - convert to simple objects to avoid Hibernate proxy serialization issues
            List<LeagueUpdate> updateEntities = leagueUpdateRepository.findByIsPublishedTrueOrderByCreatedAtDesc(PageRequest.of(0, 3)).getContent();
            List<Map<String, Object>> updates = updateEntities.stream().map(update -> {
                Map<String, Object> updateMap = new HashMap<>();
                updateMap.put("id", update.getId());
                updateMap.put("title", update.getTitle());
                updateMap.put("content", update.getPreview()); // Use preview instead of full content
                updateMap.put("updateType", update.getUpdateType());
                updateMap.put("publishedAt", update.getPublishedAt());
                updateMap.put("createdAt", update.getCreatedAt());
                updateMap.put("authorName", update.getAuthorName());
                updateMap.put("seasonName", update.getSeasonName());
                return updateMap;
            }).toList();
            dashboard.put("recentUpdates", updates);
            
        } catch (Exception e) {
            // Return empty dashboard if no current season or other issues
            dashboard.put("currentSeason", null);
            dashboard.put("recentGames", List.of());
            dashboard.put("upcomingGames", List.of());
            dashboard.put("teams", List.of());
            dashboard.put("standings", List.of());
            dashboard.put("recentUpdates", List.of());
        }
        
        return ResponseEntity.ok(dashboard);
    }
    
    // Upcoming games endpoint
    @GetMapping("/games/upcoming")
    public ResponseEntity<Page<GameDTO>> getUpcomingGames(Pageable pageable) {
        Page<GameDTO> upcomingGames = gameService.getGames(null, null, false, pageable);
        return ResponseEntity.ok(upcomingGames);
    }
    
    // Recent results endpoint
    @GetMapping("/games/results")
    public ResponseEntity<Page<GameDTO>> getRecentResults(Pageable pageable) {
        Page<GameDTO> recentResults = gameService.getGames(null, null, true, pageable);
        return ResponseEntity.ok(recentResults);
    }
    
    // Playoff bracket endpoint
    @GetMapping("/bracket")
    public ResponseEntity<PlayoffBracketDTO> getPlayoffBracket() {
        try {
            // Get current season
            Season currentSeason = seasonService.getCurrentSeason();
            if (currentSeason == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Get active bracket for current season
            // For now, we'll return the first bracket we find for the current season
            // You may need to add a method to PlayoffService to get active bracket by season
            Page<PlayoffBracketDTO> brackets = playoffService.getAllBrackets(PageRequest.of(0, 1));
            if (brackets.hasContent()) {
                return ResponseEntity.ok(brackets.getContent().get(0));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // League updates endpoint
    @GetMapping("/updates")
    public ResponseEntity<Page<Map<String, Object>>> getLeagueUpdates(Pageable pageable) {
        // Get published updates and convert to simple objects to avoid Hibernate proxy issues
        Page<LeagueUpdate> updateEntities = leagueUpdateRepository.findByIsPublishedTrueOrderByCreatedAtDesc(pageable);
        
        List<Map<String, Object>> updates = updateEntities.getContent().stream().map(update -> {
            Map<String, Object> updateMap = new HashMap<>();
            updateMap.put("id", update.getId());
            updateMap.put("title", update.getTitle());
            updateMap.put("content", update.getContent());
            updateMap.put("updateType", update.getUpdateType());
            updateMap.put("publishedAt", update.getPublishedAt());
            updateMap.put("createdAt", update.getCreatedAt());
            updateMap.put("isPinned", update.getIsPinned());
            updateMap.put("imageUrl", update.getImageUrl());
            
            // Add author object structure that frontend expects
            Map<String, Object> author = new HashMap<>();
            String authorName = update.getAuthorName();
            if (authorName != null && authorName.contains(" ")) {
                String[] nameParts = authorName.split(" ", 2);
                author.put("firstName", nameParts[0]);
                author.put("lastName", nameParts[1]);
            } else {
                author.put("firstName", authorName);
                author.put("lastName", "");
            }
            updateMap.put("author", author);
            
            // Add season object structure that frontend expects
            Map<String, Object> season = new HashMap<>();
            season.put("name", update.getSeasonName());
            updateMap.put("season", season);
            
            return updateMap;
        }).toList();
        
        Page<Map<String, Object>> result = new PageImpl<>(updates, pageable, updateEntities.getTotalElements());
        return ResponseEntity.ok(result);
    }
    
    // Free agents endpoint
    @GetMapping("/free-agents")
    public ResponseEntity<List<Player>> getFreeAgents() {
        List<Player> freeAgents = playerService.getFreeAgents();
        return ResponseEntity.ok(freeAgents);
    }
    
    // Season history endpoint
    @GetMapping("/seasons/{seasonId}/history")
    public ResponseEntity<Map<String, Object>> getSeasonHistory(@PathVariable Long seasonId) {
        Map<String, Object> history = new HashMap<>();
        
        try {
            // Get season details
            Season season = seasonService.getSeasonById(seasonId);
            history.put("season", season);
            
            // Get all games for the season
            Page<GameDTO> allGames = gameService.getGames(seasonId, null, null, PageRequest.of(0, 1000));
            history.put("games", allGames.getContent());
            
            // Get teams and final standings
            List<Team> teams = teamService.getTeamsBySeason(seasonId);
            history.put("teams", teams);
            
            List<Team> finalStandings = teamService.getStandings(seasonId);
            history.put("finalStandings", finalStandings);
            
            // Get any playoff brackets for this season
            // Note: You may need to add a method to get brackets by season
            // For now, we'll leave this empty
            history.put("playoffBrackets", List.of());
            
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(history);
    }
}