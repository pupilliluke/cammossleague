package cammossleague.dto;

import cammossleague.model.Team;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamDTO {
    private Long id;
    
    @NotNull(message = "Season ID is required")
    private Long seasonId;
    
    @NotBlank(message = "Team name is required")
    private String name;
    
    private String city;
    private String logoUrl;
    private String primaryColor;
    private String secondaryColor;
    private String description;
    
    private Long captainUserId;
    private Long coachUserId;
    
    private Integer wins;
    private Integer losses;
    private Integer pointsFor;
    private Integer pointsAgainst;
    
    private Boolean isActive;
    private Boolean isPlayoffEligible;
    private Integer maxPlayers;
    private String homeColor;
    private String awayColor;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Related data
    private String seasonName;
    private String captainName;
    private String coachName;
    private Integer playerCount;
    private Double winPercentage;
    private Integer pointsDifferential;
    
    public static TeamDTO fromEntity(Team team) {
        if (team == null) return null;
        
        return TeamDTO.builder()
                .id(team.getId())
                .seasonId(team.getSeason().getId())
                .name(team.getName())
                .city(team.getCity())
                .logoUrl(team.getLogoUrl())
                .primaryColor(team.getPrimaryColor())
                .secondaryColor(team.getSecondaryColor())
                .captainUserId(team.getCaptain() != null ? team.getCaptain().getId() : null)
                .coachUserId(team.getCoach() != null ? team.getCoach().getId() : null)
                .wins(team.getWins())
                .losses(team.getLosses())
                .pointsFor(team.getPointsFor())
                .pointsAgainst(team.getPointsAgainst())
                .isActive(team.getIsActive())
                .createdAt(team.getCreatedAt())
                .updatedAt(team.getUpdatedAt())
                .seasonName(team.getSeason().getDisplayName())
                .captainName(team.getCaptain() != null ? team.getCaptain().getDisplayName() : null)
                .coachName(team.getCoach() != null ? team.getCoach().getDisplayName() : null)
                .winPercentage(team.getWinPercentage())
                .pointsDifferential(team.getPointsDifferential())
                .build();
    }
}