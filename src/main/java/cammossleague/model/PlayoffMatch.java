package cammossleague.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "playoff_matches")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class PlayoffMatch {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "bracket_id", nullable = false)
    private PlayoffBracket bracket;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "game_id")
    private Game game;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "team1_id")
    private Team team1;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "team2_id")
    private Team team2;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "winner_id")
    private Team winner;
    
    @Column(name = "round_number", nullable = false)
    private Integer roundNumber;
    
    @Column(name = "match_number", nullable = false)
    private Integer matchNumber;
    
    @Column(name = "position_in_round", nullable = false)
    private Integer positionInRound;
    
    @Column(name = "is_completed")
    @Builder.Default
    private Boolean isCompleted = false;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public String getDisplayName() {
        String team1Name = team1 != null ? team1.getName() : "TBD";
        String team2Name = team2 != null ? team2.getName() : "TBD";
        return "Round " + roundNumber + ": " + team1Name + " vs " + team2Name;
    }
    
    public boolean canAdvanceWinner() {
        return isCompleted && winner != null;
    }
}