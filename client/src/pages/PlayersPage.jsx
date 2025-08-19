import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useSeason } from '../contexts/SeasonContext'
import { useAuth } from '../contexts/AuthContext'
import { playerService, teamService } from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'
import PlayerCard from '../components/players/PlayerCard'
import SeasonDropdown from '../components/common/SeasonDropdown'
import LoginModal from '../components/auth/LoginModal'
import { 
  MagnifyingGlassIcon,
  UserIcon,
  FunnelIcon,
  ChartBarIcon,
  CalendarIcon,
  LockClosedIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export default function PlayersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [positionFilter, setPositionFilter] = useState('all')
  const [teamFilter, setTeamFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [showLoginModal, setShowLoginModal] = useState(false)
  
  const { selectedSeason, allSeasonsLoading } = useSeason()
  const { user, loading: authLoading } = useAuth()
  
  // Fetch teams for team filter dropdown
  const { data: teams = [], isLoading: teamsLoading } = useQuery({
    queryKey: ['teams', selectedSeason?.id],
    queryFn: () => teamService.getAllTeams({ seasonId: selectedSeason?.id }),
    enabled: !!selectedSeason,
  })
  
  // Fetch players with filters - only when authenticated
  const { data: players = [], isLoading: playersLoading, error: playersError } = useQuery({
    queryKey: ['players', selectedSeason?.id, teamFilter],
    queryFn: () => {
      const params = { seasonId: selectedSeason?.id }
      if (teamFilter !== 'all') {
        params.teamId = parseInt(teamFilter)
      }
      return playerService.getAllPlayers(params)
    },
    enabled: !!selectedSeason && !!user,
  })

  // Loading state
  if (authLoading || allSeasonsLoading || teamsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    )
  }

  // Authentication required message
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Players</h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                View player information, stats, and profiles.
              </p>
            </div>
          </div>
        </div>

        {/* Sign in Required Message */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-6">
              <LockClosedIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Sign in Required
            </h2>
            <p className="text-gray-600 mb-6">
              Please sign in to view player information and statistics. Player data is only available to authenticated users.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setShowLoginModal(true)}
                className="w-full btn-primary"
              >
                Sign In
              </button>
              <p className="text-sm text-gray-500">
                Don't have an account? <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-500">Join the league</Link>
              </p>
            </div>
          </div>
        </div>

        {/* Login Modal */}
        {showLoginModal && (
          <LoginModal 
            isOpen={showLoginModal} 
            onClose={() => setShowLoginModal(false)} 
          />
        )}
      </div>
    )
  }

  // Loading players for authenticated user
  if (playersLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {selectedSeason?.name} Players
                </h1>
                <p className="text-lg text-gray-600 max-w-3xl">
                  Loading player information...
                </p>
              </div>
              <div className="w-full md:w-80">
                <SeasonDropdown />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  // Filter and sort players
  const filteredPlayers = players
    .filter(player => {
      const matchesSearch = 
        player.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${player.user?.firstName} ${player.user?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesPosition = positionFilter === 'all' || player.position === positionFilter
      
      // Team filtering is now handled in the API query, so no need to filter here
      return matchesSearch && matchesPosition
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          const aName = `${a.user?.firstName} ${a.user?.lastName}`
          const bName = `${b.user?.firstName} ${b.user?.lastName}`
          return aName.localeCompare(bName)
        case 'position':
          return a.position.localeCompare(b.position)
        case 'points':
          return (b.statsPoints || 0) - (a.statsPoints || 0)
        case 'rebounds':
          return (b.statsRebounds || 0) - (a.statsRebounds || 0)
        case 'assists':
          return (b.statsAssists || 0) - (a.statsAssists || 0)
        case 'ppg':
          return (b.pointsPerGame || 0) - (a.pointsPerGame || 0)
        default:
          return 0
      }
    })

  const playerStats = {
    total: players.length,
    positions: {
      PG: players.filter(p => p.position === 'PG').length,
      SG: players.filter(p => p.position === 'SG').length,
      SF: players.filter(p => p.position === 'SF').length,
      PF: players.filter(p => p.position === 'PF').length,
      C: players.filter(p => p.position === 'C').length,
    },
    avgPpg: players.reduce((acc, p) => acc + (p.pointsPerGame || 0), 0) / players.length || 0
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {selectedSeason?.name} Players
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl">
                Explore all players competing in this season. View stats, positions, and player profiles.
              </p>
            </div>
            <div className="w-full md:w-80">
              <SeasonDropdown />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <UserIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{playerStats.total}</div>
              <div className="text-sm text-gray-600">Total Players</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <ChartBarIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{playerStats.avgPpg.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Avg PPG</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{playerStats.positions.PG}</div>
              <div className="text-sm text-gray-600">Point Guards</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{playerStats.positions.C}</div>
              <div className="text-sm text-gray-600">Centers</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search players by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10 w-full"
              />
            </div>

            {/* Filters */}
            <div className="flex space-x-2">
              {/* Team Filter */}
              <select
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
                className="form-select"
              >
                <option value="all">All Teams</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.displayName || team.name}
                  </option>
                ))}
              </select>

              {/* Position Filter */}
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="form-select"
              >
                <option value="all">All Positions</option>
                <option value="PG">Point Guard</option>
                <option value="SG">Shooting Guard</option>
                <option value="SF">Small Forward</option>
                <option value="PF">Power Forward</option>
                <option value="C">Center</option>
                <option value="UTIL">Utility</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select"
              >
                <option value="name">Name</option>
                <option value="position">Position</option>
                <option value="ppg">Points Per Game</option>
                <option value="rebounds">Rebounds</option>
                <option value="assists">Assists</option>
                <option value="points">Total Points</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Players Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredPlayers.length === 0 ? (
          <div className="text-center py-12">
            <UserIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No players found</h3>
            <p className="text-gray-600">
              {searchTerm 
                ? `No players match "${searchTerm}"`
                : 'No players available for this season'
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 btn-outline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {filteredPlayers.length} of {players.length} players
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>

            {/* Players Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPlayers.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}