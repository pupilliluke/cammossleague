package cammossleague.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cammossleague.model.Season;
import cammossleague.repository.SeasonRepository;

@Service
public class SeasonService {
    
    @Autowired 
    private SeasonRepository seasonRepository;

    public List<Season> getAllSeasons() {   
        return seasonRepository.findAll();
    }

    public Season getSeasonById(Long seasonId) {
        return seasonRepository.findById(seasonId).orElse(null);
    }   

    public Season save(Season season) {
        return seasonRepository.save(season);
    }
    
    public List<Season> getActiveSeasons() {
        return seasonRepository.findAllByIsActiveTrue();
    }
    
    public Season getActiveSeason() {
        return seasonRepository.findByIsActiveTrue().orElse(null);
    }
    
    public Season getCurrentSeason() {
        return seasonRepository.findByIsActiveTrue().orElse(null);
    }
}