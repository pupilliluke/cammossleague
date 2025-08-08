import { useState } from 'react'
import LoadingSpinner from '../components/common/LoadingSpinner'
import TeamCard from '../components/teams/TeamCard'
import { 
  MagnifyingGlassIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

// Mock data for when API is unavailable
const mockTeams = [
  {
    id: 1,
    name: "Thunder Hawks",
    city: "Downtown",
    primaryColor: "#1E40AF",
    secondaryColor: "#FFFFFF",
    wins: 5,
    losses: 1,
    pointsFor: 468,
    pointsAgainst: 421,
    description: "A powerhouse team known for fast breaks and defensive intensity."
  },
  {
    id: 2,
    name: "Fire Dragons", 
    city: "Eastside",
    primaryColor: "#DC2626",
    secondaryColor: "#FBBF24",
    wins: 4,
    losses: 2,
    pointsFor: 445,
    pointsAgainst: 432,
    description: "Young and energetic squad with explosive offensive capabilities."
  },
  {
    id: 3,
    name: "Lightning Bolts",
    city: "Westside", 
    primaryColor: "#7C3AED",
    secondaryColor: "#F3E8FF",
    wins: 3,
    losses: 3,
    pointsFor: 428,
    pointsAgainst: 435,
    description: "Strategic team that excels in half-court sets and team chemistry."
  },
  {
    id: 4,
    name: "Steel Warriors",
    city: "Northside",
    primaryColor: "#374151", 
    secondaryColor: "#9CA3AF",
    wins: 3,
    losses: 3,
    pointsFor: 415,
    pointsAgainst: 441,
    description: "Defensive-minded team that grinds out tough victories."
  },
  {
    id: 5,
    name: "Crimson Phoenixes",
    city: "Southside",
    primaryColor: "#B91C1C",
    secondaryColor: "#FEF2F2", 
    wins: 2,
    losses: 4,
    pointsFor: 398,
    pointsAgainst: 456,
    description: "Rising team with young talent and determination."
  },
  {
    id: 6,
    name: "Golden Eagles",
    city: "Uptown",
    primaryColor: "#D97706",
    secondaryColor: "#FEF3C7",
    wins: 1, 
    losses: 5,
    pointsFor: 379,
    pointsAgainst: 483,
    description: "Rebuilding franchise with focus on development."
  }
]

const mockSeason = {
  id: 1,
  name: "Summer 2025 League",
  year: 2025,
  isActive: true,
  description: "The premier summer basketball league featuring competitive play and community spirit."
}

export default function TeamsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('winPercentage')
  const [filterBy, setFilterBy] = useState('all')
  
  const teams = mockTeams
  const activeSeason = mockSeason

  // Filter and sort teams
  const filteredTeams = teams
    .filter(team => {
      const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          team.city?.toLowerCase().includes(searchTerm.toLowerCase())
      
      if (filterBy === 'all') return matchesSearch
      if (filterBy === 'active') return matchesSearch && team.isActive
      if (filterBy === 'recruiting') return matchesSearch && team.isRecruiting
      if (filterBy === 'top') return matchesSearch && (team.wins / (team.wins + team.losses) || 0) >= 0.6
      
      return matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'wins':
          return b.wins - a.wins
        case 'winPercentage':
          const aWinPct = a.wins / (a.wins + a.losses) || 0
          const bWinPct = b.wins / (b.wins + b.losses) || 0
          return bWinPct - aWinPct
        case 'pointsDiff':
          return (b.pointsFor - b.pointsAgainst) - (a.pointsFor - a.pointsAgainst)
        default:
          return 0
      }
    })

  const teamStats = {
    total: teams.length,
    active: teams.filter(t => t.isActive).length,
    recruiting: teams.filter(t => t.isRecruiting).length,
    avgWinPct: teams.reduce((acc, t) => acc + (t.wins / (t.wins + t.losses) || 0), 0) / teams.length || 0
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {activeSeason?.name} Teams
            </h1>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 font-medium">
                🏀 Development Mode: Showing Mock Data
              </p>
              <p className="text-blue-600 text-sm mt-1">
                Backend API at localhost:8080 is not accessible. Using sample team data for demonstration.
              </p>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore all teams competing in the current season. View records, stats, and team information.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <UserGroupIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{teamStats.total}</div>
              <div className="text-sm text-gray-600">Total Teams</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <ChartBarIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{teamStats.total}</div>
              <div className="text-sm text-gray-600">Active Teams</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {teamStats.avgWinPct.toFixed(3)}
              </div>
              <div className="text-sm text-gray-600">Avg Win %</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">8</div>
              <div className="text-sm text-gray-600">Avg Roster Size</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search teams by name or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10 w-full"
              />
            </div>

            {/* Sort */}
            <div className="flex space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select"
              >
                <option value="winPercentage">Win Percentage</option>
                <option value="name">Team Name</option>
                <option value="wins">Most Wins</option>
                <option value="pointsDiff">Point Differential</option>
              </select>

              {/* Filter */}
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="form-select"
              >
                <option value="all">All Teams</option>
                <option value="active">Active Only</option>
                <option value="recruiting">Recruiting</option>
                <option value="top">Top Performers</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredTeams.length === 0 ? (
          <div className="text-center py-12">
            <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No teams found</h3>
            <p className="text-gray-600">
              {searchTerm 
                ? `No teams match "${searchTerm}"`
                : 'No teams available for this season'
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
                Showing {filteredTeams.length} of {teams.length} teams
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>

            {/* Teams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTeams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  showJoinButton={false}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}