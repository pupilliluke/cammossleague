package cammossleague.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import cammossleague.model.User;
import cammossleague.repository.UserRepository;
import cammossleague.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class GoogleOAuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    private final GoogleIdTokenVerifier verifier;

    public GoogleOAuthService(@Value("${spring.security.oauth2.client.registration.google.client-id}") String clientId) {
        this.verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(clientId))
                .build();
    }

    public Map<String, Object> authenticateWithGoogle(String idTokenString) throws GeneralSecurityException, IOException {
        GoogleIdToken idToken = verifier.verify(idTokenString);
        
        if (idToken != null) {
            GoogleIdToken.Payload payload = idToken.getPayload();
            
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String pictureUrl = (String) payload.get("picture");
            String googleId = payload.getSubject();
            
            User user = findOrCreateUser(email, name, pictureUrl, googleId);
            
            String jwtToken = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole().name());
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", jwtToken);
            response.put("user", user);
            response.put("message", "Google authentication successful");
            
            return response;
        } else {
            throw new SecurityException("Invalid Google ID token");
        }
    }

    private User findOrCreateUser(String email, String name, String pictureUrl, String googleId) {
        Optional<User> existingUser = userRepository.findByEmail(email);
        
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            if (user.getGoogleId() == null) {
                user.setGoogleId(googleId);
                user.setProfilePictureUrl(pictureUrl);
                userRepository.save(user);
            }
            return user;
        } else {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setFirstName(extractFirstName(name));
            newUser.setLastName(extractLastName(name));
            newUser.setGoogleId(googleId);
            newUser.setProfilePictureUrl(pictureUrl);
            newUser.setIsActive(true);
            newUser.setEmailVerified(true); // Google emails are pre-verified
            newUser.setRole(User.Role.PLAYER); // Set default role for Google users
            
            return userRepository.save(newUser);
        }
    }

    private String extractFirstName(String fullName) {
        if (fullName == null || fullName.trim().isEmpty()) {
            return "";
        }
        String[] parts = fullName.trim().split("\\s+");
        return parts[0];
    }

    private String extractLastName(String fullName) {
        if (fullName == null || fullName.trim().isEmpty()) {
            return "";
        }
        String[] parts = fullName.trim().split("\\s+");
        if (parts.length > 1) {
            return String.join(" ", java.util.Arrays.copyOfRange(parts, 1, parts.length));
        }
        return "";
    }
}