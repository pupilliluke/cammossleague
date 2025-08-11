package cammossleague.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cammossleague.model.Team;
import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    List<Team> findBySeasonId(Long seasonId);
    List<Team> findBySeasonIdOrderByWinsDesc(Long seasonId);
    List<Team> findBySeasonYear(Integer year);
}
