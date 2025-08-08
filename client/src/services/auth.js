import api from './api'

export const authService = {
  // Verify Firebase token and get/create user
  verifyToken: (idToken) => 
    api.post('/auth/login', { idToken }).then(res => res.data),
  
  // Register new user
  register: (userData, idToken) => 
    api.post('/auth/register', { ...userData, idToken }).then(res => res.data),
  
  // Get current user profile
  getProfile: () => 
    api.get('/auth/profile').then(res => res.data),
  
  // Update user profile
  updateProfile: (profileData) => 
    api.put('/auth/profile', profileData).then(res => res.data),
  
  // Refresh token
  refreshToken: () => 
    api.post('/auth/refresh').then(res => res.data),
  
  // Logout
  logout: () => 
    api.post('/auth/logout').then(res => res.data),
}