package cammossleague.service;

import cammossleague.dto.PlayoffBracketDTO;
import cammossleague.dto.PlayoffMatchDTO;
import cammossleague.model.*;
import cammossleague.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PlayoffServiceTest {

    @Mock
    private PlayoffBracketRepository bracketRepository;

    @Mock
    private PlayoffMatchRepository matchRepository;

    @Mock
    private SeasonRepository seasonRepository;

    @Mock
    private TeamRepository teamRepository;

    @Mock
    private GameRepository gameRepository;

    @InjectMocks
    private PlayoffService playoffService;

    private Season testSeason;
    private PlayoffBracket testBracket;
    private Team team1, team2;

    @BeforeEach
    void setUp() {
        testSeason = Season.builder()
                                .name("Test Season")
                .year(2025)
                .seasonType(Season.SeasonType.SUMMER)
                .startDate(LocalDate.of(2025, 6, 1))
                .endDate(LocalDate.of(2025, 8, 31))
                .isActive(true)
                .build();

        testBracket = PlayoffBracket.builder()
                                .season(testSeason)
                .bracketName("Test Playoffs")
                .bracketType(PlayoffBracket.BracketType.SINGLE_ELIMINATION)
                .maxTeams(8)
                .currentRound(1)
                .isActive(false)
                .isCompleted(false)
                .build();

        team1 = Team.builder()
                .name("Team 1")
                .season(testSeason)
                .build();

        team2 = Team.builder()
                .name("Team 2")
                .season(testSeason)
                .build();
    }

    @Test
    void getAllBrackets_ShouldReturnPageOfBrackets() {
        // Given
        Page<PlayoffBracket> brackets = new PageImpl<>(List.of(testBracket));
        when(bracketRepository.findAll(any(PageRequest.class))).thenReturn(brackets);

        // When
        Page<PlayoffBracketDTO> result = playoffService.getAllBrackets(PageRequest.of(0, 10));

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getBracketName()).isEqualTo("Test Playoffs");
    }

    @Test
    void getBracketById_WhenBracketExists_ShouldReturnBracketDTO() {
        // Given
        when(bracketRepository.findById(1L)).thenReturn(Optional.of(testBracket));
        when(matchRepository.findByBracketIdOrderByRoundNumberAscPositionInRoundAsc(1L))
                .thenReturn(List.of());

        // When
        PlayoffBracketDTO result = playoffService.getBracketById(1L);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getBracketName()).isEqualTo("Test Playoffs");
        assertThat(result.getMaxTeams()).isEqualTo(8);
    }

    @Test
    void getBracketById_WhenBracketNotExists_ShouldThrowException() {
        // Given
        when(bracketRepository.findById(1L)).thenReturn(Optional.empty());

        // When/Then
        assertThatThrownBy(() -> playoffService.getBracketById(1L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Bracket not found");
    }

    @Test
    void createBracket_WhenValid_ShouldCreateBracket() {
        // Given
        PlayoffBracketDTO bracketDTO = PlayoffBracketDTO.builder()
                .seasonId(1L)
                .bracketName("New Playoffs")
                .bracketType("SINGLE_ELIMINATION")
                .maxTeams(8)
                .build();

        when(seasonRepository.findById(1L)).thenReturn(Optional.of(testSeason));
        when(bracketRepository.existsBySeasonIdAndIsActiveTrue(1L)).thenReturn(false);
        when(bracketRepository.save(any(PlayoffBracket.class))).thenReturn(testBracket);

        // When
        PlayoffBracketDTO result = playoffService.createBracket(bracketDTO);

        // Then
        assertThat(result).isNotNull();
        verify(bracketRepository).save(any(PlayoffBracket.class));
    }

    @Test
    void createBracket_WhenActiveBracketExists_ShouldThrowException() {
        // Given
        PlayoffBracketDTO bracketDTO = PlayoffBracketDTO.builder()
                .seasonId(1L)
                .bracketName("New Playoffs")
                .bracketType("SINGLE_ELIMINATION")
                .maxTeams(8)
                .build();

        when(seasonRepository.findById(1L)).thenReturn(Optional.of(testSeason));
        when(bracketRepository.existsBySeasonIdAndIsActiveTrue(1L)).thenReturn(true);

        // When/Then
        assertThatThrownBy(() -> playoffService.createBracket(bracketDTO))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("active bracket already exists");
    }

    @Test
    void activateBracket_ShouldActivateBracketAndDeactivateOthers() {
        // Given
        PlayoffBracket otherBracket = PlayoffBracket.builder()
                                .season(testSeason)
                .bracketName("Other Bracket")
                .isActive(true)
                .build();

        when(bracketRepository.findById(1L)).thenReturn(Optional.of(testBracket));
        when(bracketRepository.findBySeasonId(1L)).thenReturn(List.of(testBracket, otherBracket));
        when(bracketRepository.save(testBracket)).thenReturn(testBracket);

        // When
        PlayoffBracketDTO result = playoffService.activateBracket(1L);

        // Then
        assertThat(result).isNotNull();
        verify(bracketRepository).saveAll(any(List.class));
        verify(bracketRepository).save(testBracket);
    }

    @Test
    void seedBracket_WhenValid_ShouldCreateFirstRoundMatches() {
        // Given
        List<Long> teamIds = List.of(1L, 2L);
        List<Team> teams = List.of(team1, team2);

        when(bracketRepository.findById(1L)).thenReturn(Optional.of(testBracket));
        when(teamRepository.findAllById(teamIds)).thenReturn(teams);
        when(matchRepository.findByBracketIdOrderByRoundNumberAscPositionInRoundAsc(1L))
                .thenReturn(List.of());
        when(matchRepository.saveAll(any(List.class))).thenReturn(List.of());

        // When
        List<PlayoffMatchDTO> result = playoffService.seedBracket(1L, teamIds);

        // Then
        assertThat(result).isNotNull();
        verify(matchRepository).deleteAll(any(List.class));
        verify(matchRepository).saveAll(any(List.class));
    }

    @Test
    void seedBracket_WhenTooManyTeams_ShouldThrowException() {
        // Given
        List<Long> teamIds = List.of(1L, 2L, 3L, 4L, 5L, 6L, 7L, 8L, 9L); // 9 teams for 8-team bracket

        when(bracketRepository.findById(1L)).thenReturn(Optional.of(testBracket));

        // When/Then
        assertThatThrownBy(() -> playoffService.seedBracket(1L, teamIds))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Too many teams");
    }

    @Test
    void advanceWinner_WhenValidWinner_ShouldUpdateMatchAndCreateNextRound() {
        // Given
        PlayoffMatch match = PlayoffMatch.builder()
                                .bracket(testBracket)
                .team1(team1)
                .team2(team2)
                .roundNumber(1)
                .positionInRound(1)
                .isCompleted(false)
                .build();

        when(matchRepository.findById(1L)).thenReturn(Optional.of(match));
        when(teamRepository.findById(1L)).thenReturn(Optional.of(team1));
        when(matchRepository.save(match)).thenReturn(match);
        when(matchRepository.findByBracketAndRoundOrderByPosition(1L, 2))
                .thenReturn(List.of());
        when(matchRepository.findByBracketIdOrderByRoundNumberAscPositionInRoundAsc(1L))
                .thenReturn(List.of(match));

        // When
        List<PlayoffMatchDTO> result = playoffService.advanceWinner(1L, 1L, 1L);

        // Then
        assertThat(result).isNotNull();
        verify(matchRepository).save(match);
        assertThat(match.getWinner()).isEqualTo(team1);
        assertThat(match.getIsCompleted()).isTrue();
    }

    @Test
    void advanceWinner_WhenInvalidWinner_ShouldThrowException() {
        // Given
        PlayoffMatch match = PlayoffMatch.builder()
                                .bracket(testBracket)
                .team1(team1)
                .team2(team2)
                .roundNumber(1)
                .positionInRound(1)
                .isCompleted(false)
                .build();

        Team invalidTeam = Team.builder().name("Invalid Team").build();

        when(matchRepository.findById(1L)).thenReturn(Optional.of(match));
        when(teamRepository.findById(3L)).thenReturn(Optional.of(invalidTeam));

        // When/Then
        assertThatThrownBy(() -> playoffService.advanceWinner(1L, 1L, 3L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Winner must be one of the teams");
    }

    @Test
    void getBracketMatches_ShouldReturnSortedMatches() {
        // Given
        PlayoffMatch match1 = PlayoffMatch.builder()
                                .bracket(testBracket)
                .team1(team1)
                .team2(team2)
                .roundNumber(1)
                .positionInRound(1)
                .build();

        when(matchRepository.findByBracketIdOrderByRoundNumberAscPositionInRoundAsc(1L))
                .thenReturn(List.of(match1));

        // When
        List<PlayoffMatchDTO> result = playoffService.getBracketMatches(1L);

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getBracketId()).isEqualTo(1L);
        assertThat(result.get(0).getRoundNumber()).isEqualTo(1);
    }

    @Test
    void completeMatch_WhenValid_ShouldCompleteMatch() {
        // Given
        PlayoffMatch match = PlayoffMatch.builder()
                                .bracket(testBracket)
                .team1(team1)
                .team2(team2)
                .isCompleted(false)
                .build();

        when(matchRepository.findById(1L)).thenReturn(Optional.of(match));
        when(teamRepository.findById(1L)).thenReturn(Optional.of(team1));
        when(matchRepository.save(match)).thenReturn(match);
        when(matchRepository.countByBracketId(1L)).thenReturn(1L);
        when(matchRepository.countByBracketIdAndIsCompletedTrue(1L)).thenReturn(1L);
        when(bracketRepository.findById(1L)).thenReturn(Optional.of(testBracket));

        // When
        PlayoffMatchDTO result = playoffService.completeMatch(1L, 1L);

        // Then
        assertThat(result).isNotNull();
        assertThat(match.getWinner()).isEqualTo(team1);
        assertThat(match.getIsCompleted()).isTrue();
        verify(matchRepository).save(match);
    }

    @Test
    void deleteBracket_WhenBracketExists_ShouldDeleteBracket() {
        // Given
        when(bracketRepository.existsById(1L)).thenReturn(true);

        // When
        playoffService.deleteBracket(1L);

        // Then
        verify(bracketRepository).deleteById(1L);
    }

    @Test
    void deleteBracket_WhenBracketNotExists_ShouldThrowException() {
        // Given
        when(bracketRepository.existsById(1L)).thenReturn(false);

        // When/Then
        assertThatThrownBy(() -> playoffService.deleteBracket(1L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Bracket not found");
    }
}