package cammossleague.dto;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    
    private String username;
    private String firstName;
    private String lastName;
    @Email
    private String email;
    private String phone;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String profileImageUrl;
    private Boolean isFreeAgent;
    private Integer yearsPlayed;
    private String bio;
    private String teamHistory;
}