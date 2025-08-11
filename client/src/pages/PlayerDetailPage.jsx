import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { playerService, teamService } from '../services/api'
import { useSeason } from '../contexts/SeasonContext'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Breadcrumb from '../components/common/Breadcrumb'
import {
  UserIcon,
  ChartBarIcon,
  TrophyIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowLeftIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

export default function PlayerDetailPage() {
  const { id } = useParams()
  const { selectedSeason } = useSeason()

  // Fetch player details
  const { data: player, isLoading: playerLoading, error } = useQuery({
    queryKey: ['player', id],
    queryFn: () => playerService.getById(id),
    enabled: !!id,
  })

  // Fetch player team history across all seasons
  const { data: teamHistory, isLoading: teamHistoryLoading } = useQuery({
    queryKey: ['player-team-history', id],
    queryFn: () => playerService.getPlayerTeamHistory(id),
    enabled: !!id,
  })

  // Get current team from player's playerTeams relationship
  const currentTeam = player?.playerTeams?.find(pt => pt.status === 'ACTIVE')?.team

  if (playerLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !player) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <UserIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Player Not Found</h1>
          <p className="text-gray-600 mb-8">The player you're looking for doesn't exist.</p>
          <Link to="/players" className="btn-primary">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Players
          </Link>
        </div>
      </div>
    )
  }

  const stats = {
    pointsPerGame: player.pointsPerGame || 0,
    reboundsPerGame: player.reboundsPerGame || 0,
    assistsPerGame: player.assistsPerGame || 0,
    gamesPlayed: player.statsGamesPlayed || 0,
    totalPoints: player.statsPoints || 0,
    totalRebounds: player.statsRebounds || 0,
    totalAssists: player.statsAssists || 0
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <Breadcrumb 
              items={[
                { name: 'Players', href: '/players' },
                { name: player.displayName, href: `/players/${player.id}` }
              ]}
            />
          </div>

          {/* Player Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mr-6">
                <UserIcon className="h-10 w-10 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {player.displayName}
                </h1>
                <div className="flex items-center space-x-4 text-gray-600">
                  <span className="flex items-center">
                    #{player.jerseyNumber || 'N/A'} • {player.position?.displayName || player.position}
                  </span>
                  {player.heightDisplay && (
                    <span>{player.heightDisplay} • {player.weightLbs} lbs</span>
                  )}
                </div>
                {currentTeam && (
                  <div className="mt-2">
                    <Link 
                      to={`/teams/${currentTeam.id}`}
                      className="inline-flex items-center text-primary-600 hover:text-primary-800 transition-colors"
                    >
                      <TrophyIcon className="h-4 w-4 mr-1" />
                      {currentTeam.displayName}
                    </Link>
                  </div>
                )}
              </div>
            </div>
            
            {/* Season Badge */}
            <div className="flex items-center bg-primary-100 text-primary-800 px-3 py-2 rounded-lg">
              <CalendarIcon className="h-4 w-4 mr-2" />
              <span className="font-medium">{selectedSeason?.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Player Stats */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <ChartBarIcon className="h-5 w-5 mr-2 text-primary-600" />
                Season Statistics
              </h2>
              
              {/* Primary Stats Grid */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-primary-600 mb-1">
                    {stats.pointsPerGame.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">Points Per Game</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {stats.totalPoints} total
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {stats.reboundsPerGame.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">Rebounds Per Game</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {stats.totalRebounds} total
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {stats.assistsPerGame.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">Assists Per Game</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {stats.totalAssists} total
                  </div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-xl font-semibold text-gray-900">
                      {stats.gamesPlayed}
                    </div>
                    <div className="text-sm text-gray-600">Games Played</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-xl font-semibold text-gray-900">
                      {player.yearsExperience || 0}
                    </div>
                    <div className="text-sm text-gray-600">Years Experience</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-xl font-semibold text-gray-900">
                      {player.heightDisplay || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Height</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-xl font-semibold text-gray-900">
                      {player.weightLbs || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Weight (lbs)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Chart Placeholder */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <ChartBarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Performance charts coming soon</p>
                </div>
              </div>
            </div>
          </div>

          {/* Player Info Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                {player.user?.email && (
                  <div className="flex items-center text-gray-600">
                    <EnvelopeIcon className="h-4 w-4 mr-3 text-gray-400" />
                    <span className="text-sm">{player.user.email}</span>
                  </div>
                )}
                {player.user?.phone && (
                  <div className="flex items-center text-gray-600">
                    <PhoneIcon className="h-4 w-4 mr-3 text-gray-400" />
                    <span className="text-sm">{player.user.phone}</span>
                  </div>
                )}
                {!player.user?.email && !player.user?.phone && (
                  <p className="text-sm text-gray-500">No contact information available</p>
                )}
              </div>
            </div>

            {/* Player Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Player Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    player.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {player.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Role</span>
                  <span className="text-sm font-medium text-gray-900">
                    {player.user?.role || 'Player'}
                  </span>
                </div>
                {player.user?.isFreeAgent && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Free Agent</span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Available
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Team History */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Team History</h3>
              {teamHistoryLoading ? (
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : teamHistory?.teamHistory?.length > 0 ? (
                <div className="space-y-3">
                  <div className="text-sm text-gray-600 mb-3">
                    {teamHistory.teamsPlayed} team{teamHistory.teamsPlayed !== 1 ? 's' : ''} across {teamHistory.totalSeasons} season{teamHistory.totalSeasons !== 1 ? 's' : ''}
                  </div>
                  {teamHistory.teamHistory.map((entry, index) => (
                    <div key={index} className="border-l-4 border-primary-200 pl-4 py-2">
                      <div className="flex items-center justify-between">
                        <Link 
                          to={`/teams/${entry.teamId}`}
                          className="font-medium text-gray-900 hover:text-primary-600 transition-colors"
                        >
                          {entry.teamDisplayName || entry.teamName}
                        </Link>
                        {entry.isCurrentSeason && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {entry.seasonName} ({entry.seasonYear})
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        #{entry.jerseyNumber} • {entry.position} • {entry.wins}-{entry.losses}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No team history available</p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  to={`/players?seasonId=${selectedSeason?.id}`}
                  className="w-full btn-outline text-center block"
                >
                  View All Players
                </Link>
                {currentTeam && (
                  <Link
                    to={`/teams/${currentTeam.id}`}
                    className="w-full btn-primary text-center block"
                  >
                    View Team
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}