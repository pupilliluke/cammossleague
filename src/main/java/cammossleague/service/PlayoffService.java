package cammossleague.service;

import cammossleague.dto.PlayoffBracketDTO;
import cammossleague.dto.PlayoffMatchDTO;
import cammossleague.model.*;
import cammossleague.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PlayoffService {
    
    private final PlayoffBracketRepository bracketRepository;
    private final PlayoffMatchRepository matchRepository;
    private final SeasonRepository seasonRepository;
    private final TeamRepository teamRepository;
    private final GameRepository gameRepository;
    
    public Page<PlayoffBracketDTO> getAllBrackets(Pageable pageable) {
        Page<PlayoffBracket> brackets = bracketRepository.findAll(pageable);
        List<PlayoffBracketDTO> bracketDTOs = brackets.getContent().stream()
                .map(PlayoffBracketDTO::fromEntity)
                .collect(Collectors.toList());
        return new PageImpl<>(bracketDTOs, pageable, brackets.getTotalElements());
    }
    
    public PlayoffBracketDTO getBracketById(Long id) {
        PlayoffBracket bracket = bracketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bracket not found with id: " + id));
        
        PlayoffBracketDTO bracketDTO = PlayoffBracketDTO.fromEntity(bracket);
        List<PlayoffMatchDTO> matches = getBracketMatches(id);
        bracketDTO.setMatches(matches);
        
        return bracketDTO;
    }
    
    public PlayoffBracketDTO createBracket(PlayoffBracketDTO bracketDTO) {
        Season season = seasonRepository.findById(bracketDTO.getSeasonId())
                .orElseThrow(() -> new RuntimeException("Season not found with id: " + bracketDTO.getSeasonId()));
        
        // Check if there's already an active bracket for this season
        if (bracketRepository.existsBySeasonIdAndIsActiveTrue(bracketDTO.getSeasonId())) {
            throw new RuntimeException("An active bracket already exists for this season");
        }
        
        PlayoffBracket bracket = PlayoffBracket.builder()
                .season(season)
                .bracketName(bracketDTO.getBracketName())
                .bracketType(PlayoffBracket.BracketType.valueOf(bracketDTO.getBracketType()))
                .maxTeams(bracketDTO.getMaxTeams())
                .currentRound(1)
                .isActive(false)
                .isCompleted(false)
                .build();
        
        PlayoffBracket savedBracket = bracketRepository.save(bracket);
        return PlayoffBracketDTO.fromEntity(savedBracket);
    }
    
    public PlayoffBracketDTO updateBracket(Long id, PlayoffBracketDTO bracketDTO) {
        PlayoffBracket bracket = bracketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bracket not found with id: " + id));
        
        bracket.setBracketName(bracketDTO.getBracketName());
        bracket.setBracketType(PlayoffBracket.BracketType.valueOf(bracketDTO.getBracketType()));
        bracket.setMaxTeams(bracketDTO.getMaxTeams());
        
        PlayoffBracket updatedBracket = bracketRepository.save(bracket);
        return PlayoffBracketDTO.fromEntity(updatedBracket);
    }
    
    public void deleteBracket(Long id) {
        if (!bracketRepository.existsById(id)) {
            throw new RuntimeException("Bracket not found with id: " + id);
        }
        bracketRepository.deleteById(id);
    }
    
    public PlayoffBracketDTO activateBracket(Long id) {
        PlayoffBracket bracket = bracketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bracket not found with id: " + id));
        
        // Deactivate other brackets for this season
        List<PlayoffBracket> seasonBrackets = bracketRepository.findBySeasonId(bracket.getSeason().getId());
        seasonBrackets.forEach(b -> b.setIsActive(false));
        bracketRepository.saveAll(seasonBrackets);
        
        // Activate this bracket
        bracket.setIsActive(true);
        PlayoffBracket activatedBracket = bracketRepository.save(bracket);
        
        return PlayoffBracketDTO.fromEntity(activatedBracket);
    }
    
    public List<PlayoffMatchDTO> seedBracket(Long bracketId, List<Long> teamIds) {
        PlayoffBracket bracket = bracketRepository.findById(bracketId)
                .orElseThrow(() -> new RuntimeException("Bracket not found with id: " + bracketId));
        
        if (teamIds.size() > bracket.getMaxTeams()) {
            throw new RuntimeException("Too many teams for this bracket size");
        }
        
        // Clear existing matches
        List<PlayoffMatch> existingMatches = matchRepository.findByBracketIdOrderByRoundNumberAscPositionInRoundAsc(bracketId);
        matchRepository.deleteAll(existingMatches);
        
        // Create first round matches
        List<PlayoffMatch> firstRoundMatches = createFirstRoundMatches(bracket, teamIds);
        matchRepository.saveAll(firstRoundMatches);
        
        return firstRoundMatches.stream()
                .map(PlayoffMatchDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    private List<PlayoffMatch> createFirstRoundMatches(PlayoffBracket bracket, List<Long> teamIds) {
        List<PlayoffMatch> matches = new ArrayList<>();
        List<Team> teams = teamRepository.findAllById(teamIds);
        
        // Shuffle teams for randomization (or implement seeding logic)
        Collections.shuffle(teams);
        
        int matchNumber = 1;
        for (int i = 0; i < teams.size(); i += 2) {
            if (i + 1 < teams.size()) {
                PlayoffMatch match = PlayoffMatch.builder()
                        .bracket(bracket)
                        .team1(teams.get(i))
                        .team2(teams.get(i + 1))
                        .roundNumber(1)
                        .matchNumber(matchNumber)
                        .positionInRound(matchNumber)
                        .isCompleted(false)
                        .build();
                matches.add(match);
                matchNumber++;
            }
        }
        
        return matches;
    }
    
    public List<PlayoffMatchDTO> advanceWinner(Long bracketId, Long matchId, Long winnerId) {
        PlayoffMatch match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found with id: " + matchId));
        
        Team winner = teamRepository.findById(winnerId)
                .orElseThrow(() -> new RuntimeException("Team not found with id: " + winnerId));
        
        // Validate winner is part of this match
        if (!winner.getId().equals(match.getTeam1().getId()) && !winner.getId().equals(match.getTeam2().getId())) {
            throw new RuntimeException("Winner must be one of the teams in this match");
        }
        
        // Update match with winner
        match.setWinner(winner);
        match.setIsCompleted(true);
        matchRepository.save(match);
        
        // Create or update next round match
        createOrUpdateNextRoundMatch(match);
        
        // Return updated bracket matches
        return getBracketMatches(bracketId);
    }
    
    private void createOrUpdateNextRoundMatch(PlayoffMatch completedMatch) {
        PlayoffBracket bracket = completedMatch.getBracket();
        int nextRound = completedMatch.getRoundNumber() + 1;
        int nextMatchPosition = (completedMatch.getPositionInRound() + 1) / 2;
        
        // Check if next round match exists
        List<PlayoffMatch> nextRoundMatches = matchRepository.findByBracketAndRoundOrderByPosition(
                bracket.getId(), nextRound);
        
        PlayoffMatch nextMatch = nextRoundMatches.stream()
                .filter(m -> m.getPositionInRound() == nextMatchPosition)
                .findFirst()
                .orElse(null);
        
        if (nextMatch == null) {
            // Create new match for next round
            nextMatch = PlayoffMatch.builder()
                    .bracket(bracket)
                    .roundNumber(nextRound)
                    .matchNumber(nextRoundMatches.size() + 1)
                    .positionInRound(nextMatchPosition)
                    .isCompleted(false)
                    .build();
        }
        
        // Assign winner to appropriate team slot
        if (completedMatch.getPositionInRound() % 2 == 1) {
            nextMatch.setTeam1(completedMatch.getWinner());
        } else {
            nextMatch.setTeam2(completedMatch.getWinner());
        }
        
        matchRepository.save(nextMatch);
    }
    
    public List<PlayoffMatchDTO> getBracketMatches(Long bracketId) {
        List<PlayoffMatch> matches = matchRepository.findByBracketIdOrderByRoundNumberAscPositionInRoundAsc(bracketId);
        return matches.stream()
                .map(PlayoffMatchDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public PlayoffMatchDTO updateMatch(Long id, PlayoffMatchDTO matchDTO) {
        PlayoffMatch match = matchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Match not found with id: " + id));
        
        match.setNotes(matchDTO.getNotes());
        
        if (matchDTO.getGameId() != null) {
            Game game = gameRepository.findById(matchDTO.getGameId())
                    .orElseThrow(() -> new RuntimeException("Game not found with id: " + matchDTO.getGameId()));
            match.setGame(game);
        }
        
        PlayoffMatch updatedMatch = matchRepository.save(match);
        return PlayoffMatchDTO.fromEntity(updatedMatch);
    }
    
    public PlayoffMatchDTO completeMatch(Long id, Long winnerId) {
        PlayoffMatch match = matchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Match not found with id: " + id));
        
        Team winner = teamRepository.findById(winnerId)
                .orElseThrow(() -> new RuntimeException("Team not found with id: " + winnerId));
        
        match.setWinner(winner);
        match.setIsCompleted(true);
        
        PlayoffMatch completedMatch = matchRepository.save(match);
        
        // Check if bracket is completed
        checkBracketCompletion(match.getBracket().getId());
        
        return PlayoffMatchDTO.fromEntity(completedMatch);
    }
    
    private void checkBracketCompletion(Long bracketId) {
        PlayoffBracket bracket = bracketRepository.findById(bracketId)
                .orElseThrow(() -> new RuntimeException("Bracket not found"));
        
        long totalMatches = matchRepository.countByBracketId(bracketId);
        long completedMatches = matchRepository.countByBracketIdAndIsCompletedTrue(bracketId);
        
        if (totalMatches > 0 && totalMatches == completedMatches) {
            bracket.setIsCompleted(true);
            bracketRepository.save(bracket);
        }
    }
}