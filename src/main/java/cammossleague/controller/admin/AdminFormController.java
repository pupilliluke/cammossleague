package cammossleague.controller.admin;

import cammossleague.dto.FormSubmissionDTO;
import cammossleague.service.FormSubmissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/forms")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminFormController {
    
    private final FormSubmissionService formSubmissionService;
    
    @GetMapping("/submissions")
    public ResponseEntity<Page<FormSubmissionDTO>> getAllSubmissions(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String formType,
            @RequestParam(required = false) Long assignedToUserId,
            Pageable pageable) {
        
        Page<FormSubmissionDTO> submissions = formSubmissionService.getSubmissions(
                status, formType, assignedToUserId, pageable);
        return ResponseEntity.ok(submissions);
    }
    
    @GetMapping("/submissions/{id}")
    public ResponseEntity<FormSubmissionDTO> getSubmission(@PathVariable Long id) {
        FormSubmissionDTO submission = formSubmissionService.getSubmissionById(id);
        return ResponseEntity.ok(submission);
    }
    
    @PutMapping("/submissions/{id}/status")
    public ResponseEntity<FormSubmissionDTO> updateSubmissionStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        
        String status = statusUpdate.get("status");
        String adminNotes = statusUpdate.get("adminNotes");
        
        FormSubmissionDTO updatedSubmission = formSubmissionService.updateSubmissionStatus(id, status, adminNotes);
        return ResponseEntity.ok(updatedSubmission);
    }
    
    @PutMapping("/submissions/{id}/assign")
    public ResponseEntity<FormSubmissionDTO> assignSubmission(
            @PathVariable Long id,
            @RequestParam Long userId) {
        
        FormSubmissionDTO assignedSubmission = formSubmissionService.assignSubmission(id, userId);
        return ResponseEntity.ok(assignedSubmission);
    }
    
    @PutMapping("/submissions/{id}")
    public ResponseEntity<FormSubmissionDTO> updateSubmission(
            @PathVariable Long id,
            @Valid @RequestBody FormSubmissionDTO submissionDTO) {
        
        FormSubmissionDTO updatedSubmission = formSubmissionService.updateSubmission(id, submissionDTO);
        return ResponseEntity.ok(updatedSubmission);
    }
    
    @DeleteMapping("/submissions/{id}")
    public ResponseEntity<Void> deleteSubmission(@PathVariable Long id) {
        formSubmissionService.deleteSubmission(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/submissions/stats")
    public ResponseEntity<Map<String, Object>> getSubmissionStats() {
        Map<String, Object> stats = formSubmissionService.getSubmissionStats();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/submissions/pending")
    public ResponseEntity<Page<FormSubmissionDTO>> getPendingSubmissions(Pageable pageable) {
        Page<FormSubmissionDTO> pendingSubmissions = formSubmissionService.getPendingSubmissions(pageable);
        return ResponseEntity.ok(pendingSubmissions);
    }
    
    @PostMapping("/submissions/{id}/resolve")
    public ResponseEntity<FormSubmissionDTO> resolveSubmission(
            @PathVariable Long id,
            @RequestBody Map<String, String> resolution) {
        
        String adminNotes = resolution.get("adminNotes");
        FormSubmissionDTO resolvedSubmission = formSubmissionService.resolveSubmission(id, adminNotes);
        return ResponseEntity.ok(resolvedSubmission);
    }
}