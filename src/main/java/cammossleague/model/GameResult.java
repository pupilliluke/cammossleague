package cammossleague.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "game_results")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameResult {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;
    
    @Column(name = "home_team_score", nullable = false)
    @Builder.Default
    private Integer homeTeamScore = 0;
    
    @Column(name = "away_team_score", nullable = false)
    @Builder.Default
    private Integer awayTeamScore = 0;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "winning_team_id")
    private Team winningTeam;
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean overtime = false;
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean forfeit = false;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "forfeit_team_id")
    private Team forfeitTeam;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_by_user_id")
    private User reportedBy;
    
    @CreationTimestamp
    @Column(name = "reported_at")
    private LocalDateTime reportedAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "verified_by_user_id")
    private User verifiedBy;
    
    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    public String getScoreDisplay() {
        return awayTeamScore + " - " + homeTeamScore;
    }
    
    public String getDetailedScoreDisplay() {
        StringBuilder display = new StringBuilder();
        display.append(game.getAwayTeam().getName()).append(" ")
               .append(awayTeamScore).append(" - ")
               .append(homeTeamScore).append(" ")
               .append(game.getHomeTeam().getName());
        
        if (overtime) {
            display.append(" (OT)");
        }
        if (forfeit) {
            display.append(" (Forfeit)");
        }
        return display.toString();
    }
    
    public Team getLosingTeam() {
        if (winningTeam == null) return null;
        return winningTeam.equals(game.getHomeTeam()) ? game.getAwayTeam() : game.getHomeTeam();
    }
    
    public Integer getWinningScore() {
        if (winningTeam == null) return null;
        return winningTeam.equals(game.getHomeTeam()) ? homeTeamScore : awayTeamScore;
    }
    
    public Integer getLosingScore() {
        if (winningTeam == null) return null;
        return winningTeam.equals(game.getHomeTeam()) ? awayTeamScore : homeTeamScore;
    }
    
    public boolean isVerified() {
        return verifiedAt != null && verifiedBy != null;
    }
    
    public boolean isTie() {
        return homeTeamScore.equals(awayTeamScore);
    }
    
    public Integer getScoreDifference() {
        return Math.abs(homeTeamScore - awayTeamScore);
    }
}