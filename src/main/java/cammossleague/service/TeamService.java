package cammossleague.service;

import cammossleague.dto.TeamDTO;
import cammossleague.model.Team;
import cammossleague.model.Season;
import cammossleague.model.User;
import cammossleague.repository.TeamRepository;
import cammossleague.repository.SeasonRepository;
import cammossleague.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TeamService {
    
    private final TeamRepository teamRepository;
    private final SeasonRepository seasonRepository;
    private final UserRepository userRepository;
    
    public List<Team> getTeamsBySeason(Long seasonId) {
        return teamRepository.findBySeasonIdAndIsActiveTrue(seasonId);
    }
    
    public Team getTeamById(Long id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found with id: " + id));
    }
    
    public List<Team> getStandings(Long seasonId) {
        List<Team> teams = teamRepository.findBySeasonIdAndIsActiveTrue(seasonId);
        
        // Sort by wins (desc), then by point differential (desc), then by points for (desc)
        return teams.stream()
                .sorted(Comparator
                        .comparingInt(Team::getWins).reversed()
                        .thenComparing((Team t) -> t.getPointsFor() - t.getPointsAgainst(), Comparator.reverseOrder())
                        .thenComparingInt(Team::getPointsFor).reversed())
                .collect(Collectors.toList());
    }
    
    public List<Team> getAllTeams() {
        return teamRepository.findByIsActiveTrueOrderByName();
    }
    
    // ===== ADMIN METHODS =====
    
    public Page<Team> getTeamsWithFilters(Long seasonId, Boolean isActive, String search, Pageable pageable) {
        Specification<Team> spec = buildTeamFiltersSpecification(seasonId, isActive, search);
        return spec == null ? teamRepository.findAll(pageable) : teamRepository.findAll(spec, pageable);
    }
    
    public List<Team> getAllTeamsWithFilters(Long seasonId, Boolean isActive, String search) {
        Specification<Team> spec = buildTeamFiltersSpecification(seasonId, isActive, search);
        return spec == null ? teamRepository.findAll() : teamRepository.findAll(spec);
    }
    
    private Specification<Team> buildTeamFiltersSpecification(Long seasonId, Boolean isActive, String search) {
        Specification<Team> spec = null;
        
        if (seasonId != null) {
            Specification<Team> seasonSpec = (root, query, cb) -> cb.equal(root.get("season").get("id"), seasonId);
            spec = spec == null ? seasonSpec : spec.and(seasonSpec);
        }
        
        if (isActive != null) {
            Specification<Team> activeSpec = (root, query, cb) -> cb.equal(root.get("isActive"), isActive);
            spec = spec == null ? activeSpec : spec.and(activeSpec);
        }
        
        if (search != null && !search.trim().isEmpty()) {
            Specification<Team> searchSpec = (root, query, cb) -> 
                cb.or(
                    cb.like(cb.lower(root.get("name")), "%" + search.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("city")), "%" + search.toLowerCase() + "%")
                );
            spec = spec == null ? searchSpec : spec.and(searchSpec);
        }
        
        return spec;
    }
    
    @Transactional
    public Team createTeam(TeamDTO teamDTO) {
        Season season = seasonRepository.findById(teamDTO.getSeasonId())
                .orElseThrow(() -> new RuntimeException("Season not found with id: " + teamDTO.getSeasonId()));
        
        Team team = Team.builder()
                .season(season)
                .name(teamDTO.getName())
                .city(teamDTO.getCity())
                .logoUrl(teamDTO.getLogoUrl())
                .primaryColor(teamDTO.getPrimaryColor())
                .secondaryColor(teamDTO.getSecondaryColor())
                .wins(teamDTO.getWins() != null ? teamDTO.getWins() : 0)
                .losses(teamDTO.getLosses() != null ? teamDTO.getLosses() : 0)
                .pointsFor(teamDTO.getPointsFor() != null ? teamDTO.getPointsFor() : 0)
                .pointsAgainst(teamDTO.getPointsAgainst() != null ? teamDTO.getPointsAgainst() : 0)
                .isActive(teamDTO.getIsActive() != null ? teamDTO.getIsActive() : true)
                .build();
        
        if (teamDTO.getCaptainUserId() != null) {
            User captain = userRepository.findById(teamDTO.getCaptainUserId())
                    .orElseThrow(() -> new RuntimeException("Captain user not found"));
            team.setCaptain(captain);
        }
        
        if (teamDTO.getCoachUserId() != null) {
            User coach = userRepository.findById(teamDTO.getCoachUserId())
                    .orElseThrow(() -> new RuntimeException("Coach user not found"));
            team.setCoach(coach);
        }
        
        return teamRepository.save(team);
    }
    
    @Transactional
    public Team updateTeam(Long id, TeamDTO teamDTO) {
        Team team = getTeamById(id);
        
        if (teamDTO.getName() != null) {
            team.setName(teamDTO.getName());
        }
        if (teamDTO.getCity() != null) {
            team.setCity(teamDTO.getCity());
        }
        if (teamDTO.getLogoUrl() != null) {
            team.setLogoUrl(teamDTO.getLogoUrl());
        }
        if (teamDTO.getPrimaryColor() != null) {
            team.setPrimaryColor(teamDTO.getPrimaryColor());
        }
        if (teamDTO.getSecondaryColor() != null) {
            team.setSecondaryColor(teamDTO.getSecondaryColor());
        }
        if (teamDTO.getWins() != null) {
            team.setWins(teamDTO.getWins());
        }
        if (teamDTO.getLosses() != null) {
            team.setLosses(teamDTO.getLosses());
        }
        if (teamDTO.getPointsFor() != null) {
            team.setPointsFor(teamDTO.getPointsFor());
        }
        if (teamDTO.getPointsAgainst() != null) {
            team.setPointsAgainst(teamDTO.getPointsAgainst());
        }
        if (teamDTO.getIsActive() != null) {
            team.setIsActive(teamDTO.getIsActive());
        }
        
        if (teamDTO.getCaptainUserId() != null) {
            User captain = userRepository.findById(teamDTO.getCaptainUserId())
                    .orElseThrow(() -> new RuntimeException("Captain user not found"));
            team.setCaptain(captain);
        }
        
        if (teamDTO.getCoachUserId() != null) {
            User coach = userRepository.findById(teamDTO.getCoachUserId())
                    .orElseThrow(() -> new RuntimeException("Coach user not found"));
            team.setCoach(coach);
        }
        
        return teamRepository.save(team);
    }
    
    @Transactional
    public void deleteTeam(Long id) {
        Team team = getTeamById(id);
        teamRepository.delete(team);
    }
    
    @Transactional
    public Team updateTeamRecord(Long id, Integer wins, Integer losses, Integer pointsFor, Integer pointsAgainst) {
        Team team = getTeamById(id);
        
        if (wins != null) {
            team.setWins(wins);
        }
        if (losses != null) {
            team.setLosses(losses);
        }
        if (pointsFor != null) {
            team.setPointsFor(pointsFor);
        }
        if (pointsAgainst != null) {
            team.setPointsAgainst(pointsAgainst);
        }
        
        return teamRepository.save(team);
    }
    
    @Transactional
    public Team updateTeamStatus(Long id, Boolean isActive, Boolean isPlayoffEligible) {
        Team team = getTeamById(id);
        
        if (isActive != null) {
            team.setIsActive(isActive);
        }
        // Note: isPlayoffEligible would need to be added to Team model if needed
        
        return teamRepository.save(team);
    }
    
    @Transactional
    public Team resetTeamRecord(Long id) {
        Team team = getTeamById(id);
        team.setWins(0);
        team.setLosses(0);
        team.setPointsFor(0);
        team.setPointsAgainst(0);
        return teamRepository.save(team);
    }
    
    @Transactional
    public List<Team> createBulkTeams(Long seasonId, List<String> teamNames) {
        Season season = seasonRepository.findById(seasonId)
                .orElseThrow(() -> new RuntimeException("Season not found with id: " + seasonId));
        
        List<Team> teams = new ArrayList<>();
        for (String teamName : teamNames) {
            Team team = Team.builder()
                    .season(season)
                    .name(teamName)
                    .wins(0)
                    .losses(0)
                    .pointsFor(0)
                    .pointsAgainst(0)
                    .isActive(true)
                    .build();
            teams.add(teamRepository.save(team));
        }
        
        return teams;
    }
    
    @Transactional
    public void addPlayerToTeam(Long teamId, Long playerId) {
        // This would need PlayerTeam entity management
        // Implementation depends on your player-team relationship structure
        throw new RuntimeException("Player-team management not yet implemented");
    }
    
    @Transactional
    public void removePlayerFromTeam(Long teamId, Long playerId) {
        // This would need PlayerTeam entity management
        // Implementation depends on your player-team relationship structure
        throw new RuntimeException("Player-team management not yet implemented");
    }
    
    @Transactional
    public void resetTeamSequence() {
        // Reset PostgreSQL sequence to match the max ID
        teamRepository.resetSequence();
    }
}