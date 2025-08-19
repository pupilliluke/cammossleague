# Google OAuth Setup Guide

This guide explains how to set up pure Google OAuth authentication (without Firebase) for the Cam Moss League application.

## Prerequisites

1. Google Cloud Console account
2. Your application must be running on `http://localhost:8080` (backend) and `http://localhost:5173` (frontend) for development

## Backend Setup

### 1. Google Cloud Console Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Select "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:5173` (for development)
     - Your production frontend URL
   - Add authorized redirect URIs:
     - `http://localhost:8080/login/oauth2/code/google` (for development)
     - Your production backend URL + `/login/oauth2/code/google`
   - Save and copy the Client ID and Client Secret

### 2. Backend Environment Variables

Set the following environment variables or add them to your application.properties:

```properties
# Google OAuth2 Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8080/login/oauth2/code/google

# JWT Configuration
JWT_SECRET=your-256-bit-secret-key-for-jwt-tokens
JWT_EXPIRATION=86400000
```

## Frontend Setup

### 1. Environment Variables

Copy `client/.env.example` to `client/.env` and update:

```env
# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# API Configuration
VITE_API_URL=http://localhost:8080/api
```

## Testing the Setup

### 1. Start the Backend

```bash
# From project root
./mvnw spring-boot:run
```

### 2. Start the Frontend

```bash
# From client directory
cd client
npm run dev
```

### 3. Test Google Authentication

1. Open your browser to `http://localhost:5173`
2. Click "Sign In" to open the login modal
3. Click "Continue with Google"
4. Complete the Google OAuth flow
5. You should be redirected back and logged in

## How It Works

### Authentication Flow

1. **Frontend**: User clicks "Continue with Google" button
2. **Google**: Google Identity Services popup opens
3. **User**: User authenticates with Google
4. **Google**: Returns an ID token to the frontend
5. **Frontend**: Sends the ID token to `/api/auth/google`
6. **Backend**: Verifies the ID token with Google
7. **Backend**: Creates or finds user in database
8. **Backend**: Returns JWT token
9. **Frontend**: Stores JWT token and user data

### User Account Creation

- If a user signs in with Google for the first time, a new account is automatically created
- The user's Google profile information (name, email, profile picture) is saved
- Google emails are automatically marked as verified
- If a user already exists with the same email, their account is linked to Google

## Production Deployment

### Additional Configuration for Production

1. **Update Google OAuth settings**:
   - Add your production frontend URL to authorized JavaScript origins
   - Add your production backend URL + `/login/oauth2/code/google` to authorized redirect URIs

2. **Environment Variables**:
   - Set all required environment variables in your production environment
   - Use secure, randomly generated JWT secrets
   - Use HTTPS URLs for production

3. **Security Considerations**:
   - Always use HTTPS in production
   - Keep your Google Client Secret secure
   - Regularly rotate JWT secrets
   - Monitor authentication logs

## Implementation Details

The updated implementation uses a modal-based approach to avoid the FedCM (Federated Credential Management) warnings and issues:

- **GoogleSignInButton Component**: Creates a custom button that triggers Google's standard sign-in modal
- **No One Tap Prompts**: Avoids the automatic popup that can be blocked or cause UX issues
- **Proper Modal Flow**: Uses Google's standard authentication modal for better user experience
- **Mobile Optimized**: Includes mobile-specific optimizations for touch devices
- **Fallback Handling**: Includes fallback mechanisms if the primary flow fails

### Mobile Compatibility

The implementation is fully compatible with mobile devices:

- **iOS Safari**: Works with native Google authentication flow
- **Android Chrome**: Seamless integration with Google accounts
- **Mobile Web**: Optimized button sizing and touch interactions
- **Responsive Design**: Adapts button size and spacing for mobile screens
- **Touch Optimization**: Includes `touch-manipulation` CSS for better touch response

### Mobile-Specific Features

- Automatic mobile device detection
- Adjusted button sizing for mobile screens (larger touch targets)
- Optimized timing for mobile click events
- Enhanced error handling for mobile browsers

## Troubleshooting

### Common Issues

1. **"Invalid client" error**:
   - Check that your Google Client ID is correct
   - Verify the authorized JavaScript origins include your frontend URL

2. **CORS errors**:
   - Ensure your frontend URL is added to CORS configuration in Spring Boot
   - Check that authorized origins are correctly configured in Google Cloud Console

3. **Token verification fails**:
   - Verify your Google Client Secret is correct
   - Check that the Google+ API is enabled

4. **User creation fails**:
   - Check database connection and user table schema
   - Verify that required user fields are properly configured

5. **FedCM warnings in console**:
   - These are expected and can be ignored
   - The implementation uses the standard modal flow instead of One Tap

6. **"User declined or dismissed prompt" errors**:
   - Normal behavior when users close the Google modal
   - No action needed, just user choice

### Debug Steps

1. Check browser console for JavaScript errors
2. Check Spring Boot logs for authentication errors
3. Verify all environment variables are set correctly
4. Test with different Google accounts
5. Clear browser cache and cookies
6. Ensure popup blockers are not interfering

## Database Schema Updates

The following fields have been added to the `users` table to support Google OAuth:

```sql
ALTER TABLE users ADD COLUMN google_id VARCHAR(128) UNIQUE;
ALTER TABLE users ADD COLUMN profile_picture_url VARCHAR(500);
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
```

These migrations should be handled automatically by Spring Boot's JPA update mechanism.