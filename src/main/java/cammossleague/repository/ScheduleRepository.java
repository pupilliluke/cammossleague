// package cammossleague.repository;

// import java.util.List;

// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.stereotype.Repository;

// import cammossleague.model.Schedule;

// @Repository
// public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

//     @Query("SELECT s FROM Schedule s WHERE s.homeTeam.id = :teamId OR s.awayTeam.id = :teamId")
//     List<Schedule> findByTeamId(Long teamId);
// }
