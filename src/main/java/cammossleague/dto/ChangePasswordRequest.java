package cammossleague.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangePasswordRequest {
    
    @NotBlank
    private String currentPassword;
    
    @NotBlank
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String newPassword;
    
    @NotBlank
    private String confirmPassword;
    
    public boolean passwordsMatch() {
        return newPassword != null && newPassword.equals(confirmPassword);
    }
}