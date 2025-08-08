package cammossleague.config;

import cammossleague.model.*;
import cammossleague.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private SeasonRepository seasonRepository;
    @Autowired
    private TeamRepository teamRepository;
    @Autowired
    private PlayerRepository playerRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // Initialize with sample data if database is empty
        if (seasonRepository.count() == 0) {
            initializeSampleData();
        }
    }

    private void initializeSampleData() {
        System.out.println("🚀 Initializing database with comprehensive sample data...");

        // ===== CREATE MULTIPLE SEASONS =====
        
        // Previous Season (Winter 2024 - Completed)
        Season winter2024 = Season.builder()
                .name("Winter 2024 Championship")
                .year(2024)
                .seasonType(Season.SeasonType.WINTER)
                .startDate(LocalDate.of(2024, 12, 1))
                .endDate(LocalDate.of(2025, 2, 28))
                .registrationOpenDate(LocalDate.of(2024, 11, 1))
                .registrationCloseDate(LocalDate.of(2024, 11, 25))
                .playoffStartDate(LocalDate.of(2025, 2, 15))
                .isActive(false)
                .isRegistrationOpen(false)
                .description("A competitive winter season that crowned our 2024 champions.")
                .build();
        
        // Current Season (Summer 2025 - Active)
        Season summer2025 = Season.builder()
                .name("Summer 2025 League")
                .year(2025)
                .seasonType(Season.SeasonType.SUMMER)
                .startDate(LocalDate.of(2025, 6, 1))
                .endDate(LocalDate.of(2025, 8, 31))
                .registrationOpenDate(LocalDate.of(2025, 5, 1))
                .registrationCloseDate(LocalDate.of(2025, 5, 25))
                .playoffStartDate(LocalDate.of(2025, 8, 15))
                .isActive(true)
                .isRegistrationOpen(true)
                .description("The premier summer basketball league featuring competitive play and community spirit.")
                .build();
        
        // Future Season (Fall 2025 - Upcoming)
        Season fall2025 = Season.builder()
                .name("Fall 2025 Tournament")
                .year(2025)
                .seasonType(Season.SeasonType.FALL)
                .startDate(LocalDate.of(2025, 9, 15))
                .endDate(LocalDate.of(2025, 11, 30))
                .registrationOpenDate(LocalDate.of(2025, 8, 15))
                .registrationCloseDate(LocalDate.of(2025, 9, 1))
                .playoffStartDate(LocalDate.of(2025, 11, 15))
                .isActive(false)
                .isRegistrationOpen(false)
                .description("An exciting fall tournament with expanded playoff format.")
                .build();

        List<Season> seasons = Arrays.asList(winter2024, summer2025, fall2025);
        seasons = seasonRepository.saveAll(seasons);
        System.out.println("✅ Created " + seasons.size() + " seasons");

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
}