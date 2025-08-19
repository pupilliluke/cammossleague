package cammossleague.service;

import cammossleague.model.PasswordResetToken;
import cammossleague.model.User;
import cammossleague.repository.PasswordResetTokenRepository;
import cammossleague.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class PasswordResetService {
    
    private static final Logger logger = LoggerFactory.getLogger(PasswordResetService.class);
    private static final String TOKEN_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int TOKEN_LENGTH = 64;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Value("${password.reset.token.expiry-hours}")
    private int tokenExpiryHours;
    
    private final SecureRandom secureRandom = new SecureRandom();
    
    @Transactional
    public void initiatePasswordReset(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isEmpty()) {
            // For security, don't reveal if email exists or not
            logger.warn("Password reset requested for non-existent email: {}", email);
            return;
        }
        
        User user = userOptional.get();
        
        // Invalidate any existing tokens for this user
        passwordResetTokenRepository.invalidateAllUserTokens(user);
        
        // Generate new token
        String token = generateSecureToken();
        LocalDateTime expiresAt = LocalDateTime.now().plusHours(tokenExpiryHours);
        
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiresAt(expiresAt)
                .isUsed(false)
                .build();
        
        passwordResetTokenRepository.save(resetToken);
        
        // Send email
        try {
            emailService.sendPasswordResetEmail(email, user.getFirstName(), token);
            logger.info("Password reset email sent for user: {}", email);
        } catch (Exception e) {
            logger.error("Failed to send password reset email for user: {}", email, e);
            // Don't throw exception to avoid revealing email existence
        }
    }
    
    @Transactional
    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> tokenOptional = passwordResetTokenRepository.findByTokenAndIsUsedFalse(token);
        
        if (tokenOptional.isEmpty()) {
            logger.warn("Invalid or used password reset token: {}", token);
            return false;
        }
        
        PasswordResetToken resetToken = tokenOptional.get();
        
        if (resetToken.isExpired()) {
            logger.warn("Expired password reset token: {}", token);
            return false;
        }
        
        User user = resetToken.getUser();
        
        // Update user password
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        // Mark token as used
        resetToken.setIsUsed(true);
        resetToken.setUsedAt(LocalDateTime.now());
        passwordResetTokenRepository.save(resetToken);
        
        logger.info("Password successfully reset for user: {}", user.getEmail());
        return true;
    }
    
    public boolean validateResetToken(String token) {
        Optional<PasswordResetToken> tokenOptional = passwordResetTokenRepository.findByTokenAndIsUsedFalse(token);
        
        if (tokenOptional.isEmpty()) {
            return false;
        }
        
        PasswordResetToken resetToken = tokenOptional.get();
        return resetToken.isValid();
    }
    
    @Transactional
    public void cleanupExpiredTokens() {
        passwordResetTokenRepository.deleteExpiredAndUsedTokens(LocalDateTime.now());
        logger.info("Cleaned up expired and used password reset tokens");
    }
    
    private String generateSecureToken() {
        StringBuilder token = new StringBuilder(TOKEN_LENGTH);
        for (int i = 0; i < TOKEN_LENGTH; i++) {
            token.append(TOKEN_CHARACTERS.charAt(secureRandom.nextInt(TOKEN_CHARACTERS.length())));
        }
        return token.toString();
    }
}