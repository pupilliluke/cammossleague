import { useQuery } from '@tanstack/react-query'
import { useSeason } from '../contexts/SeasonContext'
import { publicService, teamService } from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'
import PlayoffBracket from '../components/league/PlayoffBracket'
import StandingsTable from '../components/league/StandingsTable'
import { 
  TrophyIcon, 
  CalendarIcon,
  ChartBarIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'

export default function BracketPage() {
  const { activeSeason, activeSeasonLoading } = useSeason()

  // Fetch playoff bracket
  const { data: bracket, isLoading: bracketLoading } = useQuery({
    queryKey: ['bracket', activeSeason?.id],
    queryFn: publicService.getPlayoffBracket,
    enabled: !!activeSeason,
  })

  // Fetch current standings for seeding reference
  const { data: standings = [], isLoading: standingsLoading } = useQuery({
    queryKey: ['standings', activeSeason?.id],
    queryFn: () => teamService.getAllTeams({ seasonId: activeSeason.id }),
    enabled: !!activeSeason,
  })

  if (activeSeasonLoading || bracketLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!activeSeason) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <TrophyIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Season</h2>
          <p className="text-gray-600">Check back soon for the next season!</p>
        </div>
      </div>
    )
  }

  // Determine playoff status
  const now = new Date()
  const playoffStart = activeSeason.playoffStartDate ? new Date(activeSeason.playoffStartDate) : null
  const isPlayoffTime = playoffStart && now >= playoffStart
  const isRegularSeason = !isPlayoffTime

  // Get top 4 teams for playoff seeding
  const playoffTeams = standings
    .filter(team => team.isActive)
    .sort((a, b) => {
      const aWinPct = a.wins / (a.wins + a.losses) || 0
      const bWinPct = b.wins / (b.wins + b.losses) || 0
      return bWinPct - aWinPct
    })
    .slice(0, 4)
    .map((team, index) => ({ ...team, seed: index + 1 }))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Playoff Bracket
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
              {isRegularSeason 
                ? 'Track the race to the playoffs. Top 4 teams qualify for the tournament.'
                : 'Follow the playoff journey to crown our season champion.'
              }
            </p>

            {/* Season Status */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full">
              {isRegularSeason ? (
                <>
                  <ChartBarIcon className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">Regular Season</span>
                  {playoffStart && (
                    <span className="text-xs text-gray-600">
                      • Playoffs start {format(playoffStart, 'MMM d')}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <TrophyIcon className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm font-medium text-gray-900">Playoffs Active</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isRegularSeason ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Current Standings */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Playoff Picture</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <InformationCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Playoff Format</h4>
                      <p className="text-sm text-blue-800 mt-1">
                        Top 4 teams make the playoffs. Single elimination tournament with 
                        quarterfinals, semifinals, and championship game.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {standingsLoading ? (
                <div className="card">
                  <div className="card-body">
                    <LoadingSpinner size="md" />
                  </div>
                </div>
              ) : (
                <StandingsTable teams={standings} />
              )}
            </div>

            {/* Right Column - Playoff Preview */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">If Playoffs Started Today</h3>
              
              {playoffTeams.length >= 4 ? (
                <div className="space-y-3">
                  {playoffTeams.map((team) => (
                    <div key={team.id} className="card">
                      <div className="card-body p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                            team.seed === 1 ? 'bg-yellow-500' :
                            team.seed === 2 ? 'bg-gray-400' :
                            team.seed === 3 ? 'bg-orange-600' : 'bg-blue-600'
                          }`}>
                            {team.seed}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{team.name}</div>
                            <div className="text-sm text-gray-500">
                              {team.wins}-{team.losses} ({(team.wins / (team.wins + team.losses)).toFixed(3)})
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="text-center mt-6">
                    <p className="text-sm text-gray-500">
                      Seeding based on current standings
                    </p>
                  </div>
                </div>
              ) : (
                <div className="card">
                  <div className="card-body text-center py-8">
                    <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Not enough teams have played games to determine playoff seeding
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Playoff Bracket */
          <div>
            <div className="mb-8">
              <PlayoffBracket bracket={bracket} teams={playoffTeams} />
            </div>

            {/* Championship Info */}
            {playoffStart && (
              <div className="card">
                <div className="card-body p-6">
                  <div className="text-center">
                    <TrophyIcon className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {activeSeason.name} Championship
                    </h3>
                    <p className="text-gray-600 mb-4">
                      The championship game will determine this season's winner
                    </p>
                    <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-4 w-4" />
                        <span>Single Elimination</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrophyIcon className="h-4 w-4" />
                        <span>Winner Takes All</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}