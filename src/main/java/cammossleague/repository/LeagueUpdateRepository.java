package cammossleague.repository;

import cammossleague.model.LeagueUpdate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LeagueUpdateRepository extends JpaRepository<LeagueUpdate, Long> {
    
    List<LeagueUpdate> findByIsPublishedTrueOrderByCreatedAtDesc();
    
    Page<LeagueUpdate> findByIsPublishedTrueOrderByCreatedAtDesc(Pageable pageable);
    
    List<LeagueUpdate> findBySeasonIdAndIsPublishedTrueOrderByCreatedAtDesc(Long seasonId);
    
    Page<LeagueUpdate> findBySeasonIdAndIsPublishedTrueOrderByCreatedAtDesc(Long seasonId, Pageable pageable);
    
    List<LeagueUpdate> findBySeasonIdOrderByCreatedAtDesc(Long seasonId);
    
    Page<LeagueUpdate> findByOrderByCreatedAtDesc(Pageable pageable);
    
    @Query("SELECT lu FROM LeagueUpdate lu WHERE lu.author = :author ORDER BY lu.createdAt DESC")
    List<LeagueUpdate> findByAuthorOrderByCreatedAtDesc(@Param("author") String author);
    
    @Query("SELECT lu FROM LeagueUpdate lu WHERE lu.isPublished = true AND lu.createdAt >= :since ORDER BY lu.createdAt DESC")
    List<LeagueUpdate> findRecentPublishedUpdates(@Param("since") LocalDateTime since);
    
    long countByIsPublishedTrue();
    
    long countBySeasonIdAndIsPublishedTrue(Long seasonId);
}