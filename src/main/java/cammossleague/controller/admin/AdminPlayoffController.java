package cammossleague.controller.admin;

import cammossleague.dto.PlayoffBracketDTO;
import cammossleague.dto.PlayoffMatchDTO;
import cammossleague.service.PlayoffService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/playoffs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminPlayoffController {
    
    private final PlayoffService playoffService;
    
    @GetMapping("/brackets")
    public ResponseEntity<Page<PlayoffBracketDTO>> getAllBrackets(Pageable pageable) {
        Page<PlayoffBracketDTO> brackets = playoffService.getAllBrackets(pageable);
        return ResponseEntity.ok(brackets);
    }
    
    @GetMapping("/brackets/{id}")
    public ResponseEntity<PlayoffBracketDTO> getBracket(@PathVariable Long id) {
        PlayoffBracketDTO bracket = playoffService.getBracketById(id);
        return ResponseEntity.ok(bracket);
    }
    
    @PostMapping("/brackets")
    public ResponseEntity<PlayoffBracketDTO> createBracket(@Valid @RequestBody PlayoffBracketDTO bracketDTO) {
        PlayoffBracketDTO createdBracket = playoffService.createBracket(bracketDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBracket);
    }
    
    @PutMapping("/brackets/{id}")
    public ResponseEntity<PlayoffBracketDTO> updateBracket(@PathVariable Long id, @Valid @RequestBody PlayoffBracketDTO bracketDTO) {
        PlayoffBracketDTO updatedBracket = playoffService.updateBracket(id, bracketDTO);
        return ResponseEntity.ok(updatedBracket);
    }
    
    @DeleteMapping("/brackets/{id}")
    public ResponseEntity<Void> deleteBracket(@PathVariable Long id) {
        playoffService.deleteBracket(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/brackets/{id}/activate")
    public ResponseEntity<PlayoffBracketDTO> activateBracket(@PathVariable Long id) {
        PlayoffBracketDTO bracket = playoffService.activateBracket(id);
        return ResponseEntity.ok(bracket);
    }
    
    @PostMapping("/brackets/{id}/seed")
    public ResponseEntity<List<PlayoffMatchDTO>> seedBracket(@PathVariable Long id, @RequestBody List<Long> teamIds) {
        List<PlayoffMatchDTO> matches = playoffService.seedBracket(id, teamIds);
        return ResponseEntity.ok(matches);
    }
    
    @PostMapping("/brackets/{bracketId}/matches/{matchId}/advance")
    public ResponseEntity<List<PlayoffMatchDTO>> advanceWinner(@PathVariable Long bracketId, @PathVariable Long matchId, @RequestParam Long winnerId) {
        List<PlayoffMatchDTO> updatedMatches = playoffService.advanceWinner(bracketId, matchId, winnerId);
        return ResponseEntity.ok(updatedMatches);
    }
    
    @GetMapping("/brackets/{id}/matches")
    public ResponseEntity<List<PlayoffMatchDTO>> getBracketMatches(@PathVariable Long id) {
        List<PlayoffMatchDTO> matches = playoffService.getBracketMatches(id);
        return ResponseEntity.ok(matches);
    }
    
    @PutMapping("/matches/{id}")
    public ResponseEntity<PlayoffMatchDTO> updateMatch(@PathVariable Long id, @Valid @RequestBody PlayoffMatchDTO matchDTO) {
        PlayoffMatchDTO updatedMatch = playoffService.updateMatch(id, matchDTO);
        return ResponseEntity.ok(updatedMatch);
    }
    
    @PostMapping("/matches/{id}/complete")
    public ResponseEntity<PlayoffMatchDTO> completeMatch(@PathVariable Long id, @RequestParam Long winnerId) {
        PlayoffMatchDTO completedMatch = playoffService.completeMatch(id, winnerId);
        return ResponseEntity.ok(completedMatch);
    }
}