import axios from 'axios'
import { createCrudService, createAdminCrudService } from './crudServiceFactory.js'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
})

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

// ===== SEASON SERVICES =====
export const seasonService = {
  getAllSeasons: () => api.get('/seasons').then(res => res.data),
  getActiveSeason: () => api.get('/seasons/active').then(res => res.data),
  getMostRecentSeason: () => api.get('/seasons/recent').then(res => res.data),
  getSeasonById: (id) => api.get(`/seasons/${id}`).then(res => res.data),
  getSeasonStandings: (id) => api.get(`/seasons/${id}/standings`).then(res => res.data),
  createSeason: (seasonData) => api.post('/seasons', seasonData).then(res => res.data),
  updateSeason: (id, seasonData) => api.put(`/seasons/${id}`, seasonData).then(res => res.data),
  activateSeason: (id) => api.post(`/seasons/${id}/activate`).then(res => res.data),
}

// ===== TEAM SERVICES =====
export const teamService = {
  ...createCrudService('/teams'),
  getAllTeams: (params = {}) => api.get('/teams', { params }).then(res => res.data),
  getTeamsBySeason: (seasonId) => api.get(`/teams/season/${seasonId}`).then(res => res.data),
  getTeamsByYear: (year) => api.get(`/teams/year/${year}`).then(res => res.data),
  getTeamStandings: (seasonId) => api.get(`/teams/season/${seasonId}/standings`).then(res => res.data),
  getTeamRoster: (id) => api.get(`/teams/${id}/roster`).then(res => res.data),
  getTeamSchedule: (id) => api.get(`/teams/${id}/schedule`).then(res => res.data),
  getTeamStats: (id) => api.get(`/teams/${id}/stats`).then(res => res.data),
  approvePlayer: (teamId, playerId) => api.post(`/teams/${teamId}/approve-player`, { playerId }).then(res => res.data),
}

// ===== PLAYER SERVICES =====
export const playerService = {
  ...createCrudService('/players'),
  getAllPlayers: (params = {}) => api.get('/players', { params }).then(res => res.data),
  getPlayersBySeason: (seasonId) => api.get(`/players/season/${seasonId}`).then(res => res.data),
  getActivePlayersBySeason: (seasonId) => api.get(`/players/season/${seasonId}/active`).then(res => res.data),
  getPlayersByYear: (year) => api.get(`/players/year/${year}`).then(res => res.data),
  getPlayersByTeamAndSeason: (teamId, seasonId) => api.get(`/players/team/${teamId}/season/${seasonId}`).then(res => res.data),
  getPlayerStats: (id) => api.get(`/players/${id}/stats`).then(res => res.data),
  getPlayerTeamHistory: (id) => api.get(`/players/${id}/team-history`).then(res => res.data),
  getFreeAgents: () => api.get('/players/free-agents').then(res => res.data),
  joinTeam: (playerId, teamId) => api.post(`/players/${playerId}/join-team`, { teamId }).then(res => res.data),
}

// ===== GAME SERVICES =====
export const gameService = {
  ...createCrudService('/games'),
  getAllGames: (params = {}) => api.get('/games', { params }).then(res => res.data),
  getGamesByWeek: (week) => api.get(`/games/week/${week}`).then(res => res.data),
  getUpcomingGames: () => api.get('/public/games/upcoming').then(res => res.data),
  getRecentResults: () => api.get('/public/games/results').then(res => res.data),
  submitResult: (gameId, resultData) => api.post(`/games/${gameId}/result`, resultData).then(res => res.data),
  updateResult: (gameId, resultData) => api.put(`/games/${gameId}/result`, resultData).then(res => res.data),
}

