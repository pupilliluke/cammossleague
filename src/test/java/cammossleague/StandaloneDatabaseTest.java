package cammossleague;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.DatabaseMetaData;

/**
 * Standalone database connection test that doesn't require Spring Boot to be running.
 * This can be run independently to verify database connectivity.
 */
public class StandaloneDatabaseTest {
    
    public static void main(String[] args) {
        System.out.println("🔍 STANDALONE DATABASE CONNECTION TEST");
        System.out.println("=====================================");
        
        testH2Database();
        testPostgreSQLDatabase();
        
        System.out.println("=====================================");
        System.out.println("✅ Standalone database tests completed!");
    }
    
    private static void testH2Database() {
        System.out.println("\n1. Testing H2 Database (Local Development)...");
        
        String url = "jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE";
        String username = "sa";
        String password = "password";
        
        try {
            // Load H2 driver
            Class.forName("org.h2.Driver");
            
            try (Connection connection = DriverManager.getConnection(url, username, password)) {
                System.out.println("   ✅ H2 Connection successful!");
                
                DatabaseMetaData metaData = connection.getMetaData();
                System.out.println("   📊 Database: " + metaData.getDatabaseProductName() + " " + metaData.getDatabaseProductVersion());
                System.out.println("   🔗 URL: " + metaData.getURL());
                
                // Test basic operations
                Statement statement = connection.createStatement();
                
                // Create a test table
                statement.execute("DROP TABLE IF EXISTS connection_test");
                statement.execute("CREATE TABLE connection_test (id INT PRIMARY KEY, message VARCHAR(100))");
                statement.execute("INSERT INTO connection_test VALUES (1, 'H2 Connection Test Successful')");
                
                ResultSet rs = statement.executeQuery("SELECT * FROM connection_test");
                if (rs.next()) {
                    System.out.println("   💬 Test message: " + rs.getString("message"));
                }
                
                statement.execute("DROP TABLE connection_test");
                System.out.println("   🧹 Cleanup completed");
                
            }
        } catch (Exception e) {
            System.err.println("   ❌ H2 Connection failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private static void testPostgreSQLDatabase() {
        System.out.println("\n2. Testing PostgreSQL Database (Production)...");
        
        // Use environment variables or defaults
        String url = System.getenv("DATABASE_URL");
        String username = System.getenv("DATABASE_USERNAME");
        String password = System.getenv("DATABASE_PASSWORD");
        
        // Fallback to default values if env vars not set
        if (url == null) url = "jdbc:postgresql://localhost:5432/cammossleague";
        if (username == null) username = "postgres";
        if (password == null) password = "password";
        
        System.out.println("   🔗 Attempting connection to: " + url);
        System.out.println("   👤 Username: " + username);
        
        try {
            // Load PostgreSQL driver
            Class.forName("org.postgresql.Driver");
            
            try (Connection connection = DriverManager.getConnection(url, username, password)) {
                System.out.println("   ✅ PostgreSQL Connection successful!");
                
                DatabaseMetaData metaData = connection.getMetaData();
                System.out.println("   📊 Database: " + metaData.getDatabaseProductName() + " " + metaData.getDatabaseProductVersion());
                System.out.println("   🔗 URL: " + metaData.getURL());
                System.out.println("   👤 User: " + metaData.getUserName());
                
                // Test basic operations
                Statement statement = connection.createStatement();
                
                // Check if we can query system tables
                ResultSet rs = statement.executeQuery("SELECT version()");
                if (rs.next()) {
                    System.out.println("   🐘 PostgreSQL Version: " + rs.getString(1));
                }
                
                // Check for existing tables
                rs = statement.executeQuery("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'");
                if (rs.next()) {
                    System.out.println("   📋 Tables in public schema: " + rs.getInt(1));
                }
                
            }
        } catch (Exception e) {
            System.err.println("   ❌ PostgreSQL Connection failed: " + e.getMessage());
            if (e.getMessage().contains("Connection refused")) {
                System.err.println("   💡 Hint: Make sure PostgreSQL is running on localhost:5432");
                System.err.println("   💡 Or set DATABASE_URL environment variable to correct PostgreSQL instance");
            } else if (e.getMessage().contains("database") && e.getMessage().contains("does not exist")) {
                System.err.println("   💡 Hint: Create the 'cammossleague' database in PostgreSQL");
                System.err.println("   💡 Run: CREATE DATABASE cammossleague;");
            } else if (e.getMessage().contains("authentication failed")) {
                System.err.println("   💡 Hint: Check PostgreSQL username/password");
                System.err.println("   💡 Set DATABASE_USERNAME and DATABASE_PASSWORD environment variables");
            }
        }
    }
}