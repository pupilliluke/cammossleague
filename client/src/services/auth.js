import api from './api'

export const authService = {
  // Username/Password login
  login: (username, password) => 
    api.post('/auth/login', { username, password }).then(res => res.data),
  
  // Register new user
  register: (userData) => 
    api.post('/auth/register', userData).then(res => res.data),
  
  // Get current user info
  getCurrentUser: () => 
    api.get('/auth/me').then(res => res.data),
  
  // Dashboard data (secure, role-based)
  getDashboard: () => 
    api.get('/secure/dashboard').then(res => res.data),
  
  // Get my team info
  getMyTeam: () => 
    api.get('/secure/my-team').then(res => res.data),
  
  // Get team details (if authorized)
  getTeamDetails: (teamId) => 
    api.get(`/secure/teams/${teamId}`).then(res => res.data),
  
  // Get player details (if authorized)
  getPlayerDetails: (playerId) => 
    api.get(`/secure/players/${playerId}`).then(res => res.data),
  
  // Google OAuth login
  googleLogin: (idToken) => 
    api.post('/auth/google', { idToken }).then(res => res.data),

  // Firebase token verification (for migration users)
  verifyToken: (idToken) => 
    api.post('/auth/firebase-login', { idToken }).then(res => res.data),
  
  // Set auth token in headers
  setAuthToken: (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      localStorage.setItem('token', token)
    } else {
      delete api.defaults.headers.common['Authorization']
      localStorage.removeItem('token')
    }
  },
  
  // Get stored token
  getToken: () => localStorage.getItem('token'),
  
  // Logout
  logout: () => {
    authService.setAuthToken(null)
    return Promise.resolve()
  }
}