// ===== SCHEDULE SERVICES =====
export const scheduleService = {
  getAllGames: () => api.get('/schedule').then(res => res.data),
  getGameById: (id) => api.get(`/schedule/${id}`).then(res => res.data),
  getGamesBySeason: (seasonId) => api.get(`/schedule/season/${seasonId}`).then(res => res.data),
  getGamesByTeam: (teamId) => api.get(`/schedule/team/${teamId}`).then(res => res.data),
  getGamesByTeamAndSeason: (teamId, seasonId) => api.get(`/schedule/team/${teamId}/season/${seasonId}`).then(res => res.data),
  getGamesByWeek: (seasonId, weekNumber) => api.get(`/schedule/week/${seasonId}/${weekNumber}`).then(res => res.data),
  getUpcomingGames: () => api.get('/schedule/upcoming').then(res => res.data),
  getUpcomingGamesBySeason: (seasonId) => api.get(`/schedule/upcoming/season/${seasonId}`).then(res => res.data),
  getCompletedGamesBySeason: (seasonId) => api.get(`/schedule/completed/season/${seasonId}`).then(res => res.data),
  getGamesByType: (seasonId, gameType) => api.get(`/schedule/type/${seasonId}/${gameType}`).then(res => res.data),
  getSeasonStats: (seasonId) => api.get(`/schedule/stats/season/${seasonId}`).then(res => res.data),
}

// ===== LEAGUE STATISTICS SERVICES =====
export const leagueService = {
  getLeagueStats: (params = {}) => api.get('/league/stats', { params }).then(res => res.data),
  getSeasonStats: (seasonId) => api.get(`/league/season/${seasonId}/stats`).then(res => res.data),
  getYearStats: (year) => api.get(`/league/year/${year}/stats`).then(res => res.data),
  getAllSeasonsWithStats: () => api.get('/league/seasons').then(res => res.data),
}

// ===== PUBLIC SERVICES =====
export const publicService = {
  getDashboard: () => api.get('/public/dashboard').then(res => res.data),
  getPlayoffBracket: () => api.get('/public/bracket').then(res => res.data),
  getLeagueUpdates: (params = {}) => api.get('/public/updates', { params }).then(res => res.data.content || []),
  getFreeAgents: () => api.get('/public/free-agents').then(res => res.data),
  getSeasonHistory: (seasonId) => api.get(`/public/seasons/${seasonId}/history`).then(res => res.data),
}

// ===== ADMIN SERVICES =====
export const adminService = {
  // Dashboard & Analytics
  getDashboardStats: () => api.get('/admin/dashboard/stats').then(res => res.data),
  getRecentActivity: () => api.get('/admin/activity/recent').then(res => res.data),
  getAnalytics: () => api.get('/admin/analytics').then(res => res.data),

  // User Management
  getUsers: (params = {}) => api.get('/admin/users', { params }).then(res => res.data),
  createUser: (userData) => api.post('/admin/users', userData).then(res => res.data),
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData).then(res => res.data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`).then(res => res.data),
  updateUserRole: (userId, role) => api.put(`/admin/users/${userId}/role`, { role }).then(res => res.data),

  // Team Management
  ...createAdminCrudService('/teams'),
  teams: createAdminCrudService('/teams'),

  // Player Management
  players: createAdminCrudService('/players'),

  // Game Management
  games: createAdminCrudService('/games'),

  // Season Management  
  seasons: createAdminCrudService('/seasons'),
  activateSeason: (id) => api.post(`/admin/seasons/${id}/activate`).then(res => res.data),

  // League Updates
  getUpdates: (params = {}) => api.get('/admin/updates', { params }).then(res => res.data),
  createLeagueUpdate: (updateData) => api.post('/admin/updates', updateData).then(res => res.data),
  updateLeagueUpdate: (id, updateData) => api.put(`/admin/updates/${id}`, updateData).then(res => res.data),
  deleteLeagueUpdate: (id) => api.delete(`/admin/updates/${id}`).then(res => res.data),

  // System Management
  getPendingRequests: () => api.get('/admin/pending-requests').then(res => res.data),
  getSystemHealth: () => api.get('/admin/system/health').then(res => res.data),
}

export default api