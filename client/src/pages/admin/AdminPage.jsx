import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import AdminLayout from '../../components/admin/AdminLayout'
import AdminDashboard from '../../components/admin/AdminDashboard'
import AdminUsers from '../../components/admin/AdminUsers'
import AdminTeams from '../../components/admin/AdminTeams'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { ShieldExclamationIcon } from '@heroicons/react/24/outline'

export default function AdminPage() {
  const { appUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!appUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShieldExclamationIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Please sign in to access the admin panel</p>
        </div>
      </div>
    )
  }

  if (appUser.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShieldExclamationIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You need administrator privileges to access this area
          </p>
          <p className="text-sm text-gray-500">
            Current role: <span className="font-medium">{appUser.role}</span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="teams" element={<AdminTeams />} />
        <Route path="players" element={<AdminPlayers />} />
        <Route path="games" element={<AdminGames />} />
        <Route path="seasons" element={<AdminSeasons />} />
        <Route path="updates" element={<AdminUpdates />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  )
}

// Placeholder components for remaining admin sections
function AdminPlayers() {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Player Management</h2>
      <p className="text-gray-600">Coming soon - Manage player registrations and assignments</p>
    </div>
  )
}

function AdminGames() {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Game Management</h2>
      <p className="text-gray-600">Coming soon - Schedule games and manage results</p>
    </div>
  )
}

function AdminSeasons() {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Season Management</h2>
      <p className="text-gray-600">Coming soon - Create and manage league seasons</p>
    </div>
  )
}

function AdminUpdates() {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-bold text-gray-900 mb-2">League Updates</h2>
      <p className="text-gray-600">Coming soon - Post announcements and league news</p>
    </div>
  )
}

function AdminSettings() {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-bold text-gray-900 mb-2">System Settings</h2>
      <p className="text-gray-600">Coming soon - Configure league settings and preferences</p>
    </div>
  )
}