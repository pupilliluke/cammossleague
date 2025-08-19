package cammossleague.repository;

import cammossleague.model.PlayerTeam;
import cammossleague.model.PlayerTeam.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerTeamRepository extends JpaRepository<PlayerTeam, Long> {
    
    List<PlayerTeam> findByPlayerIdAndStatus(Long playerId, Status status);
    
    List<PlayerTeam> findByTeamIdAndStatus(Long teamId, Status status);
    
    List<PlayerTeam> findByPlayerIdAndTeamIdAndStatus(Long playerId, Long teamId, Status status);
    
    @Query("SELECT pt FROM PlayerTeam pt WHERE pt.team.season.id = :seasonId AND pt.status = :status")
    List<PlayerTeam> findBySeasonIdAndStatus(@Param("seasonId") Long seasonId, @Param("status") Status status);
    
    @Query("SELECT pt FROM PlayerTeam pt WHERE pt.player.id = :playerId AND pt.team.season.id = :seasonId AND pt.status = :status")
    List<PlayerTeam> findByPlayerIdAndSeasonIdAndStatus(@Param("playerId") Long playerId, @Param("seasonId") Long seasonId, @Param("status") Status status);
    
    boolean existsByPlayerIdAndTeamIdAndStatus(Long playerId, Long teamId, Status status);
    
    // Convenience methods for active status
    default List<PlayerTeam> findByPlayerIdAndIsActiveTrue(Long playerId) {
        return findByPlayerIdAndStatus(playerId, Status.ACTIVE);
    }
    
    default List<PlayerTeam> findByTeamIdAndIsActiveTrue(Long teamId) {
        return findByTeamIdAndStatus(teamId, Status.ACTIVE);
    }
    
    default List<PlayerTeam> findByPlayerIdAndTeamIdAndIsActiveTrue(Long playerId, Long teamId) {
        return findByPlayerIdAndTeamIdAndStatus(playerId, teamId, Status.ACTIVE);
    }
    
    default List<PlayerTeam> findBySeasonIdAndIsActiveTrue(Long seasonId) {
        return findBySeasonIdAndStatus(seasonId, Status.ACTIVE);
    }
    
    default List<PlayerTeam> findByPlayerIdAndSeasonIdAndIsActiveTrue(Long playerId, Long seasonId) {
        return findByPlayerIdAndSeasonIdAndStatus(playerId, seasonId, Status.ACTIVE);
    }
    
    default boolean existsByPlayerIdAndTeamIdAndIsActiveTrue(Long playerId, Long teamId) {
        return existsByPlayerIdAndTeamIdAndStatus(playerId, teamId, Status.ACTIVE);
    }
}