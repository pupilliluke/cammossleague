package cammossleague.repository;

import cammossleague.model.Season;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SeasonRepository extends JpaRepository<Season, Long> {
    Optional<Season> findByIsActiveTrue();
    Optional<Season> findByYear(Integer year);
}