package cammossleague.controller;

import cammossleague.dto.AuthResponse;
import cammossleague.dto.LoginRequest;
import cammossleague.dto.RegisterRequest;
import cammossleague.dto.PasswordResetRequestDTO;
import cammossleague.dto.PasswordResetConfirmDTO;
import cammossleague.model.Player;
import cammossleague.model.User;
import cammossleague.repository.PlayerRepository;
import cammossleague.repository.UserRepository;
import cammossleague.security.JwtUtil;
import cammossleague.service.GoogleOAuthService;
import cammossleague.service.PasswordResetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PlayerRepository playerRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private GoogleOAuthService googleOAuthService;
    
    @Autowired
    private PasswordResetService passwordResetService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );
            
            User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            String token = jwtUtil.generateToken(
                user.getUsername(), 
                user.getId(), 
                user.getRole().name()
            );
            
            // Get user's team info if they're a player
            Long teamId = null;
            String teamName = null;
            Optional<Player> currentPlayer = playerRepository.findByUserAndCurrentSeason(user.getId());
            if (currentPlayer.isPresent()) {
                Player player = currentPlayer.get();
                // Get active team from PlayerTeam relationships
                player.getPlayerTeams().stream()
                    .filter(pt -> "ACTIVE".equals(pt.getStatus().name()))
                    .findFirst()
                    .ifPresent(pt -> {
                        // This would require accessing team info - we'll handle this later
                    });
            }
            
            AuthResponse authResponse = AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .teamId(teamId)
                .teamName(teamName)
                .build();
            
            return ResponseEntity.ok(authResponse);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid username or password");
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            // Check if username already exists
            if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().body("Username already exists");
            }
            
            // Check if email already exists (only if provided)
            if (registerRequest.getEmail() != null && !registerRequest.getEmail().trim().isEmpty() && 
                userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Email already exists");
            }
            
            // Create new user using custom constructor
            User user = new User(
                registerRequest.getUsername(),
                passwordEncoder.encode(registerRequest.getPassword()),
                registerRequest.getEmail(),
                registerRequest.getFirstName(),
                registerRequest.getLastName(),
                registerRequest.getPhone(),
                registerRequest.getRole()
            );
            
            user = userRepository.save(user);
            
            String token = jwtUtil.generateToken(
                user.getUsername(), 
                user.getId(), 
                user.getRole().name()
            );
            
            AuthResponse authResponse = AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .build();
            
            return ResponseEntity.ok(authResponse);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.badRequest().body("Not authenticated");
        }
        
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        AuthResponse response = AuthResponse.builder()
            .userId(user.getId())
            .username(user.getUsername())
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .role(user.getRole())
            .build();
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/google")
    public ResponseEntity<?> googleAuth(@RequestBody Map<String, String> request) {
        try {
            String idToken = request.get("idToken");
            if (idToken == null || idToken.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("ID token is required");
            }
            
            Map<String, Object> authResult = googleOAuthService.authenticateWithGoogle(idToken);
            return ResponseEntity.ok(authResult);
            
        } catch (GeneralSecurityException | IOException e) {
            return ResponseEntity.badRequest().body("Google authentication failed: " + e.getMessage());
        } catch (SecurityException e) {
            return ResponseEntity.badRequest().body("Invalid Google token: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Authentication error: " + e.getMessage());
        }
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody PasswordResetRequestDTO request) {
        try {
            passwordResetService.initiatePasswordReset(request.getEmail());
            // Always return success for security (don't reveal if email exists)
            return ResponseEntity.ok().body(Map.of(
                "message", "If an account with that email exists, a password reset link has been sent."
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Password reset request failed: " + e.getMessage());
        }
    }
    
    @GetMapping("/reset-password/validate")
    public ResponseEntity<?> validateResetToken(@RequestParam String token) {
        try {
            boolean isValid = passwordResetService.validateResetToken(token);
            if (isValid) {
                return ResponseEntity.ok().body(Map.of(
                    "valid", true,
                    "message", "Reset token is valid"
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                    "valid", false,
                    "message", "Reset token is invalid or has expired"
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Token validation failed: " + e.getMessage());
        }
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody PasswordResetConfirmDTO request) {
        try {
            if (!request.passwordsMatch()) {
                return ResponseEntity.badRequest().body("Passwords do not match");
            }
            
            boolean success = passwordResetService.resetPassword(request.getToken(), request.getNewPassword());
            if (success) {
                return ResponseEntity.ok().body(Map.of(
                    "message", "Password has been reset successfully"
                ));
            } else {
                return ResponseEntity.badRequest().body("Invalid or expired reset token");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Password reset failed: " + e.getMessage());
        }
    }
}