package cammossleague.repository;

import cammossleague.model.PlayoffBracket;
import cammossleague.model.Season;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlayoffBracketRepository extends JpaRepository<PlayoffBracket, Long> {
    
    List<PlayoffBracket> findBySeasonId(Long seasonId);
    
    List<PlayoffBracket> findBySeasonIdAndIsActiveTrue(Long seasonId);
    
    Optional<PlayoffBracket> findBySeasonIdAndIsActiveTrueAndIsCompletedFalse(Long seasonId);
    
    @Query("SELECT pb FROM PlayoffBracket pb WHERE pb.season = :season ORDER BY pb.createdAt DESC")
    Page<PlayoffBracket> findBySeasonOrderByCreatedAtDesc(@Param("season") Season season, Pageable pageable);
    
    @Query("SELECT pb FROM PlayoffBracket pb WHERE pb.isActive = true ORDER BY pb.createdAt DESC")
    List<PlayoffBracket> findActiveBrackets();
    
    boolean existsBySeasonIdAndIsActiveTrue(Long seasonId);
}