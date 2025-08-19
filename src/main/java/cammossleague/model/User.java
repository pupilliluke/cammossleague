package cammossleague.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "firebase_uid", unique = true, length = 128)
    private String firebaseUid;
    
    @Column(name = "google_id", unique = true, length = 128)
    private String googleId;
    
    @Column(unique = true, length = 50)
    private String username;
    
    @JsonIgnore
    @Column(name = "password_hash")
    private String passwordHash;
    
    @Email
    @Column(unique = true, nullable = true)
    private String email;
    
    @NotBlank
    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;
    
    @NotBlank
    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;
    
    @Column(length = 20)
    private String phone;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Role role = Role.PLAYER;
    
    @Column(name = "is_free_agent")
    @Builder.Default
    private Boolean isFreeAgent = false;
    
    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;
    
    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl;
    
    @Column(name = "profile_picture_url", length = 500)
    private String profilePictureUrl;
    
    @Column(name = "email_verified")
    @Builder.Default
    private Boolean emailVerified = false;
    
    @Column(name = "emergency_contact_name")
    private String emergencyContactName;
    
    @Column(name = "emergency_contact_phone", length = 20)
    private String emergencyContactPhone;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private List<Player> players;
    
    @OneToMany(mappedBy = "captain", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private List<Team> captainTeams;
    
    @OneToMany(mappedBy = "coach", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private List<Team> coachTeams;
    
    public enum Role {
        PLAYER, COACH, ADMIN
    }
    
    public String getFullName() {
        return firstName + " " + lastName;
    }
    
    public String getDisplayName() {
        return getFullName();
    }
    
    // Custom constructor for basic user creation with required fields only
    public User(String firstName, String lastName, String email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = Role.PLAYER;
        this.isActive = true;
        this.isFreeAgent = false;
    }
    
    // Constructor for user creation with username/password (registration)
    public User(String username, String passwordHash, String email, String firstName, String lastName) {
        this.username = username;
        this.passwordHash = passwordHash;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = Role.PLAYER;
        this.isActive = true;
        this.isFreeAgent = false;
    }
    
    // Constructor with optional fields for complete user creation
    public User(String username, String passwordHash, String email, String firstName, String lastName, 
                String phone, Role role) {
        this.username = username;
        this.passwordHash = passwordHash;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.role = role != null ? role : Role.PLAYER;
        this.isActive = true;
        this.isFreeAgent = false;
    }
}