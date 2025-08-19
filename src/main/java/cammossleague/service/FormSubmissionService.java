package cammossleague.service;

import cammossleague.dto.FormSubmissionDTO;
import cammossleague.model.FormSubmission;
import cammossleague.model.Season;
import cammossleague.model.User;
import cammossleague.repository.FormSubmissionRepository;
import cammossleague.repository.SeasonRepository;
import cammossleague.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FormSubmissionService {
    
    private final FormSubmissionRepository formSubmissionRepository;
    private final UserRepository userRepository;
    private final SeasonRepository seasonRepository;
    
    public Page<FormSubmissionDTO> getSubmissions(String status, String formType, Long assignedToUserId, Pageable pageable) {
        Page<FormSubmission> submissions;
        
        if (status != null) {
            FormSubmission.SubmissionStatus submissionStatus = FormSubmission.SubmissionStatus.valueOf(status);
            submissions = formSubmissionRepository.findByStatusOrderByCreatedAtDesc(submissionStatus, pageable);
        } else if (formType != null) {
            FormSubmission.FormType submissionFormType = FormSubmission.FormType.valueOf(formType);
            submissions = formSubmissionRepository.findByFormTypeOrderByCreatedAtDesc(submissionFormType, pageable);
        } else if (assignedToUserId != null) {
            submissions = formSubmissionRepository.findByAssignedToIdOrderByCreatedAtDesc(assignedToUserId, pageable);
        } else {
            submissions = formSubmissionRepository.findByOrderByCreatedAtDesc(pageable);
        }
        
        List<FormSubmissionDTO> submissionDTOs = submissions.getContent().stream()
                .map(FormSubmissionDTO::fromEntity)
                .collect(Collectors.toList());
        
        return new PageImpl<>(submissionDTOs, pageable, submissions.getTotalElements());
    }
    
    public FormSubmissionDTO getSubmissionById(Long id) {
        FormSubmission submission = formSubmissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Form submission not found with id: " + id));
        return FormSubmissionDTO.fromEntity(submission);
    }
    
    public FormSubmissionDTO createSubmission(FormSubmissionDTO submissionDTO) {
        FormSubmission submission = FormSubmission.builder()
                .formType(FormSubmission.FormType.valueOf(submissionDTO.getFormType()))
                .submitterName(submissionDTO.getSubmitterName())
                .submitterEmail(submissionDTO.getSubmitterEmail())
                .submitterPhone(submissionDTO.getSubmitterPhone())
                .subject(submissionDTO.getSubject())
                .message(submissionDTO.getMessage())
                .status(FormSubmission.SubmissionStatus.PENDING)
                .build();
        
        if (submissionDTO.getSeasonId() != null) {
            Season season = seasonRepository.findById(submissionDTO.getSeasonId())
                    .orElseThrow(() -> new RuntimeException("Season not found with id: " + submissionDTO.getSeasonId()));
            submission.setSeason(season);
        }
        
        FormSubmission savedSubmission = formSubmissionRepository.save(submission);
        return FormSubmissionDTO.fromEntity(savedSubmission);
    }
    
    public FormSubmissionDTO updateSubmissionStatus(Long id, String status, String adminNotes) {
        FormSubmission submission = formSubmissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Form submission not found with id: " + id));
        
        FormSubmission.SubmissionStatus newStatus = FormSubmission.SubmissionStatus.valueOf(status);
        submission.setStatus(newStatus);
        
        if (adminNotes != null) {
            submission.setAdminNotes(adminNotes);
        }
        
        if (newStatus == FormSubmission.SubmissionStatus.RESOLVED || 
            newStatus == FormSubmission.SubmissionStatus.CLOSED) {
            submission.setResolvedAt(LocalDateTime.now());
        }
        
        FormSubmission updatedSubmission = formSubmissionRepository.save(submission);
        return FormSubmissionDTO.fromEntity(updatedSubmission);
    }
    
    public FormSubmissionDTO assignSubmission(Long id, Long userId) {
        FormSubmission submission = formSubmissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Form submission not found with id: " + id));
        
        User assignee = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        submission.setAssignedTo(assignee);
        submission.setStatus(FormSubmission.SubmissionStatus.IN_REVIEW);
        
        FormSubmission assignedSubmission = formSubmissionRepository.save(submission);
        return FormSubmissionDTO.fromEntity(assignedSubmission);
    }
    
    public FormSubmissionDTO updateSubmission(Long id, FormSubmissionDTO submissionDTO) {
        FormSubmission submission = formSubmissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Form submission not found with id: " + id));
        
        submission.setSubject(submissionDTO.getSubject());
        submission.setMessage(submissionDTO.getMessage());
        submission.setAdminNotes(submissionDTO.getAdminNotes());
        
        if (submissionDTO.getStatus() != null) {
            submission.setStatus(FormSubmission.SubmissionStatus.valueOf(submissionDTO.getStatus()));
        }
        
        FormSubmission updatedSubmission = formSubmissionRepository.save(submission);
        return FormSubmissionDTO.fromEntity(updatedSubmission);
    }
    
    public void deleteSubmission(Long id) {
        if (!formSubmissionRepository.existsById(id)) {
            throw new RuntimeException("Form submission not found with id: " + id);
        }
        formSubmissionRepository.deleteById(id);
    }
    
    public Map<String, Object> getSubmissionStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalSubmissions", formSubmissionRepository.count());
        stats.put("pendingCount", formSubmissionRepository.countByStatus(FormSubmission.SubmissionStatus.PENDING));
        stats.put("inReviewCount", formSubmissionRepository.countByStatus(FormSubmission.SubmissionStatus.IN_REVIEW));
        stats.put("resolvedCount", formSubmissionRepository.countByStatus(FormSubmission.SubmissionStatus.RESOLVED));
        
        stats.put("complaintCount", formSubmissionRepository.countByFormType(FormSubmission.FormType.COMPLAINT));
        stats.put("teamSignupCount", formSubmissionRepository.countByFormType(FormSubmission.FormType.TEAM_SIGNUP));
        stats.put("generalInquiryCount", formSubmissionRepository.countByFormType(FormSubmission.FormType.GENERAL_INQUIRY));
        
        // Recent submissions (last 7 days)
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        stats.put("recentPendingCount", formSubmissionRepository.countPendingSubmissionsSince(weekAgo));
        
        return stats;
    }
    
    public Page<FormSubmissionDTO> getPendingSubmissions(Pageable pageable) {
        Page<FormSubmission> submissions = formSubmissionRepository.findByStatusOrderByCreatedAtDesc(
                FormSubmission.SubmissionStatus.PENDING, pageable);
        
        List<FormSubmissionDTO> submissionDTOs = submissions.getContent().stream()
                .map(FormSubmissionDTO::fromEntity)
                .collect(Collectors.toList());
        
        return new PageImpl<>(submissionDTOs, pageable, submissions.getTotalElements());
    }
    
    public FormSubmissionDTO resolveSubmission(Long id, String adminNotes) {
        FormSubmission submission = formSubmissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Form submission not found with id: " + id));
        
        submission.setStatus(FormSubmission.SubmissionStatus.RESOLVED);
        submission.setAdminNotes(adminNotes);
        submission.setResolvedAt(LocalDateTime.now());
        
        FormSubmission resolvedSubmission = formSubmissionRepository.save(submission);
        return FormSubmissionDTO.fromEntity(resolvedSubmission);
    }
    
    public List<FormSubmissionDTO> getRecentSubmissions() {
        List<FormSubmission> submissions = formSubmissionRepository.findTop10ByOrderByCreatedAtDesc();
        return submissions.stream()
                .map(FormSubmissionDTO::fromEntity)
                .collect(Collectors.toList());
    }
}