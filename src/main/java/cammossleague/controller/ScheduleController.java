// package cammossleague.controller;

// import java.util.List;

// import org.springframework.beans.factory.annotation.Autowired;

// import cammossleague.model.Schedule;
// import cammossleague.service.ScheduleService;

// public class ScheduleController {
    
//     @Autowired
//     private ScheduleService scheduleService;

//     public List<Schedule> getAllSchedules(){
//         return scheduleService.getAllSchedules();
//     }

//     public List<Schedule> getSchedulesByTeam(Long teamId) {
//         return scheduleService.getSchedulesByTeam(teamId);
//     }

//     public Schedule create(Schedule schedule) {
//         return scheduleService.save(schedule);
//     }

//     public Schedule update(Schedule schedule) {
//         return scheduleService.update(schedule);
//     }

//     public void delete(Long scheduleId) {
//         scheduleService.delete(scheduleId);
//     }
    
//     public Schedule getScheduleById(Long scheduleId) {
//         return scheduleService.getScheduleById(scheduleId);
//     }
// }

