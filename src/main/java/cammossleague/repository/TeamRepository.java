package cammossleague.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import cammossleague.model.Team;
import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long>, JpaSpecificationExecutor<Team> {
    List<Team> findBySeasonId(Long seasonId);
    List<Team> findBySeasonIdOrderByWinsDesc(Long seasonId);
    List<Team> findBySeasonYear(Integer year);
    List<Team> findBySeasonIdAndIsActiveTrue(Long seasonId);
    List<Team> findByIsActiveTrueOrderByName();
    
    @Modifying
    @Query(value = "ALTER SEQUENCE teams_id_seq RESTART WITH 12", nativeQuery = true)
    void resetSequence();
}
