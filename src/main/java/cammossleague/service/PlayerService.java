package cammossleague.service;

import cammossleague.model.Player;
import cammossleague.model.PlayerTeam;
import cammossleague.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PlayerService {
    
    private final PlayerRepository playerRepository;
    
    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }
    
    public Optional<Player> getPlayerById(Long id) {
        return playerRepository.findById(id);
    }
    
    public List<Player> getPlayersBySeason(Long seasonId) {
        return playerRepository.findBySeasonId(seasonId);
    }
    
    public List<Player> getPlayersByTeam(Long teamId) {
        return playerRepository.findByPlayerTeamsTeamId(teamId);
    }
    
    public List<Player> getPlayersByTeamAndSeason(Long teamId, Long seasonId) {
        return playerRepository.findByPlayerTeamsTeamIdAndSeasonId(teamId, seasonId);
    }
    
    public List<Player> getFreeAgents() {
        return playerRepository.findByUserIsFreeAgentTrue();
    }
    
    public List<Player> getActivePlayersInSeason(Long seasonId) {
        return playerRepository.findBySeasonIdAndIsActiveTrue(seasonId);
    }
    
    public List<Player> getPlayersByYear(Integer year) {
        return playerRepository.findBySeasonYear(year);
    }
    
    @Transactional
    public Player savePlayer(Player player) {
        return playerRepository.save(player);
    }
    
    @Transactional
    public void deletePlayer(Long id) {
        playerRepository.deleteById(id);
    }
    
    public Map<String, Object> getPlayerTeamHistory(Long playerId) {
        Optional<Player> playerOpt = playerRepository.findById(playerId);
        if (playerOpt.isEmpty()) {
            return Map.of("error", "Player not found");
        }
        
        Player player = playerOpt.get();
        Long userId = player.getUser().getId();
        
        // Get all Player records for this user across all seasons
        List<Player> allPlayerSeasons = playerRepository.findByUserIdOrderBySeasonYearDesc(userId);
        
        // Build team history with season information
        List<Map<String, Object>> teamHistory = allPlayerSeasons.stream()
            .flatMap(p -> p.getPlayerTeams().stream()
                .filter(pt -> pt.getStatus() == PlayerTeam.Status.ACTIVE)
                .map(pt -> {
                    Map<String, Object> entry = new LinkedHashMap<>();
                    entry.put("seasonName", p.getSeason().getName());
                    entry.put("seasonYear", p.getSeason().getYear());
                    entry.put("teamId", pt.getTeam().getId());
                    entry.put("teamName", pt.getTeam().getName());
                    entry.put("teamDisplayName", pt.getTeam().getDisplayName());
                    entry.put("teamCity", pt.getTeam().getCity());
                    entry.put("jerseyNumber", p.getJerseyNumber());
                    entry.put("position", p.getPosition().getDisplayName());
                    entry.put("wins", pt.getTeam().getWins());
                    entry.put("losses", pt.getTeam().getLosses());
                    entry.put("isCurrentSeason", p.getSeason().getIsActive());
                    return entry;
                })
            )
            .collect(Collectors.toList());
        
        return Map.of(
            "playerId", playerId,
            "playerName", player.getDisplayName(),
            "teamHistory", teamHistory,
            "totalSeasons", allPlayerSeasons.size(),
            "teamsPlayed", teamHistory.size()
        );
    }
}