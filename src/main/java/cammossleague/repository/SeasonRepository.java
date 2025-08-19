package cammossleague.repository;

import cammossleague.model.Season;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface SeasonRepository extends JpaRepository<Season, Long> {
    Optional<Season> findByIsActiveTrue();
    List<Season> findAllByIsActiveTrue();
    List<Season> findByIsActiveTrueAndYear(Integer year);
    Optional<Season> findByYear(Integer year);
    List<Season> findAllByOrderByYearDesc();
    Optional<Season> findTopByOrderByYearDesc();
}