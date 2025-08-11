package cammossleague.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "teams")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Team extends BaseEntity {
    
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "season_id", nullable = false)
    @JsonIgnore
    private Season season;
    
    @NotBlank
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(length = 100)
    private String city;
    
    @Column(name = "logo_url", length = 500)
    private String logoUrl;
    
    @Column(name = "primary_color", length = 7)
    private String primaryColor;
    
    @Column(name = "secondary_color", length = 7)
    private String secondaryColor;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "captain_user_id")
    @JsonIgnore
    private User captain;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coach_user_id")
    @JsonIgnore
    private User coach;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer wins = 0;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer losses = 0;
    
    @Column(name = "points_for", nullable = false)
    @Builder.Default
    private Integer pointsFor = 0;
    
    @Column(name = "points_against", nullable = false)
    @Builder.Default
    private Integer pointsAgainst = 0;
    
    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
    
    
    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private List<PlayerTeam> playerTeams;
    
    @OneToMany(mappedBy = "homeTeam", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private List<Game> homeGames;
    
    @OneToMany(mappedBy = "awayTeam", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private List<Game> awayGames;
    
    public String getDisplayName() {
        return name;
    }
    
    public Double getWinPercentage() {
        int totalGames = wins + losses;
        if (totalGames == 0) return 0.0;
        return (double) wins / totalGames;
    }
    
    public Integer getPointsDifferential() {
        return pointsFor - pointsAgainst;
    }
}
