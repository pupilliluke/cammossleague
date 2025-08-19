package cammossleague.dto;

import cammossleague.model.Game;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameDTO {
    private Long id;
    
    @NotNull(message = "Season ID is required")
    private Long seasonId;
    
    @NotNull(message = "Home team ID is required")
    private Long homeTeamId;
    
    @NotNull(message = "Away team ID is required")
    private Long awayTeamId;
    
    @NotNull(message = "Game date is required")
    private LocalDate gameDate;
    
    @NotNull(message = "Game time is required")
    private LocalTime gameTime;
    
    private String location;
    private String courtNumber;
    private String gameType;
    private Integer weekNumber;
    private Boolean isCompleted;
    private Integer homeScore;
    private Integer awayScore;
    private String notes;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Related data
    private String seasonName;
    private String homeTeamName;
    private String awayTeamName;
    private String displayName;
    
    public static GameDTO fromEntity(Game game) {
        if (game == null) return null;
        
        return GameDTO.builder()
                .id(game.getId())
                .seasonId(game.getSeason().getId())
                .homeTeamId(game.getHomeTeam().getId())
                .awayTeamId(game.getAwayTeam().getId())
                .gameDate(game.getGameDate())
                .gameTime(game.getGameTime())
                .location(game.getLocation())
                .courtNumber(game.getCourtNumber())
                .gameType(game.getGameType().name())
                .weekNumber(game.getWeekNumber())
                .isCompleted(game.getIsCompleted())
                .homeScore(game.getHomeScore())
                .awayScore(game.getAwayScore())
                .notes(game.getNotes())
                .createdAt(game.getCreatedAt())
                .updatedAt(game.getUpdatedAt())
                .seasonName(game.getSeason().getDisplayName())
                .homeTeamName(game.getHomeTeam().getName())
                .awayTeamName(game.getAwayTeam().getName())
                .displayName(game.getDisplayName())
                .build();
    }
}