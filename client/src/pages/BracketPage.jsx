import { useQuery } from '@tanstack/react-query'
import { useSeason } from '../contexts/SeasonContext'
import { publicService, teamService } from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'
import PlayoffBracket from '../components/league/PlayoffBracket'
import VisualBracket from '../components/league/VisualBracket'
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

  // Get all teams sorted by standings for playoff seeding
  const allTeams = standings
    .filter(team => team.isActive)
    .sort((a, b) => {
      const aWinPct = a.wins / (a.wins + a.losses) || 0
      const bWinPct = b.wins / (b.wins + b.losses) || 0
      return bWinPct - aWinPct
    })
    .map((team, index) => ({ ...team, seed: index + 1 }))

  // Determine playoff bracket size and bye teams - March Madness style with all teams
  const totalTeams = allTeams.length
  const playoffTeamCount = totalTeams // Include ALL teams (11 teams)
  const playoffTeams = allTeams // All teams participate
  
  // March Madness style byes: Top 5 teams get byes to round 2 (since 11 teams = 6 play-in games, 5 byes)
  // This creates a 16-team equivalent bracket structure
  const byeTeams = playoffTeams.slice(0, 5) // Top 5 teams get first round byes
  
  // Teams that play in first round
  const firstRoundTeams = playoffTeams.slice(byeTeams.length)

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
                ? 'Track the race to the playoffs. '
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
          <div className="space-y-8">
            {/* Visual Bracket Preview - Full width for better viewing */}
            <div className="w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Tournament Bracket</h2>
              <p className="text-center text-gray-600 mb-6">Complete tournament bracket: Play-in Round → Quarterfinals → Semifinals → Championship</p>
              <VisualBracket teams={playoffTeams} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              {/* Left Column - Current Standings */}
              <div className="xl:col-span-3">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Playoff Picture</h2>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <InformationCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">Tournament Format</h4>
                        <p className="text-sm text-blue-800 mt-1">
                          Single elimination tournament with ALL {playoffTeamCount} teams. 
                          Top 5 teams earn play-in round byes. Bottom 6 teams compete in play-in games. 
                          All teams seeded by regular season performance.
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
                <h3 className="text-xl font-bold text-gray-900 mb-4">Tournament Bracket</h3>
                
                {playoffTeams.length >= 4 ? (
                  <div className="space-y-6">
                    {/* Bye Teams */}
                    {byeTeams.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                          Top {byeTeams.length}
                        </h4>
                        <div className="space-y-2">
                          {byeTeams.map((team) => (
                            <div key={team.id} className="card bg-green-50 border-green-200">
                              <div className="card-body p-3">
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
                        </div>
                      </div>
                    )}

                    {/* First Round Teams */}
                    {firstRoundTeams.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                          Play-in Round - Seeds {byeTeams.length + 1}-{playoffTeamCount}
                        </h4>
                        <div className="space-y-2">
                          {firstRoundTeams.map((team) => (
                            <div key={team.id} className="card">
                              <div className="card-body p-3">
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
                        </div>
                      </div>
                    )}

                    
                    <div className="text-center mt-6 p-4 bg-blue-100 rounded-lg">
                      <p className="text-sm text-blue-700 mb-2">
                        🏀 <strong>ALL {playoffTeamCount} TEAMS</strong> make the tournament!
                      </p>
                      <p className="text-xs text-blue-600">
                        Single elimination - Everyone has a chance!
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
          </div>
        ) : (
          /* Playoff Bracket */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Bracket - Takes up 3 columns */}
            <div className="lg:col-span-3 space-y-8">
              {/* Visual Bracket Flow */}
              <VisualBracket teams={playoffTeams} />
            </div>

            {/* Playoff Teams Sidebar - Takes up 1 column */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Playoff Teams</h3>
              
              {playoffTeams.length >= 4 ? (
                <div className="space-y-6">
                  {/* Bye Teams */}
                  {byeTeams.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                        Top {byeTeams.length}
                      </h4>
                      <div className="space-y-2">
                        {byeTeams.map((team) => (
                          <div key={team.id} className="card bg-green-50 border-green-200">
                            <div className="card-body p-3">
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
                                    {team.wins}-{team.losses} ({team.wins && team.losses ? (team.wins / (team.wins + team.losses)).toFixed(3) : '0.000'})
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* First Round Teams */}
                  {firstRoundTeams.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                        Play-in Round ({firstRoundTeams.length} team{firstRoundTeams.length > 1 ? 's' : ''})
                      </h4>
                      <div className="space-y-2">
                        {firstRoundTeams.map((team) => (
                          <div key={team.id} className="card">
                            <div className="card-body p-3">
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
                                    {team.wins}-{team.losses} ({team.wins && team.losses ? (team.wins / (team.wins + team.losses)).toFixed(3) : '0.000'})
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  
                  <div className="text-center p-4 bg-blue-100 rounded-lg">
                    <p className="text-sm text-blue-700 mb-2">
                      🏀 <strong>ALL {playoffTeamCount} TEAMS</strong> in tournament
                    </p>
                    <p className="text-xs text-blue-600">
                      {byeTeams.length > 0 && `${byeTeams.length} bye${byeTeams.length > 1 ? 's' : ''} awarded to top seeds`}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="card">
                  <div className="card-body text-center py-8">
                    <TrophyIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Playoff teams will be determined by final standings
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Championship Info - Full width below */}
            <div className="lg:col-span-4">
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
          </div>
        )}
      </div>
    </div>
  )
}