package cammossleague.config;

import cammossleague.security.CustomUserDetailsService;
import cammossleague.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Autowired
    private CustomUserDetailsService userDetailsService;
    
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authManagerBuilder = 
                http.getSharedObject(AuthenticationManagerBuilder.class);
        authManagerBuilder.userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder());
        return authManagerBuilder.build();
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .headers(headers -> headers
                .frameOptions().sameOrigin()
                .addHeaderWriter((request, response) -> {
                    response.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
                    response.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
                })
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Static resources and common endpoints
                .requestMatchers("/", "/favicon.ico", "/robots.txt").permitAll()
                .requestMatchers("/static/**", "/css/**", "/js/**", "/images/**", "/public/**").permitAll()
                .requestMatchers("/webjars/**").permitAll()
                // API endpoints
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/login/oauth2/code/**").permitAll() // Google OAuth callback
                .requestMatchers("/api/forms/submit/**").permitAll() // Allow public form submissions
                .requestMatchers("/health").permitAll()
                .requestMatchers("/error").permitAll()
                .requestMatchers("/h2-console/**").permitAll() // Allow H2 console access
                // Core data endpoints - publicly accessible for league website
                .requestMatchers("/api/seasons/**").permitAll()
                .requestMatchers("/api/teams/**").permitAll() 
                .requestMatchers("/api/games/**").permitAll()
                .requestMatchers("/api/schedule/**").permitAll()
                .requestMatchers("/api/league/**").permitAll()
                // Player data requires authentication
                .requestMatchers("/api/players/**").authenticated()
                // Public read-only endpoints
                .requestMatchers("/api/seasons/public/**").permitAll()
                .requestMatchers("/api/teams/public/**").permitAll()
                .requestMatchers("/api/games/public/**").permitAll()
                .requestMatchers("/api/playoffs/public/**").permitAll()
                // Admin-only endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/forms/admin/**").hasRole("ADMIN")
                // Authenticated user endpoints
                .requestMatchers("/api/users/profile").authenticated()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:5173", "http://localhost:3001", "http://localhost:3002", "http://127.0.0.1:5500", "http://localhost:8080", "http://localhost:8081"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}