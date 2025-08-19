package cammossleague.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PasswordResetConfirmDTO {
    
    @NotBlank(message = "Reset token is required")
    private String token;
    
    @NotBlank(message = "New password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String newPassword;
    
    @NotBlank(message = "Password confirmation is required")
    private String confirmPassword;
    
    public boolean passwordsMatch() {
        return newPassword != null && newPassword.equals(confirmPassword);
    }
}