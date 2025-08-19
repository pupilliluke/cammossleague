package cammossleague.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "player_teams")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayerTeam {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player_id", nullable = false)
    @JsonIgnore
    private Player player;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    @JsonIgnore
    private Team team;
    
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.PENDING;
    
    @CreationTimestamp
    @Column(name = "requested_at")
    private LocalDateTime requestedAt;
    
    @Column(name = "approved_at")
    private LocalDateTime approvedAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by_user_id")
    @JsonIgnore
    private User approvedBy;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    public enum Status {
        PENDING, ACTIVE, DECLINED, RELEASED
    }
    
    public String getDisplayStatus() {
        return status.toString().toLowerCase().replace("_", " ");
    }
    
    public boolean isActive() {
        return status == Status.ACTIVE;
    }
    
    public boolean isPending() {
        return status == Status.PENDING;
    }
}