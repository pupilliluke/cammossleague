package cammossleague.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "playoff_brackets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class PlayoffBracket {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "season_id", nullable = false)
    private Season season;
    
    @NotNull
    @Column(name = "bracket_name", nullable = false)
    private String bracketName;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "bracket_type")
    @Builder.Default
    private BracketType bracketType = BracketType.SINGLE_ELIMINATION;
    
    @Column(name = "max_teams")
    @Builder.Default
    private Integer maxTeams = 8;
    
    @Column(name = "current_round")
    @Builder.Default
    private Integer currentRound = 1;
    
    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = false;
    
    @Column(name = "is_completed")
    @Builder.Default
    private Boolean isCompleted = false;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "bracket", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<PlayoffMatch> matches;
    
    public enum BracketType {
        SINGLE_ELIMINATION("Single Elimination"),
        DOUBLE_ELIMINATION("Double Elimination");
        
        private final String displayName;
        
        BracketType(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    public String getDisplayName() {
        return bracketName + " - " + season.getDisplayName();
    }
}