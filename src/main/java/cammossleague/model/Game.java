package cammossleague.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "games")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Game {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "season_id", nullable = false)
    private Season season;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "home_team_id", nullable = false)
    private Team homeTeam;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "away_team_id", nullable = false)
    private Team awayTeam;
    
    @Column(name = "game_date", nullable = false)
    private LocalDate gameDate;
    
    @Column(name = "game_time", nullable = false)
    private LocalTime gameTime;
    
    private String location;
    
    @Column(name = "court_number", length = 10)
    private String courtNumber;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "game_type")
    @Builder.Default
    private GameType gameType = GameType.REGULAR;
    
    @Column(name = "week_number")
    private Integer weekNumber;
    
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
    
    @Column(name = "home_score")
    private Integer homeScore;
    
    @Column(name = "away_score")
    private Integer awayScore;
    
    public enum GameType {
        REGULAR("Regular Season"),
        PLAYOFF("Playoff"),
        CHAMPIONSHIP("Championship");
        
        private final String displayName;
        
        GameType(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    public String getDisplayName() {
        return awayTeam.getName() + " @ " + homeTeam.getName();
    }
    
    public LocalDateTime getGameDateTime() {
        return LocalDateTime.of(gameDate, gameTime);
    }
    
    public String getLocationDisplay() {
        if (location == null) return "";
        if (courtNumber != null && !courtNumber.trim().isEmpty()) {
            return location + " - " + courtNumber;
        }
        return location;
    }
    
    public boolean hasResult() {
        return homeScore != null && awayScore != null;
    }
    
    public boolean isPastGame() {
        return LocalDateTime.now().isAfter(getGameDateTime());
    }
    
    public boolean isUpcomingGame() {
        return LocalDateTime.now().isBefore(getGameDateTime());
    }
}