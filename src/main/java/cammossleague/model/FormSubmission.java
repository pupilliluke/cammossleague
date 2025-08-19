package cammossleague.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "form_submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class FormSubmission {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "form_type", nullable = false)
    private FormType formType;
    
    @NotBlank
    @Column(name = "submitter_name", nullable = false)
    private String submitterName;
    
    @Email
    @Column(name = "submitter_email", nullable = false)
    private String submitterEmail;
    
    @Column(name = "submitter_phone")
    private String submitterPhone;
    
    @NotBlank
    @Column(name = "subject", nullable = false)
    private String subject;
    
    @NotBlank
    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    @Builder.Default
    private SubmissionStatus status = SubmissionStatus.PENDING;
    
    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_to_user_id")
    private User assignedTo;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "season_id")
    private Season season;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
    
    public enum FormType {
        COMPLAINT("Complaint"),
        TEAM_SIGNUP("Team Signup Application"),
        PLAYER_REGISTRATION("Player Registration"),
        GENERAL_INQUIRY("General Inquiry");
        
        private final String displayName;
        
        FormType(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    public enum SubmissionStatus {
        PENDING("Pending Review"),
        IN_REVIEW("In Review"),
        APPROVED("Approved"),
        REJECTED("Rejected"),
        RESOLVED("Resolved"),
        CLOSED("Closed");
        
        private final String displayName;
        
        SubmissionStatus(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    public String getDisplayName() {
        return formType.getDisplayName() + " - " + subject;
    }
    
    public boolean isPending() {
        return status == SubmissionStatus.PENDING;
    }
    
    public boolean isResolved() {
        return status == SubmissionStatus.RESOLVED || status == SubmissionStatus.CLOSED;
    }
}