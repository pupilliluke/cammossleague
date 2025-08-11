import { useQuery } from '@tanstack/react-query'
import { useSeason } from '../contexts/SeasonContext'
import { publicService, gameService, teamService, leagueService } from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'
import GameCard from '../components/league/GameCard'
import StandingsTable from '../components/league/StandingsTable'
import LeagueUpdates from '../components/league/LeagueUpdates'
import ScheduleSection from '../components/league/ScheduleSection'
import SeasonDropdown from '../components/common/SeasonDropdown'
import { 
  CalendarIcon, 
  TrophyIcon, 
  UserGroupIcon, 
  PlayIcon 
} from '@heroicons/react/24/outline'

export default function LeaguePage() {
  const { selectedSeason, allSeasonsLoading } = useSeason()

  // Fetch league stats for selected season
  const { data: leagueStats, isLoading: leagueStatsLoading } = useQuery({
    queryKey: ['league-stats', selectedSeason?.id],
    queryFn: () => leagueService.getLeagueStats({ seasonId: selectedSeason.id }),
    enabled: !!selectedSeason,
  })

  // Fetch upcoming games
  const { data: upcomingGames = [], isLoading: upcomingLoading } = useQuery({
    queryKey: ['games', 'upcoming'],
    queryFn: gameService.getUpcomingGames,
    enabled: !!selectedSeason,
  })

  // Fetch recent results
  const { data: recentResults = [], isLoading: resultsLoading } = useQuery({
    queryKey: ['games', 'recent-results'],
    queryFn: gameService.getRecentResults,
    enabled: !!selectedSeason,
  })

  // Fetch standings
  const { data: standings = [], isLoading: standingsLoading } = useQuery({
    queryKey: ['standings', selectedSeason?.id],
    queryFn: () => teamService.getAllTeams({ seasonId: selectedSeason.id, orderByStandings: true }),
    enabled: !!selectedSeason,
  })

  // Fetch league updates
  const { data: updates = [], isLoading: updatesLoading } = useQuery({
    queryKey: ['updates', 'public'],
    queryFn: () => publicService.getLeagueUpdates({ limit: 5 }),
    enabled: !!selectedSeason,
  })

  if (allSeasonsLoading || leagueStatsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!selectedSeason) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <TrophyIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Season Selected</h2>
          <p className="text-gray-600">Please select a season to view league information.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {selectedSeason.name} Dashboard
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl">
                {selectedSeason.description}
              </p>
            </div>
            <div className="w-full md:w-80">
              <SeasonDropdown />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <UserGroupIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {leagueStats?.totalTeams || standings.length || '0'}
              </div>
              <div className="text-sm text-gray-600">Teams</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <PlayIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {leagueStats?.totalPlayers || '0'}
              </div>
              <div className="text-sm text-gray-600">Players</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <CalendarIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {leagueStats?.gamesPlayed || '0'}
              </div>
              <div className="text-sm text-gray-600">Games Played</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <TrophyIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {selectedSeason?.year || 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Season Year</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Games */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Games */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">This Week's Games</h2>
                <a href="/schedule" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View Full Schedule →
                </a>
              </div>
              
              {upcomingLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
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
              ) : upcomingGames.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingGames.slice(0, 6).map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              ) : (
                <div className="card">
                  <div className="card-body text-center py-8">
                    <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No upcoming games scheduled</p>
                  </div>
                </div>
              )}
            </section>

            {/* Recent Results */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Results</h2>
                <a href="/results" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All Results →
                </a>
              </div>
              
              {resultsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
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
              ) : recentResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentResults.slice(0, 6).map((game) => (
                    <GameCard key={game.id} game={game} showResult={true} />
                  ))}
                </div>
              ) : (
                <div className="card">
                  <div className="card-body text-center py-8">
                    <TrophyIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No game results yet</p>
                  </div>
                </div>
              )}
            </section>

            {/* Schedule Section */}
            <section>
              <ScheduleSection selectedSeason={selectedSeason} />
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Standings */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Current Standings</h2>
                <a href="/standings" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View Full Standings →
                </a>
              </div>
              
              {standingsLoading ? (
                <div className="card">
                  <div className="card-body">
                    <div className="animate-pulse space-y-3">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <div className="skeleton h-4 w-4" />
                          <div className="skeleton h-6 w-6 rounded-full" />
                          <div className="skeleton h-4 flex-1" />
                          <div className="skeleton h-4 w-12" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <StandingsTable teams={standings.slice(0, 8)} />
              )}
            </section>

            {/* League Updates */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">League Updates</h2>
                <a href="/updates" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All Updates →
                </a>
              </div>
              
              {updatesLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="card">
                      <div className="card-body">
                        <div className="animate-pulse">
                          <div className="skeleton h-4 w-3/4 mb-2" />
                          <div className="skeleton h-3 w-1/2 mb-3" />
                          <div className="skeleton h-16 w-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <LeagueUpdates updates={updates} />
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}