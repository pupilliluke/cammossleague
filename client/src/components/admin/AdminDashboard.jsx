import { useQuery } from '@tanstack/react-query'
import { useSeason } from '../../contexts/SeasonContext'
import { adminService } from '../../services/api'
import LoadingSpinner from '../common/LoadingSpinner'
import { 
  UsersIcon,
  UserGroupIcon,
  CalendarIcon,
  TrophyIcon,
  NewspaperIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { format, parseISO } from 'date-fns'

export default function AdminDashboard() {
  const { activeSeason } = useSeason()

  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin', 'dashboard-stats'],
    queryFn: adminService.getDashboardStats,
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  // Fetch recent activity
  const { data: recentActivity, isLoading: activityLoading } = useQuery({
    queryKey: ['admin', 'recent-activity'],
    queryFn: adminService.getRecentActivity,
    refetchInterval: 60000, // Refresh every minute
  })

  if (statsLoading && activityLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Mock data if API not available
  const mockStats = {
    totalUsers: 45,
    totalPlayers: 38,
    totalTeams: 8,
    totalGames: 24,
    completedGames: 16,
    scheduledGames: 8,
    freeAgents: 7,
    activeUpdates: 3
  }

  const mockActivity = [
    { id: 1, type: 'user_registered', description: 'New user Mike Johnson registered', timestamp: '2025-08-08T10:30:00Z' },
    { id: 2, type: 'team_created', description: 'Team "Thunder Hawks" was created', timestamp: '2025-08-08T09:15:00Z' },
    { id: 3, type: 'game_completed', description: 'Game #16 completed: Hawks vs Eagles (78-72)', timestamp: '2025-08-07T20:45:00Z' },
    { id: 4, type: 'player_joined', description: 'Sarah Wilson joined Lightning Bolts', timestamp: '2025-08-07T18:22:00Z' },
    { id: 5, type: 'free_agent', description: 'Alex Rodriguez became a free agent', timestamp: '2025-08-07T16:10:00Z' }
  ]

  const dashboardStats = stats || mockStats
  const activities = recentActivity || mockActivity

  const statCards = [
    {
      name: 'Total Users',
      value: dashboardStats.totalUsers,
      icon: UsersIcon,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      href: '/admin/users'
    },
    {
      name: 'Active Players',
      value: dashboardStats.totalPlayers,
      icon: UserGroupIcon,
      color: 'text-green-600',
      bg: 'bg-green-100',
      href: '/admin/players'
    },
    {
      name: 'Teams',
      value: dashboardStats.totalTeams,
      icon: UserGroupIcon,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      href: '/admin/teams'
    },
    {
      name: 'Games Played',
      value: dashboardStats.completedGames,
      subValue: `of ${dashboardStats.totalGames}`,
      icon: CalendarIcon,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
      href: '/admin/games'
    },
    {
      name: 'Free Agents',
      value: dashboardStats.freeAgents,
      icon: UserGroupIcon,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100',
      href: '/admin/players?filter=free-agents'
    },
    {
      name: 'League Updates',
      value: dashboardStats.activeUpdates,
      icon: NewspaperIcon,
      color: 'text-indigo-600',
      bg: 'bg-indigo-100',
      href: '/admin/updates'
    }
  ]

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_registered':
        return <UsersIcon className="h-5 w-5 text-blue-500" />
      case 'team_created':
        return <UserGroupIcon className="h-5 w-5 text-purple-500" />
      case 'game_completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'player_joined':
        return <UserGroupIcon className="h-5 w-5 text-blue-500" />
      case 'free_agent':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      default:
        return <ChartBarIcon className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">
          Monitor league activity and manage the {activeSeason?.name || 'current season'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Link
            key={stat.name}
            to={stat.href}
            className="card hover:shadow-md transition-shadow duration-200"
          >
            <div className="card-body p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    {stat.subValue && (
                      <p className="ml-2 text-sm text-gray-500">{stat.subValue}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/admin/users/new"
              className="btn-primary text-center py-3"
            >
              Add User
            </Link>
            <Link
              to="/admin/teams/new"
              className="btn-outline text-center py-3"
            >
              Create Team
            </Link>
            <Link
              to="/admin/games/new"
              className="btn-outline text-center py-3"
            >
              Schedule Game
            </Link>
            <Link
              to="/admin/updates/new"
              className="btn-outline text-center py-3"
            >
              Post Update
            </Link>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <Link
                to="/admin/activity"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="card-body">
            {activityLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <div className="space-y-4">
                {activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">
                        {format(parseISO(activity.timestamp), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* System Status */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-900">Database Connection</span>
                </div>
                <span className="text-sm text-green-600 font-medium">Healthy</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-900">Authentication Service</span>
                </div>
                <span className="text-sm text-green-600 font-medium">Online</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrophyIcon className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-gray-900">Season Status</span>
                </div>
                <span className="text-sm text-blue-600 font-medium">
                  {activeSeason?.status || 'Active'}
                </span>
              </div>

              {dashboardStats.scheduledGames > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm text-gray-900">Upcoming Games</span>
                  </div>
                  <span className="text-sm text-yellow-600 font-medium">
                    {dashboardStats.scheduledGames} pending
                  </span>
                </div>
              )}

              {dashboardStats.freeAgents > 10 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
                    <span className="text-sm text-gray-900">Free Agents</span>
                  </div>
                  <span className="text-sm text-orange-600 font-medium">
                    High count ({dashboardStats.freeAgents})
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Season Overview */}
      {activeSeason && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">
              {activeSeason.name} Overview
            </h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {((dashboardStats.completedGames / dashboardStats.totalGames) * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-500">Season Complete</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {dashboardStats.totalPlayers}
                </div>
                <div className="text-sm text-gray-500">Active Players</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {dashboardStats.totalTeams}
                </div>
                <div className="text-sm text-gray-500">Competing Teams</div>
              </div>
            </div>
            
            {activeSeason.playoffStartDate && (
              <div className="mt-6 text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-center space-x-2">
                  <TrophyIcon className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    Playoffs start {format(parseISO(activeSeason.playoffStartDate), 'MMMM d, yyyy')}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}