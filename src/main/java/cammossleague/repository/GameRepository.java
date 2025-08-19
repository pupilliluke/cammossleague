package cammossleague.repository;

import cammossleague.model.Game;
import cammossleague.model.Season;
import cammossleague.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    
    // Find games by season
    List<Game> findBySeasonOrderByGameDateAscGameTimeAsc(Season season);
    
    List<Game> findBySeasonIdOrderByGameDateAscGameTimeAsc(Long seasonId);
    
    List<Game> findBySeasonId(Long seasonId);
    
    // Find games by team
    @Query("SELECT g FROM Game g WHERE (g.homeTeam = :team OR g.awayTeam = :team) ORDER BY g.gameDate ASC, g.gameTime ASC")
    List<Game> findByTeam(@Param("team") Team team);
    
    @Query("SELECT g FROM Game g WHERE (g.homeTeam.id = :teamId OR g.awayTeam.id = :teamId) ORDER BY g.gameDate ASC, g.gameTime ASC")
    List<Game> findByTeamId(@Param("teamId") Long teamId);
    
    // Find games by team and season
    @Query("SELECT g FROM Game g WHERE (g.homeTeam = :team OR g.awayTeam = :team) AND g.season = :season ORDER BY g.gameDate ASC, g.gameTime ASC")
    List<Game> findByTeamAndSeason(@Param("team") Team team, @Param("season") Season season);
    
    @Query("SELECT g FROM Game g WHERE (g.homeTeam.id = :teamId OR g.awayTeam.id = :teamId) AND g.season.id = :seasonId ORDER BY g.gameDate ASC, g.gameTime ASC")
    List<Game> findByTeamIdAndSeasonId(@Param("teamId") Long teamId, @Param("seasonId") Long seasonId);
    
    // Find games by date range
    @Query("SELECT g FROM Game g WHERE g.gameDate BETWEEN :startDate AND :endDate ORDER BY g.gameDate ASC, g.gameTime ASC")
    List<Game> findByGameDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    // Find games by week
    List<Game> findBySeasonIdAndWeekNumberOrderByGameDateAscGameTimeAsc(Long seasonId, Integer weekNumber);
    
    // Find completed games
    List<Game> findBySeasonIdAndIsCompletedOrderByGameDateAscGameTimeAsc(Long seasonId, Boolean isCompleted);
    
    // Find upcoming games
    @Query("SELECT g FROM Game g WHERE g.gameDate >= :today ORDER BY g.gameDate ASC, g.gameTime ASC")
    List<Game> findUpcomingGames(@Param("today") LocalDate today);
    
    @Query("SELECT g FROM Game g WHERE g.season.id = :seasonId AND g.gameDate >= :today ORDER BY g.gameDate ASC, g.gameTime ASC")
    List<Game> findUpcomingGamesBySeason(@Param("seasonId") Long seasonId, @Param("today") LocalDate today);
    
    // Find games by type
    List<Game> findBySeasonIdAndGameTypeOrderByGameDateAscGameTimeAsc(Long seasonId, Game.GameType gameType);
    
    // Statistics queries
    @Query("SELECT COUNT(g) FROM Game g WHERE g.season.id = :seasonId")
    Long countGamesBySeason(@Param("seasonId") Long seasonId);
    
    @Query("SELECT COUNT(g) FROM Game g WHERE g.season.id = :seasonId AND g.isCompleted = true")
    Long countCompletedGamesBySeason(@Param("seasonId") Long seasonId);
    
    @Query("SELECT COUNT(g) FROM Game g WHERE (g.homeTeam.id = :teamId OR g.awayTeam.id = :teamId) AND g.season.id = :seasonId")
    Long countGamesByTeamAndSeason(@Param("teamId") Long teamId, @Param("seasonId") Long seasonId);
    
    // Additional methods for pagination support
    org.springframework.data.domain.Page<Game> findBySeasonIdAndWeekNumber(Long seasonId, Integer weekNumber, org.springframework.data.domain.Pageable pageable);
    org.springframework.data.domain.Page<Game> findBySeasonId(Long seasonId, org.springframework.data.domain.Pageable pageable);
    org.springframework.data.domain.Page<Game> findByIsCompleted(Boolean isCompleted, org.springframework.data.domain.Pageable pageable);
    org.springframework.data.domain.Page<Game> findAllByOrderByGameDateDescGameTimeDesc(org.springframework.data.domain.Pageable pageable);
}