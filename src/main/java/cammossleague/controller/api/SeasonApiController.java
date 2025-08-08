package cammossleague.controller.api;

import cammossleague.model.Season;
import cammossleague.repository.SeasonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/seasons")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class SeasonApiController {

    @Autowired
    private SeasonRepository seasonRepository;

    @GetMapping
    public ResponseEntity<List<Season>> getAllSeasons() {
        List<Season> seasons = seasonRepository.findAll();
        return ResponseEntity.ok(seasons);
    }

    @GetMapping("/active")
    public ResponseEntity<Season> getActiveSeason() {
        Optional<Season> activeSeason = seasonRepository.findByIsActiveTrue();
        return activeSeason.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.noContent().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Season> getSeasonById(@PathVariable Long id) {
        Optional<Season> season = seasonRepository.findById(id);
        return season.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }
}