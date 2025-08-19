package cammossleague.controller.admin;

import cammossleague.dto.FormSubmissionDTO;
import cammossleague.model.FormSubmission;
import cammossleague.service.FormSubmissionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminFormController.class)
class AdminFormControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FormSubmissionService formSubmissionService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAllSubmissions_ShouldReturnPageOfSubmissions() throws Exception {
        // Given
        FormSubmissionDTO submission = FormSubmissionDTO.builder()
                .id(1L)
                .formType("COMPLAINT")
                .submitterName("John Doe")
                .submitterEmail("john@example.com")
                .subject("Test Complaint")
                .message("Test message")
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .build();

        when(formSubmissionService.getSubmissions(null, null, null, PageRequest.of(0, 20)))
                .thenReturn(new PageImpl<>(List.of(submission)));

        // When/Then
        mockMvc.perform(get("/api/admin/forms/submissions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].formType").value("COMPLAINT"))
                .andExpect(jsonPath("$.content[0].submitterName").value("John Doe"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAllSubmissions_WithFilters_ShouldReturnFilteredSubmissions() throws Exception {
        // Given
        FormSubmissionDTO submission = FormSubmissionDTO.builder()
                .id(1L)
                .formType("COMPLAINT")
                .status("PENDING")
                .build();

        when(formSubmissionService.getSubmissions(eq("PENDING"), isNull(), isNull(), any()))
                .thenReturn(new PageImpl<>(List.of(submission)));

        // When/Then
        mockMvc.perform(get("/api/admin/forms/submissions")
                        .param("status", "PENDING"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].status").value("PENDING"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getSubmission_WhenExists_ShouldReturnSubmission() throws Exception {
        // Given
        FormSubmissionDTO submission = FormSubmissionDTO.builder()
                .id(1L)
                .formType("COMPLAINT")
                .submitterName("John Doe")
                .subject("Test Complaint")
                .build();

        when(formSubmissionService.getSubmissionById(1L)).thenReturn(submission);

        // When/Then
        mockMvc.perform(get("/api/admin/forms/submissions/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.formType").value("COMPLAINT"))
                .andExpect(jsonPath("$.submitterName").value("John Doe"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateSubmissionStatus_ShouldUpdateAndReturnSubmission() throws Exception {
        // Given
        Map<String, String> statusUpdate = Map.of(
                "status", "IN_REVIEW",
                "adminNotes", "Under review"
        );

        FormSubmissionDTO updatedSubmission = FormSubmissionDTO.builder()
                .id(1L)
                .status("IN_REVIEW")
                .adminNotes("Under review")
                .build();

        when(formSubmissionService.updateSubmissionStatus(1L, "IN_REVIEW", "Under review"))
                .thenReturn(updatedSubmission);

        // When/Then
        mockMvc.perform(put("/api/admin/forms/submissions/1/status")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusUpdate)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IN_REVIEW"))
                .andExpect(jsonPath("$.adminNotes").value("Under review"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void assignSubmission_ShouldAssignAndReturnSubmission() throws Exception {
        // Given
        FormSubmissionDTO assignedSubmission = FormSubmissionDTO.builder()
                .id(1L)
                .assignedToUserId(2L)
                .assignedToUserName("Admin User")
                .status("IN_REVIEW")
                .build();

        when(formSubmissionService.assignSubmission(1L, 2L)).thenReturn(assignedSubmission);

        // When/Then
        mockMvc.perform(put("/api/admin/forms/submissions/1/assign")
                        .with(csrf())
                        .param("userId", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.assignedToUserId").value(2))
                .andExpect(jsonPath("$.status").value("IN_REVIEW"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteSubmission_ShouldReturn204() throws Exception {
        // When/Then
        mockMvc.perform(delete("/api/admin/forms/submissions/1")
                        .with(csrf()))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getSubmissionStats_ShouldReturnStatistics() throws Exception {
        // Given
        Map<String, Object> stats = Map.of(
                "totalSubmissions", 50L,
                "pendingCount", 10L,
                "inReviewCount", 15L,
                "resolvedCount", 25L,
                "complaintCount", 20L,
                "teamSignupCount", 15L,
                "generalInquiryCount", 15L
        );

        when(formSubmissionService.getSubmissionStats()).thenReturn(stats);

        // When/Then
        mockMvc.perform(get("/api/admin/forms/submissions/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalSubmissions").value(50))
                .andExpect(jsonPath("$.pendingCount").value(10))
                .andExpect(jsonPath("$.complaintCount").value(20));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getPendingSubmissions_ShouldReturnPendingOnly() throws Exception {
        // Given
        FormSubmissionDTO pendingSubmission = FormSubmissionDTO.builder()
                .id(1L)
                .status("PENDING")
                .formType("COMPLAINT")
                .build();

        when(formSubmissionService.getPendingSubmissions(any()))
                .thenReturn(new PageImpl<>(List.of(pendingSubmission)));

        // When/Then
        mockMvc.perform(get("/api/admin/forms/submissions/pending"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].status").value("PENDING"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void resolveSubmission_ShouldResolveAndReturnSubmission() throws Exception {
        // Given
        Map<String, String> resolution = Map.of("adminNotes", "Issue resolved successfully");

        FormSubmissionDTO resolvedSubmission = FormSubmissionDTO.builder()
                .id(1L)
                .status("RESOLVED")
                .adminNotes("Issue resolved successfully")
                .build();

        when(formSubmissionService.resolveSubmission(1L, "Issue resolved successfully"))
                .thenReturn(resolvedSubmission);

        // When/Then
        mockMvc.perform(post("/api/admin/forms/submissions/1/resolve")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(resolution)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("RESOLVED"))
                .andExpect(jsonPath("$.adminNotes").value("Issue resolved successfully"));
    }

    @Test
    @WithMockUser(roles = "USER")
    void getAllSubmissions_WithUserRole_ShouldReturn403() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/admin/forms/submissions"))
                .andExpect(status().isForbidden());
    }

    @Test
    void getAllSubmissions_WithoutAuthentication_ShouldReturn401() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/admin/forms/submissions"))
                .andExpect(status().isUnauthorized());
    }
}