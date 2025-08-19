package cammossleague.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.Statement;

@Component
@Profile("test-db")
public class DatabaseTestUtility implements CommandLineRunner {

    @Autowired
    private DataSource dataSource;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("\n🔍 DATABASE CONNECTION TEST UTILITY");
        System.out.println("====================================");
        
        testConnection();
        testTables();
        testSampleData();
        
        System.out.println("====================================");
        System.out.println("✅ Database test completed!\n");
    }

    private void testConnection() {
        System.out.println("\n1. Testing Database Connection...");
        try (Connection connection = dataSource.getConnection()) {
            DatabaseMetaData metaData = connection.getMetaData();
            
            System.out.println("   ✅ Connection successful!");
            System.out.println("   📊 Database: " + metaData.getDatabaseProductName() + " " + metaData.getDatabaseProductVersion());
            System.out.println("   🔗 URL: " + metaData.getURL());
            System.out.println("   👤 User: " + metaData.getUserName());
            System.out.println("   🚀 Driver: " + metaData.getDriverName() + " " + metaData.getDriverVersion());
            
        } catch (Exception e) {
            System.err.println("   ❌ Connection failed: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void testTables() {
        System.out.println("\n2. Checking Database Tables...");
        try (Connection connection = dataSource.getConnection()) {
            DatabaseMetaData metaData = connection.getMetaData();
            
            String[] expectedTables = {"USERS", "SEASONS", "TEAMS", "PLAYERS", "GAMES", "GAME_RESULTS", "PLAYER_TEAMS", "LEAGUE_UPDATES"};
            
            for (String tableName : expectedTables) {
                ResultSet tables = metaData.getTables(null, null, tableName, new String[]{"TABLE"});
                if (tables.next()) {
                    System.out.println("   ✅ Table exists: " + tableName);
                } else {
                    System.out.println("   ❌ Table missing: " + tableName);
                }
                tables.close();
            }
            
        } catch (Exception e) {
            System.err.println("   ❌ Table check failed: " + e.getMessage());
        }
    }

    private void testSampleData() {
        System.out.println("\n3. Checking Sample Data...");
        try (Connection connection = dataSource.getConnection();
             Statement statement = connection.createStatement()) {
            
            String[] queries = {
                "SELECT COUNT(*) as count FROM users",
                "SELECT COUNT(*) as count FROM seasons", 
                "SELECT COUNT(*) as count FROM teams",
                "SELECT COUNT(*) as count FROM players"
            };
            
            String[] tableNames = {"Users", "Seasons", "Teams", "Players"};
            
            for (int i = 0; i < queries.length; i++) {
                try {
                    ResultSet rs = statement.executeQuery(queries[i]);
                    if (rs.next()) {
                        int count = rs.getInt("count");
                        System.out.println("   📊 " + tableNames[i] + ": " + count + " records");
                    }
                    rs.close();
                } catch (Exception e) {
                    System.out.println("   ❌ Error querying " + tableNames[i] + ": " + e.getMessage());
                }
            }
            
        } catch (Exception e) {
            System.err.println("   ❌ Data check failed: " + e.getMessage());
        }
    }
}