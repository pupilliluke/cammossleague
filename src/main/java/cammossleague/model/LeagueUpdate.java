package cammossleague.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "league_updates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeagueUpdate {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "season_id")
    private Season season;
    
    @NotBlank
    @Column(nullable = false)
    private String title;
    
    @NotBlank
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "update_type")
    @Builder.Default
    private UpdateType updateType = UpdateType.NEWS;
    
    @Column(name = "is_pinned")
    @Builder.Default
    private Boolean isPinned = false;
    
    @Column(name = "is_published")
    @Builder.Default
    private Boolean isPublished = false;
    
    @Column(name = "published_at")
    private LocalDateTime publishedAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_user_id", nullable = false)
    private User author;
    
    @Column(name = "image_url", length = 500)
    private String imageUrl;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum UpdateType {
        NEWS("News"),
        ANNOUNCEMENT("Announcement"),
        SCHEDULE_CHANGE("Schedule Change"),
        PLAYOFF_UPDATE("Playoff Update");
        
        private final String displayName;
        
        UpdateType(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    public String getAuthorName() {
        return author != null ? author.getFullName() : "League Admin";
    }
    
    public String getSeasonName() {
        return season != null ? season.getName() : "General";
    }
    
    public boolean isPublishedAndVisible() {
        return isPublished && publishedAt != null && publishedAt.isBefore(LocalDateTime.now());
    }
    
    public String getPreview() {
        if (content == null || content.length() <= 150) {
            return content;
        }
        return content.substring(0, 150) + "...";
    }
    
    public String getUpdateTypeColor() {
        return switch (updateType) {
            case NEWS -> "blue";
            case ANNOUNCEMENT -> "green";
            case SCHEDULE_CHANGE -> "yellow";
            case PLAYOFF_UPDATE -> "purple";
        };
    }
}