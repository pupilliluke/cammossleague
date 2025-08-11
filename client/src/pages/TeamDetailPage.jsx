import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { teamService, playerService, scheduleService } from '../services/api'
import { useSeason } from '../contexts/SeasonContext'
import LoadingSpinner from '../components/common/LoadingSpinner'
import PlayerCard from '../components/players/PlayerCard'
import Breadcrumb from '../components/common/Breadcrumb'
import GameCard from '../components/league/GameCard'
import {
  UserGroupIcon,
  TrophyIcon,
  ChartBarIcon,
  CalendarIcon,
  ArrowLeftIcon,
  UserIcon,
  StarIcon
} from '@heroicons/react/24/outline'

export default function TeamDetailPage() {
  const { id } = useParams()
  const { selectedSeason } = useSeason()

  // Fetch team details
  const { data: team, isLoading: teamLoading, error } = useQuery({
    queryKey: ['team', id],
    queryFn: () => teamService.getById(id),
    enabled: !!id,
  })

  // Fetch team roster
  const { data: roster = [], isLoading: rosterLoading } = useQuery({
    queryKey: ['team-roster', id, selectedSeason?.id],
    queryFn: () => playerService.getPlayersByTeamAndSeason(id, selectedSeason?.id),
    enabled: !!id && !!selectedSeason,
  })

  // Fetch all teams for comparison (standings)
  const { data: allTeams = [] } = useQuery({
    queryKey: ['teams-standings', selectedSeason?.id],
    queryFn: () => teamService.getAllTeams({ seasonId: selectedSeason?.id, orderByStandings: true }),
    enabled: !!selectedSeason,
  })

  // Fetch team schedule
  const { data: teamSchedule = [], isLoading: scheduleLoading } = useQuery({
    queryKey: ['team-schedule', id, selectedSeason?.id],
    queryFn: () => scheduleService.getGamesByTeamAndSeason(id, selectedSeason?.id),
    enabled: !!id && !!selectedSeason,
  })

  const teamRanking = allTeams.findIndex(t => t.id === parseInt(id)) + 1

  if (teamLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !team) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Team Not Found</h1>
          <p className="text-gray-600 mb-8">The team you're looking for doesn't exist.</p>
          <Link to="/teams" className="btn-primary">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Teams
          </Link>
        </div>
      </div>
    )
  }

  const teamStats = {
    wins: team.wins || 0,
    losses: team.losses || 0,
    winPercentage: team.winPercentage || 0,
    pointsFor: team.pointsFor || 0,
    pointsAgainst: team.pointsAgainst || 0,
    pointsDifferential: team.pointsDifferential || 0
  }

  const totalGames = teamStats.wins + teamStats.losses

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <Breadcrumb 
              items={[
                { name: 'Teams', href: '/teams' },
                { name: team.displayName || team.name, href: `/teams/${team.id}` }
              ]}
            />
          </div>

          {/* Team Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mr-6"
                style={{ backgroundColor: team.primaryColor || '#1E40AF' }}
              >
                <TrophyIcon className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {team.displayName || team.name}
                </h1>
                <div className="flex items-center space-x-4 text-gray-600">
                  {teamRanking > 0 && (
                    <span className="flex items-center">
                      <StarIcon className="h-4 w-4 mr-1" />
                      #{teamRanking} in standings
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    team.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {team.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
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
          {/* Team Stats */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <ChartBarIcon className="h-5 w-5 mr-2 text-primary-600" />
                Season Statistics
              </h2>
              
              {/* Primary Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-primary-600 mb-1">
                    {teamStats.wins}
                  </div>
                  <div className="text-sm text-gray-600">Wins</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600 mb-1">
                    {teamStats.losses}
                  </div>
                  <div className="text-sm text-gray-600">Losses</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {(teamStats.winPercentage * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Win %</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`text-3xl font-bold mb-1 ${
                    teamStats.pointsDifferential >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {teamStats.pointsDifferential > 0 ? '+' : ''}{teamStats.pointsDifferential}
                  </div>
                  <div className="text-sm text-gray-600">Point Diff</div>
                </div>
              </div>

              {/* Scoring Stats */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Scoring</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-xl font-semibold text-gray-900">
                      {teamStats.pointsFor}
                    </div>
                    <div className="text-sm text-gray-600">Points For</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-xl font-semibold text-gray-900">
                      {teamStats.pointsAgainst}
                    </div>
                    <div className="text-sm text-gray-600">Points Against</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-xl font-semibold text-gray-900">
                      {totalGames > 0 ? (teamStats.pointsFor / totalGames).toFixed(1) : '0.0'}
                    </div>
                    <div className="text-sm text-gray-600">PPG</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-xl font-semibold text-gray-900">
                      {totalGames > 0 ? (teamStats.pointsAgainst / totalGames).toFixed(1) : '0.0'}
                    </div>
                    <div className="text-sm text-gray-600">Opp PPG</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Roster */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2 text-primary-600" />
                  Team Roster ({roster.length} players)
                </h3>
              </div>
              
              {rosterLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : roster.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <UserIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No players found for this team in the current season</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roster.map((player) => (
                    <div key={player.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                          <UserIcon className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <Link 
                              to={`/players/${player.id}`}
                              className="font-medium text-gray-900 hover:text-primary-600 transition-colors"
                            >
                              {player.displayName}
                            </Link>
                            <span className="text-sm text-gray-500">
                              #{player.jerseyNumber || 'N/A'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {player.position?.displayName || player.position}
                            {player.heightDisplay && (
                              <span> • {player.heightDisplay}</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {player.pointsPerGame?.toFixed(1)} PPG • 
                            {player.reboundsPerGame?.toFixed(1)} RPG • 
                            {player.assistsPerGame?.toFixed(1)} APG
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Team Schedule */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Team Schedule</h3>
                  <p className="text-sm text-gray-600">All games for {team?.name}</p>
                </div>
                <Link
                  to={`/teams/${id}/schedule`}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View Full Schedule →
                </Link>
              </div>
              
              <div className="p-6">
                {scheduleLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="card">
                        <div className="card-body p-4">
                          <div className="animate-pulse">
                            <div className="skeleton h-4 w-1/4 mb-3" />
                            <div className="skeleton h-6 w-3/4 mb-2" />
                            <div className="skeleton h-4 w-1/2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : teamSchedule.length > 0 ? (
                  <div className="space-y-4">
                    {teamSchedule.slice(0, 5).map((game) => (
                      <GameCard key={game.id} game={game} showResult={game.isCompleted} />
                    ))}
                    
                    {teamSchedule.length > 5 && (
                      <div className="text-center pt-4">
                        <Link
                          to={`/teams/${id}/schedule`}
                          className="btn-secondary"
                        >
                          View All {teamSchedule.length} Games
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No games scheduled</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Team Info Sidebar */}
          <div className="space-y-6">
            {/* Team Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Team Information</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Colors</span>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: team.primaryColor }}
                      title="Primary Color"
                    />
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: team.secondaryColor }}
                      title="Secondary Color"
                    />
                  </div>
                </div>
                {team.description && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600">{team.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Team Leaders */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Team Leaders</h3>
              <div className="space-y-3">
                {roster.length > 0 ? (
                  <>
                    {/* Top Scorer */}
                    {(() => {
                      const topScorer = roster.reduce((max, player) => 
                        (player.pointsPerGame || 0) > (max.pointsPerGame || 0) ? player : max
                      )
                      return (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Leading Scorer</span>
                          <div className="text-right">
                            <Link 
                              to={`/players/${topScorer.id}`}
                              className="text-sm font-medium text-gray-900 hover:text-primary-600"
                            >
                              {topScorer.displayName}
                            </Link>
                            <div className="text-xs text-gray-500">
                              {(topScorer.pointsPerGame || 0).toFixed(1)} PPG
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                    
                    {/* Top Rebounder */}
                    {(() => {
                      const topRebounder = roster.reduce((max, player) => 
                        (player.reboundsPerGame || 0) > (max.reboundsPerGame || 0) ? player : max
                      )
                      return (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Leading Rebounder</span>
                          <div className="text-right">
                            <Link 
                              to={`/players/${topRebounder.id}`}
                              className="text-sm font-medium text-gray-900 hover:text-primary-600"
                            >
                              {topRebounder.displayName}
                            </Link>
                            <div className="text-xs text-gray-500">
                              {(topRebounder.reboundsPerGame || 0).toFixed(1)} RPG
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                  </>
                ) : (
                  <p className="text-sm text-gray-500">No player statistics available</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  to={`/teams?seasonId=${selectedSeason?.id}`}
                  className="w-full btn-outline text-center block"
                >
                  View All Teams
                </Link>
                <Link
                  to={`/players?teamId=${team.id}&seasonId=${selectedSeason?.id}`}
                  className="w-full btn-primary text-center block"
                >
                  View Team Players
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}