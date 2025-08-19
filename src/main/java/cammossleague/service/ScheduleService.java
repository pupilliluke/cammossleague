// package cammossleague.service;

// import java.util.List;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import cammossleague.model.Schedule;
// import cammossleague.repository.ScheduleRepository;

// @Service
// public class ScheduleService {
//     @Autowired private ScheduleRepository scheduleRepo;

//     //all
//     public List<Schedule> getAllSchedules(){
//         return scheduleRepo.findAll();
//     }

//     //team
//     public List<Schedule> getSchedulesByTeam(Long teamId) {
//         return scheduleRepo.findByTeamId(teamId);
//     }

//     //save
//     public Schedule save(Schedule schedule) {
//         return scheduleRepo.save(schedule);
//     }

//     public Schedule update(Schedule schedule) {
//         // TODO Auto-generated method stub
//         throw new UnsupportedOperationException("Unimplemented method 'update'");
//     }

//     public void delete(Long scheduleId) {
//         // TODO Auto-generated method stub
//         throw new UnsupportedOperationException("Unimplemented method 'delete'");
//     }

//     public Schedule getScheduleById(Long scheduleId) {
//         // TODO Auto-generated method stub
//         throw new UnsupportedOperationException("Unimplemented method 'getScheduleById'");
//     }
// }
