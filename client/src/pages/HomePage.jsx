import { Link } from 'react-router-dom'
import { useSeason } from '../contexts/SeasonContext'
import { useQuery } from '@tanstack/react-query'
import { publicService } from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function HomePage() {
  const { activeSeason, activeSeasonLoading } = useSeason()
  
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ['dashboard', 'public'],
    queryFn: publicService.getDashboard,
    enabled: !!activeSeason,
  })

  if (activeSeasonLoading || dashboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="court-bg h-full w-full opacity-10" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Welcome to</span>
              <span className="block text-primary-600">Cam Moss League</span>
            </h1>
            <p className="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
              {activeSeason ? activeSeason.description : 'Recreational basketball league for all skill levels'}
            </p>
            <div className="mx-auto mt-5 max-w-md sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  to="/league"
                  className="btn-primary w-full sm:w-auto px-8 py-3 text-base md:py-4 md:px-10 md:text-lg"
                >
                  View League Dashboard
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link
                  to="/free-agents"
                  className="btn-outline w-full sm:w-auto px-8 py-3 text-base md:py-4 md:px-10 md:text-lg"
                >
                  Join as Free Agent
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Season Info */}
      {activeSeason && (
        <div className="py-16 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                {activeSeason.name}
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                {activeSeason.description}
              </p>
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">
                  {dashboardData?.totalTeams || '8'}
                </div>
                <div className="text-sm text-gray-600 mt-2">Active Teams</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">
                  {dashboardData?.totalPlayers || '96'}
                </div>
                <div className="text-sm text-gray-600 mt-2">Registered Players</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">
                  {dashboardData?.gamesPlayed || '24'}
                </div>
                <div className="text-sm text-gray-600 mt-2">Games Played</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">
                  {dashboardData?.weeksRemaining || '6'}
                </div>
                <div className="text-sm text-gray-600 mt-2">Weeks Remaining</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Everything You Need
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Complete league management and player experience
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">League Dashboard</h3>
              <p className="mt-2 text-gray-600">
                Real-time scores, standings, and upcoming games all in one place
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Team Management</h3>
              <p className="mt-2 text-gray-600">
                Join teams, manage rosters, and coordinate with teammates
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Playoff Bracket</h3>
              <p className="mt-2 text-gray-600">
                Follow the playoff progression and championship path
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              Ready to Join the Action?
            </h2>
            <p className="mt-4 text-lg text-primary-100">
              {activeSeason?.isRegistrationOpen 
                ? 'Registration is currently open for new players'
                : 'Check out current games and standings'
              }
            </p>
            <div className="mt-8">
              <Link
                to="/teams"
                className="bg-white text-primary-600 hover:bg-gray-50 px-8 py-3 rounded-md text-base font-medium transition-colors duration-200"
              >
                Explore Teams
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}