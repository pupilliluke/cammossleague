package cammossleague;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.boot.CommandLineRunner;

@TestConfiguration
public class TestDataConfiguration {

    @Bean
    @Primary
    public CommandLineRunner testDataInitializer() {
        // Return a no-op CommandLineRunner for tests to avoid data initialization issues
        return args -> {
            // Do nothing - tests should set up their own data
        };
    }
}