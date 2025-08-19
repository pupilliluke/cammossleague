package cammossleague.dto;

import cammossleague.model.PlayoffBracket;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayoffBracketDTO {
    private Long id;
    
    @NotNull(message = "Season ID is required")
    private Long seasonId;
    
    @NotBlank(message = "Bracket name is required")
    private String bracketName;
    
    private String bracketType;
    
    @Min(value = 2, message = "Max teams must be at least 2")
    private Integer maxTeams;
    
    private Integer currentRound;
    private Boolean isActive;
    private Boolean isCompleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Related data
    private String seasonName;
    private List<PlayoffMatchDTO> matches;
    
    public static PlayoffBracketDTO fromEntity(PlayoffBracket bracket) {
        if (bracket == null) return null;
        
        return PlayoffBracketDTO.builder()
                .id(bracket.getId())
                .seasonId(bracket.getSeason().getId())
                .seasonName(bracket.getSeason().getDisplayName())
                .bracketName(bracket.getBracketName())
                .bracketType(bracket.getBracketType().name())
                .maxTeams(bracket.getMaxTeams())
                .currentRound(bracket.getCurrentRound())
                .isActive(bracket.getIsActive())
                .isCompleted(bracket.getIsCompleted())
                .createdAt(bracket.getCreatedAt())
                .updatedAt(bracket.getUpdatedAt())
                .build();
    }
}