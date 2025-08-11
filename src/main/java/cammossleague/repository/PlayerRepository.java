package cammossleague.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import cammossleague.model.Player;
import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    
    List<Player> findBySeasonId(Long seasonId);
    
    List<Player> findBySeasonIdAndIsActiveTrue(Long seasonId);
    
    List<Player> findBySeasonYear(Integer year);
    
    @Query("SELECT p FROM Player p JOIN p.playerTeams pt WHERE pt.team.id = :teamId AND pt.status = 'ACTIVE'")
    List<Player> findByPlayerTeamsTeamId(@Param("teamId") Long teamId);
    
    @Query("SELECT p FROM Player p JOIN p.playerTeams pt WHERE pt.team.id = :teamId AND pt.status = 'ACTIVE' AND p.season.id = :seasonId")
    List<Player> findByPlayerTeamsTeamIdAndSeasonId(@Param("teamId") Long teamId, @Param("seasonId") Long seasonId);
    
    @Query("SELECT p FROM Player p WHERE p.user.isFreeAgent = true")
    List<Player> findByUserIsFreeAgentTrue();
    
    List<Player> findByPosition(Player.Position position);
    
    @Query("SELECT p FROM Player p WHERE p.user.id = :userId ORDER BY p.season.year DESC")
    List<Player> findByUserIdOrderBySeasonYearDesc(@Param("userId") Long userId);
    
    @Query("SELECT p FROM Player p WHERE p.user.id = :userId AND p.season.isActive = true")
    Optional<Player> findByUserAndCurrentSeason(@Param("userId") Long userId);
}
