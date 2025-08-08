// package cammossleague.service;

// import java.util.List;

// import org.springframework.beans.factory.annotation.Autowired;

// import cammossleague.model.Season;
// import cammossleague.repository.SeasonRepository;

// public class SeasonService {
    
//     @Autowired private SeasonRepository seasonRepo;

//     //all
//     public List<Season> getAllSeasons() {   
//         return seasonRepo.findAll();
//     }

//     public Season getSeasonById(Long seasonId) {
//         return seasonRepo.findById(seasonId).orElse(null);
//     }   

//     //save
//     public Season save(Season season) {
//         return seasonRepo.save(season);
//     }

// }
