package cammossleague.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "players")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class Player extends BaseEntity {
    
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "season_id", nullable = false)
    @JsonIgnore
    private Season season;
    
    @Column(name = "jersey_number")
    private Integer jerseyNumber;
    
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Position position = Position.UTIL;
    
    @Column(name = "height_inches")
    private Integer heightInches;
    
    @Column(name = "weight_lbs")
    private Integer weightLbs;
    
    @Column(name = "years_experience")
    @Builder.Default
    private Integer yearsExperience = 0;
    
    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;
    
    @Column(name = "stats_games_played")
    @Builder.Default
    private Integer statsGamesPlayed = 0;
    
    @Column(name = "stats_points")
    @Builder.Default
    private Integer statsPoints = 0;
    
    @Column(name = "stats_rebounds")
    @Builder.Default
    private Integer statsRebounds = 0;
    
    @Column(name = "stats_assists")
    @Builder.Default
    private Integer statsAssists = 0;
    
    
    @OneToMany(mappedBy = "player", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private List<PlayerTeam> playerTeams;
    
    public enum Position {
        PG("Point Guard"),
        SG("Shooting Guard"), 
        SF("Small Forward"),
        PF("Power Forward"),
        C("Center"),
        UTIL("Utility");
        
        private final String displayName;
        
        Position(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    public String getDisplayName() {
        return user != null ? user.getFullName() : "Unknown Player";
    }
    
    public String getHeightDisplay() {
        if (heightInches == null) return null;
        int feet = heightInches / 12;
        int inches = heightInches % 12;
        return feet + "'" + inches + "\"";
    }
    
    public Double getPointsPerGame() {
        if (statsGamesPlayed == null || statsGamesPlayed == 0 || statsPoints == null) {
            return 0.0;
        }
        return (double) statsPoints / statsGamesPlayed;
    }
    
    public Double getReboundsPerGame() {
        if (statsGamesPlayed == null || statsGamesPlayed == 0 || statsRebounds == null) {
            return 0.0;
        }
        return (double) statsRebounds / statsGamesPlayed;
    }
    
    public Double getAssistsPerGame() {
        if (statsGamesPlayed == null || statsGamesPlayed == 0 || statsAssists == null) {
            return 0.0;
        }
        return (double) statsAssists / statsGamesPlayed;
    }
}

