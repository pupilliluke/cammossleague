import { Routes, Route } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'

// Layout Components
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import LoadingSpinner from './components/common/LoadingSpinner'

// Public Pages
import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import LeaguePage from './pages/LeaguePage'
import TeamsPage from './pages/TeamsPage'
import TeamDetailPage from './pages/TeamDetailPage'
import TeamSchedulePage from './pages/TeamSchedulePage'
import PlayersPage from './pages/PlayersPage'
import PlayerDetailPage from './pages/PlayerDetailPage'
import PlayerSchedulePage from './pages/PlayerSchedulePage'
import SchedulePage from './pages/SchedulePage'
import BracketPage from './pages/BracketPage'
import HistoryPage from './pages/HistoryPage'
import FreeAgentsPage from './pages/FreeAgentsPage'

// Protected Pages
import ProfilePage from './pages/ProfilePage'
import TeamDashboardPage from './pages/TeamDashboardPage'
import AdminPage from './pages/admin/AdminPage'

// Auth Components
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/league" element={<LeaguePage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/teams/:id" element={<TeamDetailPage />} />
          <Route path="/teams/:id/schedule" element={<TeamSchedulePage />} />
          <Route path="/players" element={<PlayersPage />} />
          <Route path="/players/:id" element={<PlayerDetailPage />} />
          <Route path="/players/:id/schedule" element={<PlayerSchedulePage />} />
          <Route path="/bracket" element={<BracketPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/free-agents" element={<FreeAgentsPage />} />
          
          {/* Protected Routes - Authenticated Users */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          
          <Route path="/team/dashboard" element={
            <ProtectedRoute>
              <TeamDashboardPage />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminPage />
            </ProtectedRoute>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-8">Page not found</p>
                <a href="/" className="btn-primary">
                  Go Home
                </a>
              </div>
            </div>
          } />
        </Routes>
      </main>
      
      <Footer />
    </div>
  )
}

export default App