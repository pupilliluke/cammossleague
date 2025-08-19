package cammossleague.dto;

import cammossleague.model.PlayoffMatch;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayoffMatchDTO {
    private Long id;
    
    @NotNull(message = "Bracket ID is required")
    private Long bracketId;
    
    private Long gameId;
    private Long team1Id;
    private Long team2Id;
    private Long winnerId;
    
    @NotNull(message = "Round number is required")
    @Min(value = 1, message = "Round number must be at least 1")
    private Integer roundNumber;
    
    @NotNull(message = "Match number is required")
    @Min(value = 1, message = "Match number must be at least 1")
    private Integer matchNumber;
    
    @NotNull(message = "Position in round is required")
    @Min(value = 1, message = "Position in round must be at least 1")
    private Integer positionInRound;
    
    private Boolean isCompleted;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Related data
    private String team1Name;
    private String team2Name;
    private String winnerName;
    private GameDTO game;
    
    public static PlayoffMatchDTO fromEntity(PlayoffMatch match) {
        if (match == null) return null;
        
        PlayoffMatchDTO.PlayoffMatchDTOBuilder builder = PlayoffMatchDTO.builder()
                .id(match.getId())
                .bracketId(match.getBracket().getId())
                .gameId(match.getGame() != null ? match.getGame().getId() : null)
                .team1Id(match.getTeam1() != null ? match.getTeam1().getId() : null)
                .team2Id(match.getTeam2() != null ? match.getTeam2().getId() : null)
                .winnerId(match.getWinner() != null ? match.getWinner().getId() : null)
                .roundNumber(match.getRoundNumber())
                .matchNumber(match.getMatchNumber())
                .positionInRound(match.getPositionInRound())
                .isCompleted(match.getIsCompleted())
                .notes(match.getNotes())
                .createdAt(match.getCreatedAt())
                .updatedAt(match.getUpdatedAt())
                .team1Name(match.getTeam1() != null ? match.getTeam1().getName() : "TBD")
                .team2Name(match.getTeam2() != null ? match.getTeam2().getName() : "TBD")
                .winnerName(match.getWinner() != null ? match.getWinner().getName() : null);
        
        if (match.getGame() != null) {
            builder.game(GameDTO.fromEntity(match.getGame()));
        }
        
        return builder.build();
    }
}