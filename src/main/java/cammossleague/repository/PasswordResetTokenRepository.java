package cammossleague.repository;

import cammossleague.model.PasswordResetToken;
import cammossleague.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    
    Optional<PasswordResetToken> findByToken(String token);
    
    Optional<PasswordResetToken> findByTokenAndIsUsedFalse(String token);
    
    @Query("SELECT p FROM PasswordResetToken p WHERE p.user = :user AND p.isUsed = false AND p.expiresAt > :now ORDER BY p.createdAt DESC")
    Optional<PasswordResetToken> findValidTokenByUser(@Param("user") User user, @Param("now") LocalDateTime now);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM PasswordResetToken p WHERE p.expiresAt < :now OR p.isUsed = true")
    void deleteExpiredAndUsedTokens(@Param("now") LocalDateTime now);
    
    @Modifying
    @Transactional
    @Query("UPDATE PasswordResetToken p SET p.isUsed = true WHERE p.user = :user AND p.isUsed = false")
    void invalidateAllUserTokens(@Param("user") User user);
}