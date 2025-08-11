package cammossleague.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "seasons")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Season {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(nullable = false, length = 100)
    private String name;
    
    @NotNull
    @Column(name = "year", nullable = false)
    private Integer year;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "season_type", nullable = false)
    private SeasonType seasonType;
    
    @NotNull
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;
    
    @NotNull
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;
    
    @Column(name = "registration_open_date")
    private LocalDate registrationOpenDate;
    
    @Column(name = "registration_close_date")
    private LocalDate registrationCloseDate;
    
    @Column(name = "playoff_start_date")
    private LocalDate playoffStartDate;
    
    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = false;
    
    @Column(name = "is_registration_open")
    @Builder.Default
    private Boolean isRegistrationOpen = false;
    
    @Column(name = "max_teams")
    @Builder.Default
    private Integer maxTeams = 16;
    
    @Column(name = "max_players_per_team")
    @Builder.Default
    private Integer maxPlayersPerTeam = 12;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "rules_url", length = 500)
    private String rulesUrl;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "season", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private List<Team> teams;
    
    @OneToMany(mappedBy = "season", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private List<Player> players;
    
    @OneToMany(mappedBy = "season", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private List<Game> games;
    
    @OneToMany(mappedBy = "season", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private List<LeagueUpdate> leagueUpdates;
    
    public enum SeasonType {
        SUMMER, FALL, WINTER, SPRING
    }
    
    public String getDisplayName() {
        return name + " (" + year + ")";
    }
    
    public boolean isRegistrationOpen() {
        if (!isRegistrationOpen) return false;
        
        LocalDate now = LocalDate.now();
        if (registrationOpenDate != null && now.isBefore(registrationOpenDate)) {
            return false;
        }
        if (registrationCloseDate != null && now.isAfter(registrationCloseDate)) {
            return false;
        }
        return true;
    }
}
 