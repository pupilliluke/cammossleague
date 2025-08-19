package cammossleague.controller;

import cammossleague.dto.AuthResponse;
import cammossleague.model.Player;
import cammossleague.model.Team;
import cammossleague.model.User;
import cammossleague.repository.PlayerRepository;
import cammossleague.repository.SeasonRepository;
import cammossleague.repository.TeamRepository;
import cammossleague.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/secure")
public class SecureApiController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private TeamRepository teamRepository;
    
    @Autowired
    private PlayerRepository playerRepository;
    
    @Autowired
    private SeasonRepository seasonRepository;
    
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardData(Authentication authentication) {
        Optional<User> currentUser = userService.getCurrentUser();
        if (currentUser.isEmpty()) {
            return ResponseEntity.status(401).build();
        }
        
        User user = currentUser.get();
        
        // Admin users see everything
        if (User.Role.ADMIN.equals(user.getRole())) {
            return getAdminDashboard();
        } else {
            return getUserDashboard(user);
        }
    }
    
    private ResponseEntity<?> getAdminDashboard() {
        // Get current season
        Optional<cammossleague.model.Season> currentSeason = seasonRepository.findByIsActiveTrue();
        if (currentSeason.isEmpty()) {
            return ResponseEntity.badRequest().body("No active season found");
        }
        
        // Get all teams for current season
        List<Team> teams = teamRepository.findBySeasonIdOrderByWinsDesc(currentSeason.get().getId());
        List<Player> players = playerRepository.findBySeasonIdAndIsActiveTrue(currentSeason.get().getId());
        
        return ResponseEntity.ok(new AdminDashboard(
            currentSeason.get(),
            teams,
            players,
            teams.size(),
            players.size(),
            "admin"
        ));
    }
    
    private ResponseEntity<?> getUserDashboard(User user) {
        // Get current season
        Optional<cammossleague.model.Season> currentSeason = seasonRepository.findByIsActiveTrue();
        if (currentSeason.isEmpty()) {
            return ResponseEntity.badRequest().body("No active season found");
        }
        
        // Get user's team and player info
        Optional<Team> userTeam = userService.getCurrentUserTeam();
        Optional<Player> userPlayer = playerRepository.findByUserAndCurrentSeason(user.getId());
        
        // Get league standings (public info)
        List<Team> standings = teamRepository.findBySeasonIdOrderByWinsDesc(currentSeason.get().getId());
        
        return ResponseEntity.ok(new UserDashboard(
            currentSeason.get(),
            userTeam.orElse(null),
            userPlayer.orElse(null),
            standings,
            user.getRole().name().toLowerCase()
        ));
    }
    
    @GetMapping("/teams/{teamId}")
    public ResponseEntity<?> getTeamDetails(@PathVariable Long teamId) {
        if (!userService.hasAccessToTeam(teamId)) {
            return ResponseEntity.status(403).body("Access denied to this team");
        }
        
        Optional<Team> team = teamRepository.findById(teamId);
        if (team.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        List<Player> teamPlayers = playerRepository.findByPlayerTeamsTeamId(teamId);
        
        return ResponseEntity.ok(new TeamDetails(team.get(), teamPlayers));
    }
    
    @GetMapping("/players/{playerId}")
    public ResponseEntity<?> getPlayerDetails(@PathVariable Long playerId) {
        if (!userService.hasAccessToPlayer(playerId)) {
            return ResponseEntity.status(403).body("Access denied to this player");
        }
        
        return playerRepository.findById(playerId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/my-team")
    public ResponseEntity<?> getMyTeam() {
        Optional<Team> userTeam = userService.getCurrentUserTeam();
        if (userTeam.isEmpty()) {
            return ResponseEntity.badRequest().body("User is not on a team");
        }
        
        List<Player> teamPlayers = playerRepository.findByPlayerTeamsTeamId(userTeam.get().getId());
        
        return ResponseEntity.ok(new TeamDetails(userTeam.get(), teamPlayers));
    }
    
    // DTOs for responses
    public static class AdminDashboard {
        public cammossleague.model.Season currentSeason;
        public List<Team> teams;
        public List<Player> players;
        public int totalTeams;
        public int totalPlayers;
        public String userType;
        
        public AdminDashboard(cammossleague.model.Season currentSeason, List<Team> teams, List<Player> players, 
                              int totalTeams, int totalPlayers, String userType) {
            this.currentSeason = currentSeason;
            this.teams = teams;
            this.players = players;
            this.totalTeams = totalTeams;
            this.totalPlayers = totalPlayers;
            this.userType = userType;
        }
    }
    
    public static class UserDashboard {
        public cammossleague.model.Season currentSeason;
        public Team myTeam;
        public Player myPlayer;
        public List<Team> standings;
        public String userType;
        
        public UserDashboard(cammossleague.model.Season currentSeason, Team myTeam, Player myPlayer, 
                             List<Team> standings, String userType) {
            this.currentSeason = currentSeason;
            this.myTeam = myTeam;
            this.myPlayer = myPlayer;
            this.standings = standings;
            this.userType = userType;
        }
    }
    
    public static class TeamDetails {
        public Team team;
        public List<Player> players;
        
        public TeamDetails(Team team, List<Player> players) {
            this.team = team;
            this.players = players;
        }
    }
}