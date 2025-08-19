import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CalendarIcon, ClockIcon, MapPinIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { scheduleService, playerService } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { useSeason } from '../contexts/SeasonContext'
import LoadingSpinner from '../components/common/LoadingSpinner'
import SeasonDropdown from '../components/common/SeasonDropdown'
import Breadcrumb from '../components/common/Breadcrumb'

export default function PlayerSchedulePage() {
  const { id } = useParams()
  const [player, setPlayer] = useState(null)
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedWeek, setSelectedWeek] = useState('all')
  const [gameType, setGameType] = useState('all')
  const { currentSeason } = useSeason()
  const { user } = useAuth()

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Players', href: '/players' },
    { label: player?.user?.firstName + ' ' + player?.user?.lastName || 'Player', href: `/players/${id}` },
    { label: 'Schedule', href: `/players/${id}/schedule` }
  ]

  useEffect(() => {
    if (id && currentSeason?.id) {
      loadPlayerAndSchedule()
    }
  }, [id, currentSeason, selectedWeek, gameType])

  const loadPlayerAndSchedule = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Load player details
      const playerData = await playerService.getById(id)
      setPlayer(playerData)
      
      // Get player's team for current season
      const playerTeams = playerData.playerTeams?.filter(pt => 
        pt.team.seasonId === currentSeason.id && pt.status === 'ACTIVE'
      )
      
      if (playerTeams && playerTeams.length > 0) {
        // Load team's schedule since player schedule = team schedule
        const teamId = playerTeams[0].team.id
        const gamesData = await scheduleService.getGamesByTeamAndSeason(teamId, currentSeason.id)
        
        // Filter games based on selected filters
        let filteredGames = gamesData || []
        
        if (selectedWeek !== 'all') {
          filteredGames = filteredGames.filter(game => game.weekNumber === parseInt(selectedWeek))
        }
        
        if (gameType !== 'all') {
          filteredGames = filteredGames.filter(game => game.gameType === gameType)
        }
        
        setGames(filteredGames)
      } else {
        setGames([])
      }
    } catch (err) {
      console.error('Error loading player schedule:', err)
      setError('Failed to load player schedule')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':')
    const date = new Date()
    date.setHours(parseInt(hours), parseInt(minutes))
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getGameTypeColor = (type) => {
    switch (type) {
      case 'PLAYOFF':
        return 'bg-purple-100 text-purple-800'
      case 'CHAMPIONSHIP':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const getPlayerTeam = () => {
    if (!player?.playerTeams) return null
    return player.playerTeams.find(pt => 
      pt.team.seasonId === currentSeason?.id && pt.status === 'ACTIVE'
    )?.team
  }

  const getGameResult = (game, playerTeam) => {
    if (!game.isCompleted || !game.gameResult || !playerTeam) return null
    
    const isHome = game.homeTeam.id === playerTeam.id
    const teamScore = isHome ? game.gameResult.homeTeamScore : game.gameResult.awayTeamScore
    const opponentScore = isHome ? game.gameResult.awayTeamScore : game.gameResult.homeTeamScore
    const isWin = game.gameResult.winningTeam?.id === playerTeam.id
    
    return {
      teamScore,
      opponentScore,
      isWin,
      opponent: isHome ? game.awayTeam : game.homeTeam,
      isHome
    }
  }

  const groupGamesByDate = (games) => {
    return games.reduce((groups, game) => {
      const date = game.gameDate
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(game)
      return groups
    }, {})
  }

  const weeks = Array.from({ length: 12 }, (_, i) => i + 1)
  const gameTypes = ['REGULAR', 'PLAYOFF', 'CHAMPIONSHIP']
  const playerTeam = getPlayerTeam()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const groupedGames = groupGamesByDate(games)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} />
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              to={`/players/${id}`}
              className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-1" />
              Back to Player
            </Link>
          </div>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {player?.user?.firstName} {player?.user?.lastName} Schedule
              </h1>
              <p className="text-gray-600 mt-2">
                {currentSeason?.name} - All games for {player?.user?.firstName} {player?.user?.lastName}
                {playerTeam && ` (${playerTeam.name})`}
              </p>
            </div>
            <SeasonDropdown />
          </div>
        </div>

        {/* Player Info */}
        {player && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {player.user.firstName} {player.user.lastName}
                </h2>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  {player.position && (
                    <span>Position: {player.position}</span>
                  )}
                  {player.jerseyNumber && (
                    <span>Jersey: #{player.jerseyNumber}</span>
                  )}
                  {playerTeam && (
                    <Link
                      to={`/teams/${playerTeam.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Team: {playerTeam.name}
                    </Link>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {player.statsGamesPlayed || 0}
                </div>
                <div className="text-sm text-gray-500">Games Played</div>
              </div>
            </div>
          </div>
        )}

        {/* No team message */}
        {!playerTeam && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-yellow-800">
              This player is not currently on a team for the {currentSeason?.name} season.
            </p>
          </div>
        )}

        {/* Filters */}
        {playerTeam && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Week
                </label>
                <select
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                  className="form-select"
                >
                  <option value="all">All Weeks</option>
                  {weeks.map(week => (
                    <option key={week} value={week}>
                      Week {week}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Game Type
                </label>
                <select
                  value={gameType}
                  onChange={(e) => setGameType(e.target.value)}
                  className="form-select"
                >
                  <option value="all">All Games</option>
                  {gameTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Schedule */}
        {!playerTeam || Object.keys(groupedGames).length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No games scheduled
            </h3>
            <p className="text-gray-600">
              {!playerTeam 
                ? "Player needs to be on a team to have scheduled games."
                : "Check back later for upcoming games."
              }
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedGames).map(([date, dateGames]) => (
              <div key={date} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {formatDate(date)}
                  </h3>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {dateGames.map((game) => {
                    const result = getGameResult(game, playerTeam)
                    const isHome = game.homeTeam.id === playerTeam.id
                    const opponent = isHome ? game.awayTeam : game.homeTeam
                    
                    return (
                      <div key={game.id} className="p-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex items-center space-x-6">
                            {/* Game Type Badge */}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGameTypeColor(game.gameType)}`}>
                              {game.gameType === 'REGULAR' ? 'Regular Season' : 
                               game.gameType === 'PLAYOFF' ? 'Playoff' : 'Championship'}
                            </span>
                            
                            {/* Week */}
                            <span className="text-sm text-gray-500">
                              Week {game.weekNumber}
                            </span>
                            
                            {/* Home/Away */}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              isHome ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {isHome ? 'Home' : 'Away'}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <ClockIcon className="w-4 h-4 mr-1" />
                              {formatTime(game.gameTime)}
                            </div>
                            <div className="flex items-center">
                              <MapPinIcon className="w-4 h-4 mr-1" />
                              {game.location}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex items-center justify-center">
                          <div className="flex items-center space-x-8">
                            {/* Player's Team */}
                            <div className="text-center">
                              <Link
                                to={`/teams/${playerTeam.id}`}
                                className="text-lg font-semibold text-blue-600 hover:text-blue-800"
                              >
                                {playerTeam.name}
                              </Link>
                              <div className="text-sm text-gray-500">
                                {isHome ? 'Home' : 'Away'}
                              </div>
                            </div>
                            
                            {/* Score or VS */}
                            <div className="text-center">
                              {result ? (
                                <div className={`text-2xl font-bold ${result.isWin ? 'text-green-600' : 'text-red-600'}`}>
                                  {result.teamScore} - {result.opponentScore}
                                </div>
                              ) : (
                                <div className="text-xl text-gray-400 font-semibold">
                                  VS
                                </div>
                              )}
                            </div>
                            
                            {/* Opponent */}
                            <div className="text-center">
                              <Link
                                to={`/teams/${opponent.id}`}
                                className="text-lg font-semibold text-blue-600 hover:text-blue-800"
                              >
                                {opponent.name}
                              </Link>
                              <div className="text-sm text-gray-500">
                                {isHome ? 'Away' : 'Home'}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {result && (
                          <div className="mt-4 text-center">
                            <span className={`text-sm font-medium ${result.isWin ? 'text-green-600' : 'text-red-600'}`}>
                              {result.isWin ? 'Win' : 'Loss'}
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}