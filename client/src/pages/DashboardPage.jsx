import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/auth'
import LoadingSpinner from '../components/common/LoadingSpinner'
import StatCard from '../components/common/StatCard'
import Header from '../components/common/Header'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) return

    const fetchDashboard = async () => {
      try {
        const data = await authService.getDashboard()
        setDashboardData(data)
      } catch (err) {
        console.error('Dashboard error:', err)
        setError(err.message)
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Please log in to view your dashboard</h1>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Error loading dashboard</h1>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  const isAdmin = user?.role === 'ADMIN'

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            {isAdmin ? 'Admin Dashboard' : `${user?.role?.toLowerCase()} Dashboard`}
          </p>
        </div>

        {/* Admin Dashboard */}
        {isAdmin && dashboardData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Teams"
                value={dashboardData.totalTeams}
                icon="👥"
                color="blue"
              />
              <StatCard
                title="Total Players"
                value={dashboardData.totalPlayers}
                icon="🏀"
                color="green"
              />
              <StatCard
                title="Current Season"
                value={dashboardData.currentSeason?.name || 'None'}
                icon="🏆"
                color="purple"
              />
              <StatCard
                title="Active Games"
                value="Coming Soon"
                icon="⚡"
                color="orange"
              />
            </div>

            {/* Current Season Teams */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Team Standings</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wins</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Losses</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points For</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points Against</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.teams?.map((team, index) => (
                      <tr key={team.id} className={index === 0 ? 'bg-yellow-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div 
                                className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                style={{ backgroundColor: team.primaryColor }}
                              >
                                {team.name.charAt(0)}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{team.displayName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team.wins}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team.losses}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team.pointsFor}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team.pointsAgainst}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* User Dashboard */}
        {!isAdmin && dashboardData && (
          <>
            {/* My Team Section */}
            {dashboardData.myTeam ? (
              <div className="bg-white rounded-lg shadow mb-8">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">My Team</h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div 
                      className="h-16 w-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4"
                      style={{ backgroundColor: dashboardData.myTeam.primaryColor }}
                    >
                      {dashboardData.myTeam.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{dashboardData.myTeam.displayName}</h3>
                      <p className="text-gray-600">{dashboardData.myTeam.wins}W - {dashboardData.myTeam.losses}L</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{dashboardData.myTeam.wins}</div>
                      <div className="text-sm text-gray-500">Wins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{dashboardData.myTeam.losses}</div>
                      <div className="text-sm text-gray-500">Losses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{dashboardData.myTeam.pointsFor}</div>
                      <div className="text-sm text-gray-500">Points For</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{dashboardData.myTeam.pointsAgainst}</div>
                      <div className="text-sm text-gray-500">Points Against</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow mb-8">
                <div className="p-6 text-center">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">No Team Assigned</h2>
                  <p className="text-gray-600">You are not currently assigned to a team for this season.</p>
                </div>
              </div>
            )}

            {/* My Stats Section */}
            {dashboardData.myPlayer && (
              <div className="bg-white rounded-lg shadow mb-8">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">My Stats</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{dashboardData.myPlayer.statsGamesPlayed}</div>
                      <div className="text-sm text-gray-500">Games</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{dashboardData.myPlayer.statsPoints}</div>
                      <div className="text-sm text-gray-500">Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{dashboardData.myPlayer.statsRebounds}</div>
                      <div className="text-sm text-gray-500">Rebounds</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{dashboardData.myPlayer.statsAssists}</div>
                      <div className="text-sm text-gray-500">Assists</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* League Standings */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">League Standings</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Record</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pts For</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pts Against</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.standings?.map((team, index) => (
                      <tr key={team.id} className={dashboardData.myTeam?.id === team.id ? 'bg-blue-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div 
                              className="h-6 w-6 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3"
                              style={{ backgroundColor: team.primaryColor }}
                            >
                              {team.name.charAt(0)}
                            </div>
                            <span className="text-sm text-gray-900">{team.displayName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team.wins}-{team.losses}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team.pointsFor}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team.pointsAgainst}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}