package cammossleague.repository;

import cammossleague.model.PlayoffMatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayoffMatchRepository extends JpaRepository<PlayoffMatch, Long> {
    
    List<PlayoffMatch> findByBracketIdOrderByRoundNumberAscPositionInRoundAsc(Long bracketId);
    
    List<PlayoffMatch> findByBracketIdAndRoundNumber(Long bracketId, Integer roundNumber);
    
    List<PlayoffMatch> findByBracketIdAndIsCompletedFalse(Long bracketId);
    
    @Query("SELECT pm FROM PlayoffMatch pm WHERE pm.bracket.id = :bracketId AND pm.roundNumber = :roundNumber ORDER BY pm.positionInRound ASC")
    List<PlayoffMatch> findByBracketAndRoundOrderByPosition(@Param("bracketId") Long bracketId, @Param("roundNumber") Integer roundNumber);
    
    @Query("SELECT pm FROM PlayoffMatch pm WHERE (pm.team1.id = :teamId OR pm.team2.id = :teamId) AND pm.bracket.id = :bracketId")
    List<PlayoffMatch> findByTeamIdAndBracketId(@Param("teamId") Long teamId, @Param("bracketId") Long bracketId);
    
    @Query("SELECT MAX(pm.roundNumber) FROM PlayoffMatch pm WHERE pm.bracket.id = :bracketId")
    Integer findMaxRoundNumberByBracketId(@Param("bracketId") Long bracketId);
    
    long countByBracketIdAndIsCompletedTrue(Long bracketId);
    
    long countByBracketId(Long bracketId);
}