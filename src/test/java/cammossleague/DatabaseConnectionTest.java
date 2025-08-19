package cammossleague;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;
import org.springframework.context.annotation.Import;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.Statement;

@SpringBootTest
@Import(TestDataConfiguration.class)
public class DatabaseConnectionTest {

    @Autowired
    private DataSource dataSource;

    @Test
    public void testDatabaseConnection() {
        try (Connection connection = dataSource.getConnection()) {
            System.out.println("✅ Database connection successful!");
            
            DatabaseMetaData metaData = connection.getMetaData();
            System.out.println("Database URL: " + metaData.getURL());
            System.out.println("Database Product: " + metaData.getDatabaseProductName());
            System.out.println("Database Version: " + metaData.getDatabaseProductVersion());
            System.out.println("Driver Name: " + metaData.getDriverName());
            System.out.println("Driver Version: " + metaData.getDriverVersion());
            System.out.println("Username: " + metaData.getUserName());
            
            // Test basic query
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT COUNT(*) as table_count FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'PUBLIC'");
            
            if (resultSet.next()) {
                int tableCount = resultSet.getInt("table_count");
                System.out.println("Number of tables in database: " + tableCount);
            }
            
            // List all tables
            ResultSet tables = metaData.getTables(null, "PUBLIC", null, new String[]{"TABLE"});
            System.out.println("\n📋 Database Tables:");
            while (tables.next()) {
                String tableName = tables.getString("TABLE_NAME");
                System.out.println("  - " + tableName);
            }
            
            System.out.println("\n🎯 Testing sample queries...");
            
            // Test seasons table
            try {
                ResultSet seasons = statement.executeQuery("SELECT COUNT(*) as count FROM seasons");
                if (seasons.next()) {
                    System.out.println("Seasons count: " + seasons.getInt("count"));
                }
            } catch (Exception e) {
                System.out.println("❌ Error querying seasons: " + e.getMessage());
            }
            
            // Test users table
            try {
                ResultSet users = statement.executeQuery("SELECT COUNT(*) as count FROM users");
                if (users.next()) {
                    System.out.println("Users count: " + users.getInt("count"));
                }
            } catch (Exception e) {
                System.out.println("❌ Error querying users: " + e.getMessage());
            }
            
            // Test teams table
            try {
                ResultSet teams = statement.executeQuery("SELECT COUNT(*) as count FROM teams");
                if (teams.next()) {
                    System.out.println("Teams count: " + teams.getInt("count"));
                }
            } catch (Exception e) {
                System.out.println("❌ Error querying teams: " + e.getMessage());
            }
            
        } catch (Exception e) {
            System.err.println("❌ Database connection failed: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Database connection test failed", e);
        }
    }
    
    @Test
    public void testDataSourceProperties() {
        System.out.println("\n🔧 DataSource Properties:");
        System.out.println("DataSource class: " + dataSource.getClass().getName());
        
        try (Connection connection = dataSource.getConnection()) {
            System.out.println("Auto-commit: " + connection.getAutoCommit());
            System.out.println("Read-only: " + connection.isReadOnly());
            System.out.println("Transaction isolation: " + connection.getTransactionIsolation());
            System.out.println("Connection valid: " + connection.isValid(5));
        } catch (Exception e) {
            System.err.println("❌ Error testing DataSource properties: " + e.getMessage());
        }
    }
}