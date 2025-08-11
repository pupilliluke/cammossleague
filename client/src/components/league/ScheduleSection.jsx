import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format, parseISO, isToday, isThisWeek, startOfWeek, endOfWeek } from 'date-fns'
import { 
  CalendarIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  TrophyIcon,
  PlayIcon
} from '@heroicons/react/24/outline'
import { scheduleService } from '../../services/api'
import GameCard from './GameCard'
import LoadingSpinner from '../common/LoadingSpinner'

export default function ScheduleSection({ selectedSeason }) {
  const [selectedWeek, setSelectedWeek] = useState('current')
  const [viewType, setViewType] = useState('week') // 'week', 'upcoming', 'all'

  // Get schedule stats for the season
  const { data: scheduleStats, isLoading: statsLoading } = useQuery({
    queryKey: ['schedule-stats', selectedSeason?.id],
    queryFn: () => scheduleService.getSeasonStats(selectedSeason.id),
    enabled: !!selectedSeason,
  })

  // Get games based on view type
  const { data: games = [], isLoading: gamesLoading, error } = useQuery({
    queryKey: ['schedule-games', selectedSeason?.id, viewType, selectedWeek],
    queryFn: async () => {
      if (!selectedSeason) return []
      
      if (viewType === 'upcoming') {
        return scheduleService.getUpcomingGamesBySeason(selectedSeason.id)
      } else if (viewType === 'all') {
        return scheduleService.getGamesBySeason(selectedSeason.id)
      } else {
        // Week view - for now, get upcoming games and filter
        const allGames = await scheduleService.getGamesBySeason(selectedSeason.id)
        
        if (selectedWeek === 'current') {
          const now = new Date()
          const weekStart = startOfWeek(now)
          const weekEnd = endOfWeek(now)
          
          return allGames.filter(game => {
            const gameDate = parseISO(game.gameDate)
            return gameDate >= weekStart && gameDate <= weekEnd
          })
        }
        
        // Filter by week number
        return allGames.filter(game => game.weekNumber === parseInt(selectedWeek))
      }
    },
    enabled: !!selectedSeason,
  })

  // Group games by date for better display
  const gamesByDate = games.reduce((acc, game) => {
    const date = game.gameDate
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(game)
    return acc
  }, {})

  const sortedDates = Object.keys(gamesByDate).sort()

  if (statsLoading || gamesLoading) {
    return (
      <div className="card">
        <div className="card-body p-6">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-body p-6 text-center">
          <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Unable to load schedule</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Schedule Header with Stats */}
      <div className="card">
        <div className="card-body p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Schedule</h2>
              <p className="text-gray-600">
                {selectedSeason.name} game schedule and results
              </p>
            </div>
            
            {scheduleStats && (
              <div className="grid grid-cols-3 gap-4 mt-4 sm:mt-0">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    {scheduleStats.totalGames || 0}
                  </div>
                  <div className="text-xs text-gray-600">Total Games</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {scheduleStats.completedGames || 0}
                  </div>
                  <div className="text-xs text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {scheduleStats.upcomingGames || 0}
                  </div>
                  <div className="text-xs text-gray-600">Upcoming</div>
                </div>
              </div>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setViewType('week')}
              className={`btn btn-sm ${
                viewType === 'week' ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              <CalendarIcon className="h-4 w-4 mr-1" />
              This Week
            </button>
            <button
              onClick={() => setViewType('upcoming')}
              className={`btn btn-sm ${
                viewType === 'upcoming' ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              <PlayIcon className="h-4 w-4 mr-1" />
              Upcoming
            </button>
            <button
              onClick={() => setViewType('all')}
              className={`btn btn-sm ${
                viewType === 'all' ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              <TrophyIcon className="h-4 w-4 mr-1" />
              Full Schedule
            </button>
          </div>

          {/* Week Selector (only show for week view) */}
          {viewType === 'week' && (
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => {
                  const currentWeek = selectedWeek === 'current' ? 1 : parseInt(selectedWeek)
                  if (currentWeek > 1) {
                    setSelectedWeek((currentWeek - 1).toString())
                  }
                }}
                className="btn btn-sm btn-secondary"
                disabled={selectedWeek === '1'}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="select select-sm"
              >
                <option value="current">Current Week</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={(i + 1).toString()}>
                    Week {i + 1}
                  </option>
                ))}
              </select>
              
              <button
                onClick={() => {
                  const currentWeek = selectedWeek === 'current' ? 1 : parseInt(selectedWeek)
                  if (currentWeek < 12) {
                    setSelectedWeek((currentWeek + 1).toString())
                  }
                }}
                className="btn btn-sm btn-secondary"
                disabled={selectedWeek === '12'}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Games Display */}
      {games.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-12">
            <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Games Found</h3>
            <p className="text-gray-500">
              {viewType === 'week' 
                ? 'No games scheduled for this week' 
                : viewType === 'upcoming'
                ? 'No upcoming games scheduled'
                : 'No games in this season'
              }
            </p>
          </div>
        </div>
      ) : viewType === 'all' ? (
        // Group by date for full schedule view
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date} className="space-y-4">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
                </h3>
                {isToday(parseISO(date)) && (
                  <span className="ml-2 badge bg-blue-100 text-blue-800">Today</span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gamesByDate[date].map((game) => (
                  <GameCard key={game.id} game={game} showResult={game.isCompleted} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Simple grid for week/upcoming view
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((game) => (
            <GameCard key={game.id} game={game} showResult={game.isCompleted} />
          ))}
        </div>
      )}

      {/* View Full Schedule Link */}
      {games.length > 0 && viewType !== 'all' && (
        <div className="text-center">
          <button
            onClick={() => setViewType('all')}
            className="btn btn-secondary"
          >
            View Full Schedule
          </button>
        </div>
      )}
    </div>
  )
}