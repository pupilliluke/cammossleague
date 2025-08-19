package cammossleague.dto;

import cammossleague.model.FormSubmission;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FormSubmissionDTO {
    private Long id;
    
    @NotNull(message = "Form type is required")
    private String formType;
    
    @NotBlank(message = "Submitter name is required")
    private String submitterName;
    
    @Email(message = "Valid email is required")
    @NotBlank(message = "Submitter email is required")
    private String submitterEmail;
    
    private String submitterPhone;
    
    @NotBlank(message = "Subject is required")
    private String subject;
    
    @NotBlank(message = "Message is required")
    private String message;
    
    private String status;
    private String adminNotes;
    private Long assignedToUserId;
    private Long seasonId;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    
    // Related data
    private String assignedToUserName;
    private String seasonName;
    
    public static FormSubmissionDTO fromEntity(FormSubmission submission) {
        if (submission == null) return null;
        
        FormSubmissionDTO.FormSubmissionDTOBuilder builder = FormSubmissionDTO.builder()
                .id(submission.getId())
                .formType(submission.getFormType().name())
                .submitterName(submission.getSubmitterName())
                .submitterEmail(submission.getSubmitterEmail())
                .submitterPhone(submission.getSubmitterPhone())
                .subject(submission.getSubject())
                .message(submission.getMessage())
                .status(submission.getStatus().name())
                .adminNotes(submission.getAdminNotes())
                .assignedToUserId(submission.getAssignedTo() != null ? submission.getAssignedTo().getId() : null)
                .seasonId(submission.getSeason() != null ? submission.getSeason().getId() : null)
                .createdAt(submission.getCreatedAt())
                .updatedAt(submission.getUpdatedAt())
                .resolvedAt(submission.getResolvedAt())
                .assignedToUserName(submission.getAssignedTo() != null ? submission.getAssignedTo().getFullName() : null)
                .seasonName(submission.getSeason() != null ? submission.getSeason().getDisplayName() : null);
        
        return builder.build();
    }
    
    // For public form submissions (without admin data)
    public static FormSubmissionDTO fromEntityPublic(FormSubmission submission) {
        if (submission == null) return null;
        
        return FormSubmissionDTO.builder()
                .id(submission.getId())
                .formType(submission.getFormType().name())
                .submitterName(submission.getSubmitterName())
                .subject(submission.getSubject())
                .status(submission.getStatus().name())
                .createdAt(submission.getCreatedAt())
                .build();
    }
}