package cammossleague.repository;

import cammossleague.model.FormSubmission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FormSubmissionRepository extends JpaRepository<FormSubmission, Long> {
    
    Page<FormSubmission> findByOrderByCreatedAtDesc(Pageable pageable);
    
    Page<FormSubmission> findByStatusOrderByCreatedAtDesc(FormSubmission.SubmissionStatus status, Pageable pageable);
    
    Page<FormSubmission> findByFormTypeOrderByCreatedAtDesc(FormSubmission.FormType formType, Pageable pageable);
    
    Page<FormSubmission> findByAssignedToIdOrderByCreatedAtDesc(Long assignedToId, Pageable pageable);
    
    @Query("SELECT fs FROM FormSubmission fs WHERE fs.status IN :statuses ORDER BY fs.createdAt DESC")
    Page<FormSubmission> findByStatusInOrderByCreatedAtDesc(@Param("statuses") List<FormSubmission.SubmissionStatus> statuses, Pageable pageable);
    
    long countByStatus(FormSubmission.SubmissionStatus status);
    
    long countByFormType(FormSubmission.FormType formType);
    
    @Query("SELECT COUNT(fs) FROM FormSubmission fs WHERE fs.status = 'PENDING' AND fs.createdAt >= :since")
    long countPendingSubmissionsSince(@Param("since") LocalDateTime since);
    
    @Query("SELECT fs FROM FormSubmission fs WHERE fs.submitterEmail = :email ORDER BY fs.createdAt DESC")
    Page<FormSubmission> findBySubmitterEmailOrderByCreatedAtDesc(@Param("email") String email, Pageable pageable);
    
    List<FormSubmission> findTop10ByOrderByCreatedAtDesc();
}