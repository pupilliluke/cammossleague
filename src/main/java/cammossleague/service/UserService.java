package cammossleague.service;

import cammossleague.model.Player;
import cammossleague.model.Team;
import cammossleague.model.User;
import cammossleague.repository.PlayerRepository;
import cammossleague.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PlayerRepository playerRepository;
    
    public Optional<User> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }
        
        String username = authentication.getName();
        return userRepository.findByUsername(username);
    }
    
    public boolean isAdmin() {
        return getCurrentUser()
                .map(user -> User.Role.ADMIN.equals(user.getRole()))
                .orElse(false);
    }
    
    public boolean isUserOrAdmin(Long userId) {
        Optional<User> currentUser = getCurrentUser();
        if (currentUser.isEmpty()) {
            return false;
        }
        
        User user = currentUser.get();
        return User.Role.ADMIN.equals(user.getRole()) || user.getId().equals(userId);
    }
    
    public Optional<Team> getCurrentUserTeam() {
        Optional<User> currentUser = getCurrentUser();
        if (currentUser.isEmpty()) {
            return Optional.empty();
        }
        
        // Find current player record for active season
        Optional<Player> player = playerRepository.findByUserAndCurrentSeason(currentUser.get().getId());
        if (player.isEmpty()) {
            return Optional.empty();
        }
        
        // Find active team from player-team relationships
        return player.get().getPlayerTeams().stream()
                .filter(pt -> "ACTIVE".equals(pt.getStatus().name()))
                .findFirst()
                .map(pt -> pt.getTeam());
    }
    
    public boolean hasAccessToTeam(Long teamId) {
        if (isAdmin()) {
            return true;
        }
        
        Optional<Team> userTeam = getCurrentUserTeam();
        return userTeam.map(team -> team.getId().equals(teamId)).orElse(false);
    }
    
    public boolean hasAccessToPlayer(Long playerId) {
        if (isAdmin()) {
            return true;
        }
        
        Optional<User> currentUser = getCurrentUser();
        if (currentUser.isEmpty()) {
            return false;
        }
        
        // Check if this is their own player record
        Optional<Player> player = playerRepository.findById(playerId);
        if (player.isPresent() && player.get().getUser().getId().equals(currentUser.get().getId())) {
            return true;
        }
        
        // Check if player is on their team
        Optional<Team> userTeam = getCurrentUserTeam();
        if (userTeam.isEmpty()) {
            return false;
        }
        
        return player.map(p -> p.getPlayerTeams().stream()
                .anyMatch(pt -> "ACTIVE".equals(pt.getStatus().name()) && 
                               pt.getTeam().getId().equals(userTeam.get().getId())))
                .orElse(false);
    }
}