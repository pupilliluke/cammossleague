package cammossleague.config;

import cammossleague.model.*;
import cammossleague.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
@Profile({"dev", "local"}) // Only run in development/local profiles
public class DataInitializer implements CommandLineRunner {

    private final SeasonRepository seasonRepository;
    private final TeamRepository teamRepository;
    private final PlayerRepository playerRepository;
    private final PlayerTeamRepository playerTeamRepository;
    private final UserRepository userRepository;
    private final GameRepository gameRepository;
    private final FormSubmissionRepository formSubmissionRepository;
    private final LeagueUpdateRepository leagueUpdateRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        log.info("Checking if data initialization is needed...");
        
        // Skip if data already exists
        if (userRepository.count() > 0) {
            log.info("Data already exists, skipping initialization");
            return;
        }

        try {
            log.info("Initializing comprehensive test data...");
            
            createUsers();
            Season activeSeason = createLeagueAndSeasons();
            createTeamsAndPlayers(activeSeason);
            createGamesAndSchedule();
            createFormSubmissions();
            createLeagueUpdates();
            
            log.info("Test data initialization completed successfully");
        } catch (Exception e) {
            log.error("Error initializing test data", e);
        }
    }

    private void createUsers() {
        log.info("Creating users...");
        
        // Create admin user
        User admin = User.builder()
                .username("admin")
                .passwordHash(passwordEncoder.encode("admin123"))
                .email("admin@cammossleague.com")
                .firstName("System")
                .lastName("Administrator")
                .role(User.Role.ADMIN)
                .isActive(true)
                .build();
        userRepository.save(admin);

        // Create regular users/players
        List<User> players = List.of(
            createUser("jdoe", "john.doe@email.com", "John", "Doe", "555-0101"),
            createUser("msmith", "mike.smith@email.com", "Mike", "Smith", "555-0102"),
            createUser("sjones", "sarah.jones@email.com", "Sarah", "Jones", "555-0103"),
            createUser("bwilson", "bob.wilson@email.com", "Bob", "Wilson", "555-0104"),
            createUser("ljohnson", "lisa.johnson@email.com", "Lisa", "Johnson", "555-0105"),
            createUser("dbrook", "david.brook@email.com", "David", "Brook", "555-0106"),
            createUser("amartin", "anna.martin@email.com", "Anna", "Martin", "555-0107"),
            createUser("cgarcia", "carlos.garcia@email.com", "Carlos", "Garcia", "555-0108"),
            createUser("jlee", "jenny.lee@email.com", "Jenny", "Lee", "555-0109"),
            createUser("rthomas", "robert.thomas@email.com", "Robert", "Thomas", "555-0110"),
            createUser("kwhite", "karen.white@email.com", "Karen", "White", "555-0111"),
            createUser("mdavis", "mark.davis@email.com", "Mark", "Davis", "555-0112")
        );
        userRepository.saveAll(players);
        
        log.info("Created {} users", players.size() + 1);
    }

    private User createUser(String username, String email, String firstName, String lastName, String phone) {
        return User.builder()
                .username(username)
                .passwordHash(passwordEncoder.encode("player123"))
                .email(email)
                .firstName(firstName)
                .lastName(lastName)
                .phone(phone)
                .role(User.Role.PLAYER)
                .isActive(true)
                .isFreeAgent(false)
                .build();
    }

    private Season createLeagueAndSeasons() {
        log.info("Creating seasons...");
        
        // Create active season (Summer 2025)
        Season season = Season.builder()
                .name("Summer League")
                .year(2025)
                .seasonType(Season.SeasonType.SUMMER)
                .startDate(LocalDate.of(2025, 6, 1))
                .endDate(LocalDate.of(2025, 8, 31))
                .registrationOpenDate(LocalDate.of(2025, 4, 1))
                .registrationCloseDate(LocalDate.of(2025, 5, 15))
                .playoffStartDate(LocalDate.of(2025, 8, 1))
                .isActive(true)
                .isRegistrationOpen(true)
                .maxTeams(12)
                .maxPlayersPerTeam(12)
                .description("Summer 2025 basketball season featuring 12 weeks of regular season play followed by playoffs")
                .build();
        season = seasonRepository.save(season);
        
        log.info("Created season: {}", season.getName());
        return season;
    }

    private void createTeamsAndPlayers(Season season) {
        log.info("Creating teams and players...");
        
        List<User> users = userRepository.findByRole(User.Role.PLAYER);

        // Create teams
        List<String> teamNames = List.of(
                "Thunder Bolts", "Lightning Hawks", "Storm Riders", 
                "Fire Dragons", "Ice Warriors", "Wind Runners"
        );
        
        List<String> teamColors = List.of(
                "Blue", "Red", "Green", "Orange", "Purple", "Yellow"
        );

        for (int i = 0; i < teamNames.size(); i++) {
            User captain = users.get(i);
            
            Team team = Team.builder()
                    .name(teamNames.get(i))
                    .season(season)
                    .captain(captain)
                    .primaryColor(teamColors.get(i))
                    .wins(0)
                    .losses(0)
                    .pointsFor(0)
                    .pointsAgainst(0)
                    .build();
            
            Team savedTeam = teamRepository.save(team);
            
            // Create players for each team (2 players per team)
            for (int j = 0; j < 2 && (i * 2 + j) < users.size(); j++) {
                User user = users.get(i * 2 + j);
                
                Player player = Player.builder()
                        .user(user)
                        .season(season)
                        .jerseyNumber((i * 10) + j + 1)
                        .position(j == 0 ? Player.Position.PG : Player.Position.SF)
                        .heightInches(j == 0 ? 70 : 74)
                        .yearsExperience(2 + j)
                        .isActive(true)
                        .statsGamesPlayed(0)
                        .statsPoints(0)
                        .statsRebounds(0)
                        .statsAssists(0)
                        .build();
                
                Player savedPlayer = playerRepository.save(player);
                
                // Add player to team
                PlayerTeam playerTeam = PlayerTeam.builder()
                        .player(savedPlayer)
                        .team(savedTeam)
                        .status(PlayerTeam.Status.ACTIVE)
                        .build();
                
                playerTeamRepository.save(playerTeam);
            }
        }
        
        log.info("Created {} teams with players", teamNames.size());
    }

    private void createGamesAndSchedule() {
        log.info("Creating games and schedule...");
        
        Season season = seasonRepository.findByIsActiveTrueAndYear(2025).get(0);
        List<Team> teams = teamRepository.findBySeasonId(season.getId());

        LocalDate gameDate = LocalDate.of(2025, 6, 2);
        LocalTime gameTime = LocalTime.of(19, 0);

        // Create 4 weeks of games
        for (int week = 1; week <= 4; week++) {
            for (int i = 0; i < teams.size(); i += 2) {
                if (i + 1 < teams.size()) {
                    Team homeTeam = teams.get(i);
                    Team awayTeam = teams.get(i + 1);

                    Game game = Game.builder()
                            .season(season)
                            .homeTeam(homeTeam)
                            .awayTeam(awayTeam)
                            .gameDate(gameDate)
                            .gameTime(gameTime)
                            .location("Community Center")
                            .courtNumber("Court " + ((i / 2) + 1))
                            .weekNumber(week)
                            .gameType(Game.GameType.REGULAR)
                            .isCompleted(week <= 2) // First 2 weeks completed
                            .build();

                    // Add scores for completed games
                    if (week <= 2) {
                        int homeScore = 75 + (int)(Math.random() * 20);
                        int awayScore = 75 + (int)(Math.random() * 20);
                        
                        game.setHomeScore(homeScore);
                        game.setAwayScore(awayScore);
                        
                        // Update team records
                        if (homeScore > awayScore) {
                            homeTeam.setWins(homeTeam.getWins() + 1);
                            awayTeam.setLosses(awayTeam.getLosses() + 1);
                        } else {
                            awayTeam.setWins(awayTeam.getWins() + 1);
                            homeTeam.setLosses(homeTeam.getLosses() + 1);
                        }
                        
                        homeTeam.setPointsFor(homeTeam.getPointsFor() + homeScore);
                        homeTeam.setPointsAgainst(homeTeam.getPointsAgainst() + awayScore);
                        awayTeam.setPointsFor(awayTeam.getPointsFor() + awayScore);
                        awayTeam.setPointsAgainst(awayTeam.getPointsAgainst() + homeScore);
                        
                        teamRepository.save(homeTeam);
                        teamRepository.save(awayTeam);
                    }

                    gameRepository.save(game);
                    gameTime = gameTime.plusHours(1);
                }
            }
            gameDate = gameDate.plusWeeks(1);
            gameTime = LocalTime.of(19, 0);
        }
        
        log.info("Created games for 4 weeks");
    }

    private void createFormSubmissions() {
        log.info("Creating form submissions...");
        
        Season season = seasonRepository.findByIsActiveTrueAndYear(2025).get(0);

        List<FormSubmission> submissions = List.of(
            FormSubmission.builder()
                .formType(FormSubmission.FormType.COMPLAINT)
                .submitterName("John Player")
                .submitterEmail("john.player@email.com")
                .subject("Referee Decision Complaint")
                .message("I would like to file a complaint about the referee's decision in last night's game between Thunder Bolts and Lightning Hawks.")
                .status(FormSubmission.SubmissionStatus.PENDING)
                .season(season)
                .build(),
                
            FormSubmission.builder()
                .formType(FormSubmission.FormType.TEAM_SIGNUP)
                .submitterName("New Team Captain")
                .submitterEmail("newteam@email.com")
                .subject("Team Registration for Summer 2025")
                .message("We would like to register a new team called 'Golden Eagles' for the Summer 2025 season. We have 8 committed players.")
                .status(FormSubmission.SubmissionStatus.IN_REVIEW)
                .season(season)
                .build(),
                
            FormSubmission.builder()
                .formType(FormSubmission.FormType.GENERAL_INQUIRY)
                .submitterName("Interested Player")
                .submitterEmail("player@email.com")
                .subject("How to Join the League")
                .message("Hi, I'm new to the area and interested in joining the basketball league. What's the process?")
                .status(FormSubmission.SubmissionStatus.PENDING)
                .build()
        );

        formSubmissionRepository.saveAll(submissions);
        log.info("Created {} form submissions", submissions.size());
    }

    private void createLeagueUpdates() {
        log.info("Creating league updates...");
        
        Season season = seasonRepository.findByIsActiveTrueAndYear(2025).get(0);
        User adminUser = userRepository.findByRole(User.Role.ADMIN).get(0);

        List<LeagueUpdate> updates = List.of(
            LeagueUpdate.builder()
                .season(season)
                .title("Welcome to Summer 2025 Season!")
                .content("The Summer 2025 season is officially underway! We have 6 competitive teams ready to battle it out.")
                .author(adminUser)
                .isPublished(true)
                .build(),
                
            LeagueUpdate.builder()
                .season(season)
                .title("Week 2 Recap")
                .content("Week 2 brought some thrilling matchups! Thunder Bolts, Fire Dragons, and Ice Warriors all secured victories.")
                .author(adminUser)
                .isPublished(true)
                .build()
        );

        leagueUpdateRepository.saveAll(updates);
        log.info("Created {} league updates", updates.size());
    }

    // Keep existing methods for compatibility...
    /* Deprecated method removed due to compilation errors
    private void initializeSampleData() {
        log.warn("Deprecated initializeSampleData method called - using new data initialization instead");
        createUsers();
        Season summer2025 = createLeagueAndSeasons();
        createTeamsAndPlayers(summer2025);
        createGamesAndSchedule();
        createFormSubmissions();
        createLeagueUpdates();

        // ===== CREATE TEAMS FOR SUMMER 2025 (CURRENT) =====
        
        List<Team> summer2025Teams = Arrays.asList(
            Team.builder().season(summer2025).name("Thunder Hawks").city("Downtown").primaryColor("#1E40AF").secondaryColor("#FFFFFF").wins(5).losses(1).pointsFor(468).pointsAgainst(421).build(),
            Team.builder().season(summer2025).name("Fire Dragons").city("Eastside").primaryColor("#DC2626").secondaryColor("#FBBF24").wins(4).losses(2).pointsFor(445).pointsAgainst(432).build(),
            Team.builder().season(summer2025).name("Lightning Bolts").city("Westside").primaryColor("#7C3AED").secondaryColor("#F3E8FF").wins(3).losses(3).pointsFor(428).pointsAgainst(435).build(),
            Team.builder().season(summer2025).name("Steel Warriors").city("Northside").primaryColor("#374151").secondaryColor("#9CA3AF").wins(3).losses(3).pointsFor(415).pointsAgainst(441).build(),
            Team.builder().season(summer2025).name("Crimson Phoenixes").city("Southside").primaryColor("#B91C1C").secondaryColor("#FEF2F2").wins(2).losses(4).pointsFor(398).pointsAgainst(456).build(),
            Team.builder().season(summer2025).name("Golden Eagles").city("Uptown").primaryColor("#D97706").secondaryColor("#FEF3C7").wins(1).losses(5).pointsFor(379).pointsAgainst(483).build()
        );

        // ===== CREATE TEAMS FOR WINTER 2024 (COMPLETED) =====
        
        List<Team> winter2024Teams = Arrays.asList(
            Team.builder().season(winter2024).name("Ice Wolves").city("North District").primaryColor("#1F2937").secondaryColor("#E5E7EB").wins(8).losses(2).pointsFor(792).pointsAgainst(698).build(),
            Team.builder().season(winter2024).name("Frost Giants").city("Highland").primaryColor("#3B82F6").secondaryColor("#DBEAFE").wins(7).losses(3).pointsFor(765).pointsAgainst(721).build(),
            Team.builder().season(winter2024).name("Blizzard Bulls").city("Central").primaryColor("#059669").secondaryColor("#D1FAE5").wins(6).losses(4).pointsFor(743).pointsAgainst(748).build(),
            Team.builder().season(winter2024).name("Arctic Storm").city("Riverside").primaryColor("#7C2D12").secondaryColor("#FED7AA").wins(4).losses(6).pointsFor(698).pointsAgainst(769).build()
        );

        // Save all teams
        List<Team> allTeams = new ArrayList<>();
        allTeams.addAll(summer2025Teams);
        allTeams.addAll(winter2024Teams);
        allTeams = teamRepository.saveAll(allTeams);
        System.out.println("✅ Created " + allTeams.size() + " teams across " + seasons.size() + " seasons");

        // ===== CREATE USERS FIRST =====
        
        List<User> users = Arrays.asList(
            User.builder().firebaseUid("user1").email("john.doe@example.com").firstName("John").lastName("Doe").role(User.Role.PLAYER).build(),
            User.builder().firebaseUid("user2").email("jane.smith@example.com").firstName("Jane").lastName("Smith").role(User.Role.PLAYER).build(),
            User.builder().firebaseUid("user3").email("mike.johnson@example.com").firstName("Mike").lastName("Johnson").role(User.Role.PLAYER).build(),
            User.builder().firebaseUid("user4").email("sarah.williams@example.com").firstName("Sarah").lastName("Williams").role(User.Role.PLAYER).build(),
            User.builder().firebaseUid("user5").email("david.brown@example.com").firstName("David").lastName("Brown").role(User.Role.PLAYER).build(),
            User.builder().firebaseUid("user6").email("emily.davis@example.com").firstName("Emily").lastName("Davis").role(User.Role.PLAYER).build(),
            User.builder().firebaseUid("user7").email("alex.miller@example.com").firstName("Alex").lastName("Miller").role(User.Role.PLAYER).build(),
            User.builder().firebaseUid("user8").email("lisa.wilson@example.com").firstName("Lisa").lastName("Wilson").role(User.Role.PLAYER).build(),
            User.builder().firebaseUid("user9").email("chris.moore@example.com").firstName("Chris").lastName("Moore").role(User.Role.PLAYER).build(),
            User.builder().firebaseUid("user10").email("rachel.taylor@example.com").firstName("Rachel").lastName("Taylor").role(User.Role.PLAYER).build(),
            User.builder().firebaseUid("user11").email("tom.anderson@example.com").firstName("Tom").lastName("Anderson").role(User.Role.PLAYER).build(),
            User.builder().firebaseUid("user12").email("amanda.thomas@example.com").firstName("Amanda").lastName("Thomas").role(User.Role.PLAYER).build()
        );
        users = userRepository.saveAll(users);
        System.out.println("✅ Created " + users.size() + " users");

        // ===== CREATE PLAYERS FOR CURRENT SEASON =====
        
        List<Player> summer2025Players = Arrays.asList(
            // Thunder Hawks
            Player.builder().user(users.get(0)).season(summer2025).jerseyNumber(23).position(Player.Position.SF).heightInches(78).weightLbs(195).yearsExperience(3).statsGamesPlayed(6).statsPoints(108).statsRebounds(42).statsAssists(24).build(),
            Player.builder().user(users.get(1)).season(summer2025).jerseyNumber(15).position(Player.Position.PG).heightInches(72).weightLbs(175).yearsExperience(2).statsGamesPlayed(6).statsPoints(84).statsRebounds(24).statsAssists(48).build(),
            
            // Fire Dragons  
            Player.builder().user(users.get(2)).season(summer2025).jerseyNumber(8).position(Player.Position.C).heightInches(82).weightLbs(220).yearsExperience(4).statsGamesPlayed(6).statsPoints(72).statsRebounds(54).statsAssists(12).build(),
            Player.builder().user(users.get(3)).season(summer2025).jerseyNumber(12).position(Player.Position.SG).heightInches(75).weightLbs(185).yearsExperience(1).statsGamesPlayed(6).statsPoints(96).statsRebounds(30).statsAssists(18).build(),
            
            // Lightning Bolts
            Player.builder().user(users.get(4)).season(summer2025).jerseyNumber(7).position(Player.Position.PF).heightInches(80).weightLbs(210).yearsExperience(2).statsGamesPlayed(6).statsPoints(78).statsRebounds(48).statsAssists(15).build(),
            Player.builder().user(users.get(5)).season(summer2025).jerseyNumber(21).position(Player.Position.PG).heightInches(70).weightLbs(165).yearsExperience(1).statsGamesPlayed(6).statsPoints(66).statsRebounds(18).statsAssists(42).build(),
            
            // Steel Warriors
            Player.builder().user(users.get(6)).season(summer2025).jerseyNumber(33).position(Player.Position.SF).heightInches(77).weightLbs(190).yearsExperience(3).statsGamesPlayed(6).statsPoints(90).statsRebounds(36).statsAssists(27).build(),
            Player.builder().user(users.get(7)).season(summer2025).jerseyNumber(42).position(Player.Position.C).heightInches(83).weightLbs(230).yearsExperience(5).statsGamesPlayed(6).statsPoints(60).statsRebounds(60).statsAssists(9).build(),
            
            // Crimson Phoenixes
            Player.builder().user(users.get(8)).season(summer2025).jerseyNumber(9).position(Player.Position.SG).heightInches(74).weightLbs(180).yearsExperience(2).statsGamesPlayed(6).statsPoints(102).statsRebounds(24).statsAssists(21).build(),
            Player.builder().user(users.get(9)).season(summer2025).jerseyNumber(4).position(Player.Position.PF).heightInches(79).weightLbs(205).yearsExperience(3).statsGamesPlayed(6).statsPoints(72).statsRebounds(45).statsAssists(12).build(),
            
            // Golden Eagles
            Player.builder().user(users.get(10)).season(summer2025).jerseyNumber(11).position(Player.Position.PG).heightInches(71).weightLbs(170).yearsExperience(1).statsGamesPlayed(6).statsPoints(54).statsRebounds(15).statsAssists(39).build(),
            Player.builder().user(users.get(11)).season(summer2025).jerseyNumber(25).position(Player.Position.C).heightInches(81).weightLbs(225).yearsExperience(4).statsGamesPlayed(6).statsPoints(66).statsRebounds(51).statsAssists(6).build()
        );

        List<Player> players = playerRepository.saveAll(summer2025Players);
        System.out.println("✅ Created " + players.size() + " players with stats for current season");

        System.out.println("🎉 Comprehensive sample data initialization complete!");
        System.out.println("📊 Database now contains:");
        System.out.println("  - " + seasons.size() + " seasons (1 active, 1 completed, 1 upcoming)");
        System.out.println("  - " + allTeams.size() + " teams across all seasons");
        System.out.println("  - " + users.size() + " users");
        System.out.println("  - " + players.size() + " active players with detailed stats");
        System.out.println("  - Realistic win/loss records and point totals");
        System.out.println("  - Ready for comprehensive league management!");
        System.out.println("");
        System.out.println("🌐 Frontend URLs:");
        System.out.println("  - Teams: http://localhost:3002/teams");
        System.out.println("  - League: http://localhost:3002/league"); 
        System.out.println("  - Players: http://localhost:3002/players");
        System.out.println("  - Home: http://localhost:3002/");
    }
    */ 
}