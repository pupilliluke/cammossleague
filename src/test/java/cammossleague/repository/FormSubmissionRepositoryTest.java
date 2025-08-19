package cammossleague.repository;

import cammossleague.model.FormSubmission;
import cammossleague.model.Season;
import cammossleague.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.*;

@DataJpaTest
class FormSubmissionRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private FormSubmissionRepository formSubmissionRepository;

    private FormSubmission testSubmission;
    private User testUser;
    private Season testSeason;

    @BeforeEach
    void setUp() {
        testSeason = Season.builder()
                .name("Test Season")
                .year(2025)
                .seasonType(Season.SeasonType.SUMMER)
                .startDate(LocalDate.of(2025, 6, 1))
                .endDate(LocalDate.of(2025, 8, 31))
                .isActive(true)
                .build();
        entityManager.persist(testSeason);

        testUser = User.builder()
                .username("testadmin")
                .email("admin@test.com")
                .firstName("Test")
                .lastName("Admin")
                .role(User.Role.ADMIN)
                .isActive(true)
                .build();
        entityManager.persist(testUser);

        testSubmission = FormSubmission.builder()
                .formType(FormSubmission.FormType.COMPLAINT)
                .submitterName("Test User")
                .submitterEmail("user@test.com")
                .subject("Test Complaint")
                .message("This is a test complaint message")
                .status(FormSubmission.SubmissionStatus.PENDING)
                .season(testSeason)
                .build();
        entityManager.persist(testSubmission);

        entityManager.flush();
    }

    @Test
    void findByOrderByCreatedAtDesc_ShouldReturnSubmissionsInDescendingOrder() {
        // Given - create another submission
        FormSubmission newerSubmission = FormSubmission.builder()
                .formType(FormSubmission.FormType.TEAM_SIGNUP)
                .submitterName("New User")
                .submitterEmail("new@test.com")
                .subject("Team Registration")
                .message("New team registration")
                .status(FormSubmission.SubmissionStatus.PENDING)
                .build();
        entityManager.persist(newerSubmission);
        entityManager.flush();

        // When
        Page<FormSubmission> result = formSubmissionRepository.findByOrderByCreatedAtDesc(PageRequest.of(0, 10));

        // Then
        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getContent().get(0).getSubject()).isEqualTo("Team Registration");
        assertThat(result.getContent().get(1).getSubject()).isEqualTo("Test Complaint");
    }

    @Test
    void findByStatusOrderByCreatedAtDesc_ShouldReturnSubmissionsWithSpecificStatus() {
        // Given - create submission with different status
        FormSubmission resolvedSubmission = FormSubmission.builder()
                .formType(FormSubmission.FormType.GENERAL_INQUIRY)
                .submitterName("Resolved User")
                .submitterEmail("resolved@test.com")
                .subject("Resolved Inquiry")
                .message("This has been resolved")
                .status(FormSubmission.SubmissionStatus.RESOLVED)
                .build();
        entityManager.persist(resolvedSubmission);
        entityManager.flush();

        // When
        Page<FormSubmission> pendingResults = formSubmissionRepository
                .findByStatusOrderByCreatedAtDesc(FormSubmission.SubmissionStatus.PENDING, PageRequest.of(0, 10));
        Page<FormSubmission> resolvedResults = formSubmissionRepository
                .findByStatusOrderByCreatedAtDesc(FormSubmission.SubmissionStatus.RESOLVED, PageRequest.of(0, 10));

        // Then
        assertThat(pendingResults.getContent()).hasSize(1);
        assertThat(pendingResults.getContent().get(0).getStatus()).isEqualTo(FormSubmission.SubmissionStatus.PENDING);

        assertThat(resolvedResults.getContent()).hasSize(1);
        assertThat(resolvedResults.getContent().get(0).getStatus()).isEqualTo(FormSubmission.SubmissionStatus.RESOLVED);
    }

    @Test
    void findByFormTypeOrderByCreatedAtDesc_ShouldReturnSubmissionsWithSpecificFormType() {
        // Given - create submissions with different form types
        FormSubmission teamSignup = FormSubmission.builder()
                .formType(FormSubmission.FormType.TEAM_SIGNUP)
                .submitterName("Team Captain")
                .submitterEmail("captain@test.com")
                .subject("New Team")
                .message("Want to register new team")
                .status(FormSubmission.SubmissionStatus.PENDING)
                .build();
        entityManager.persist(teamSignup);
        entityManager.flush();

        // When
        Page<FormSubmission> complaintResults = formSubmissionRepository
                .findByFormTypeOrderByCreatedAtDesc(FormSubmission.FormType.COMPLAINT, PageRequest.of(0, 10));
        Page<FormSubmission> teamSignupResults = formSubmissionRepository
                .findByFormTypeOrderByCreatedAtDesc(FormSubmission.FormType.TEAM_SIGNUP, PageRequest.of(0, 10));

        // Then
        assertThat(complaintResults.getContent()).hasSize(1);
        assertThat(complaintResults.getContent().get(0).getFormType()).isEqualTo(FormSubmission.FormType.COMPLAINT);

        assertThat(teamSignupResults.getContent()).hasSize(1);
        assertThat(teamSignupResults.getContent().get(0).getFormType()).isEqualTo(FormSubmission.FormType.TEAM_SIGNUP);
    }

    @Test
    void findByAssignedToIdOrderByCreatedAtDesc_ShouldReturnAssignedSubmissions() {
        // Given - assign submission to user
        testSubmission.setAssignedTo(testUser);
        entityManager.merge(testSubmission);

        FormSubmission unassignedSubmission = FormSubmission.builder()
                .formType(FormSubmission.FormType.GENERAL_INQUIRY)
                .submitterName("Unassigned User")
                .submitterEmail("unassigned@test.com")
                .subject("Unassigned Inquiry")
                .message("This is unassigned")
                .status(FormSubmission.SubmissionStatus.PENDING)
                .build();
        entityManager.persist(unassignedSubmission);
        entityManager.flush();

        // When
        Page<FormSubmission> assignedResults = formSubmissionRepository
                .findByAssignedToIdOrderByCreatedAtDesc(testUser.getId(), PageRequest.of(0, 10));

        // Then
        assertThat(assignedResults.getContent()).hasSize(1);
        assertThat(assignedResults.getContent().get(0).getAssignedTo()).isEqualTo(testUser);
    }

    @Test
    void countByStatus_ShouldReturnCorrectCount() {
        // Given - create submissions with different statuses
        FormSubmission inReviewSubmission = FormSubmission.builder()
                .formType(FormSubmission.FormType.TEAM_SIGNUP)
                .submitterName("Review User")
                .submitterEmail("review@test.com")
                .subject("In Review")
                .message("This is in review")
                .status(FormSubmission.SubmissionStatus.IN_REVIEW)
                .build();
        entityManager.persist(inReviewSubmission);
        entityManager.flush();

        // When
        long pendingCount = formSubmissionRepository.countByStatus(FormSubmission.SubmissionStatus.PENDING);
        long inReviewCount = formSubmissionRepository.countByStatus(FormSubmission.SubmissionStatus.IN_REVIEW);
        long resolvedCount = formSubmissionRepository.countByStatus(FormSubmission.SubmissionStatus.RESOLVED);

        // Then
        assertThat(pendingCount).isEqualTo(1);
        assertThat(inReviewCount).isEqualTo(1);
        assertThat(resolvedCount).isEqualTo(0);
    }

    @Test
    void countByFormType_ShouldReturnCorrectCount() {
        // Given - create submissions with different form types
        FormSubmission teamSignup = FormSubmission.builder()
                .formType(FormSubmission.FormType.TEAM_SIGNUP)
                .submitterName("Team User")
                .submitterEmail("team@test.com")
                .subject("Team Signup")
                .message("Team signup message")
                .status(FormSubmission.SubmissionStatus.PENDING)
                .build();
        entityManager.persist(teamSignup);
        entityManager.flush();

        // When
        long complaintCount = formSubmissionRepository.countByFormType(FormSubmission.FormType.COMPLAINT);
        long teamSignupCount = formSubmissionRepository.countByFormType(FormSubmission.FormType.TEAM_SIGNUP);
        long inquiryCount = formSubmissionRepository.countByFormType(FormSubmission.FormType.GENERAL_INQUIRY);

        // Then
        assertThat(complaintCount).isEqualTo(1);
        assertThat(teamSignupCount).isEqualTo(1);
        assertThat(inquiryCount).isEqualTo(0);
    }

    @Test
    void findBySubmitterEmailOrderByCreatedAtDesc_ShouldReturnUserSubmissions() {
        // Given - create another submission from same user
        FormSubmission anotherSubmission = FormSubmission.builder()
                .formType(FormSubmission.FormType.GENERAL_INQUIRY)
                .submitterName("Test User")
                .submitterEmail("user@test.com")
                .subject("Another Inquiry")
                .message("Another message from same user")
                .status(FormSubmission.SubmissionStatus.PENDING)
                .build();
        entityManager.persist(anotherSubmission);
        entityManager.flush();

        // When
        Page<FormSubmission> result = formSubmissionRepository
                .findBySubmitterEmailOrderByCreatedAtDesc("user@test.com", PageRequest.of(0, 10));

        // Then
        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getContent().get(0).getSubject()).isEqualTo("Another Inquiry");
        assertThat(result.getContent().get(1).getSubject()).isEqualTo("Test Complaint");
        result.getContent().forEach(submission -> 
            assertThat(submission.getSubmitterEmail()).isEqualTo("user@test.com"));
    }

    @Test
    void findTop10ByOrderByCreatedAtDesc_ShouldReturnLatest10Submissions() {
        // Given - create 12 submissions
        for (int i = 1; i <= 11; i++) {
            FormSubmission submission = FormSubmission.builder()
                    .formType(FormSubmission.FormType.GENERAL_INQUIRY)
                    .submitterName("User " + i)
                    .submitterEmail("user" + i + "@test.com")
                    .subject("Inquiry " + i)
                    .message("Message " + i)
                    .status(FormSubmission.SubmissionStatus.PENDING)
                    .build();
            entityManager.persist(submission);
        }
        entityManager.flush();

        // When
        List<FormSubmission> result = formSubmissionRepository.findTop10ByOrderByCreatedAtDesc();

        // Then
        assertThat(result).hasSize(10);
        // Should be ordered by created date desc, so latest should be first
        assertThat(result.get(0).getSubject()).isEqualTo("Inquiry 11");
    }

    @Test
    void countPendingSubmissionsSince_ShouldReturnCorrectCount() {
        // Given - create submissions at different times
        LocalDateTime yesterday = LocalDateTime.now().minusDays(1);
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);

        // When
        long recentCount = formSubmissionRepository.countPendingSubmissionsSince(yesterday);
        long olderCount = formSubmissionRepository.countPendingSubmissionsSince(weekAgo);

        // Then
        // testSubmission was created now, so should be counted in both
        assertThat(recentCount).isGreaterThanOrEqualTo(1);
        assertThat(olderCount).isGreaterThanOrEqualTo(1);
    }
}