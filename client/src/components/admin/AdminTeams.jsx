import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService, teamService } from '../../services/api'
import { useSeason } from '../../contexts/SeasonContext'
import LoadingSpinner from '../common/LoadingSpinner'
import { 
  UserGroupIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  TrophyIcon,
  UsersIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

export default function AdminTeams() {
  const { activeSeason } = useSeason()
  const queryClient = useQueryClient()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('view')

  // Fetch teams
  const { data: teams = [], isLoading } = useQuery({
    queryKey: ['admin', 'teams', activeSeason?.id],
    queryFn: () => adminService.getAll({ seasonId: activeSeason?.id }),
    enabled: !!activeSeason,
  })

  // Delete team mutation
  const deleteTeamMutation = useMutation({
    mutationFn: adminService.delete,
    onSuccess: () => {
      toast.success('Team deleted successfully')
      queryClient.invalidateQueries(['admin', 'teams'])
    },
    onError: () => {
      toast.error('Failed to delete team')
    }
  })

  // Update team mutation
  const updateTeamMutation = useMutation({
    mutationFn: ({ id, ...data }) => adminService.update(id, data),
    onSuccess: () => {
      toast.success('Team updated successfully')
      queryClient.invalidateQueries(['admin', 'teams'])
      setShowModal(false)
      setSelectedTeam(null)
    },
    onError: () => {
      toast.error('Failed to update team')
    }
  })

  // Create team mutation
  const createTeamMutation = useMutation({
    mutationFn: adminService.create,
    onSuccess: () => {
      toast.success('Team created successfully')
      queryClient.invalidateQueries(['admin', 'teams'])
      setShowModal(false)
      setSelectedTeam(null)
    },
    onError: () => {
      toast.error('Failed to create team')
    }
  })

  // Filter teams
  const filteredTeams = useMemo(() => {
    return teams.filter(team => {
      const matchesSearch = !searchTerm || 
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (team.description && team.description.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && team.isActive) ||
        (statusFilter === 'inactive' && !team.isActive) ||
        (statusFilter === 'playoff' && team.isPlayoffEligible)

      return matchesSearch && matchesStatus
    })
  }, [teams, searchTerm, statusFilter])

  const handleDeleteTeam = (team) => {
    if (window.confirm(`Are you sure you want to delete ${team.name}? This will remove all players from the team.`)) {
      deleteTeamMutation.mutate(team.id)
    }
  }

  const handleEditTeam = (team) => {
    setSelectedTeam(team)
    setModalMode('edit')
    setShowModal(true)
  }

  const handleViewTeam = (team) => {
    setSelectedTeam(team)
    setModalMode('view')
    setShowModal(true)
  }

  const handleCreateTeam = () => {
    setSelectedTeam(null)
    setModalMode('create')
    setShowModal(true)
  }

  const getWinPercentage = (team) => {
    const totalGames = team.wins + team.losses
    if (totalGames === 0) return 0
    return ((team.wins / totalGames) * 100).toFixed(1)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teams</h1>
          <p className="text-gray-600 mt-1">
            Manage teams for {activeSeason?.name || 'current season'}
          </p>
        </div>
        <button
          onClick={handleCreateTeam}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Create Team</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="card-body p-4">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-input"
            >
              <option value="all">All Teams</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="playoff">Playoff Eligible</option>
            </select>
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.length === 0 ? (
          <div className="col-span-full card">
            <div className="card-body text-center py-12">
              <UserGroupIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No teams found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No teams match your search criteria' : 'Create your first team to get started'}
              </p>
              <button
                onClick={handleCreateTeam}
                className="btn-primary"
              >
                Create Team
              </button>
            </div>
          </div>
        ) : (
          filteredTeams.map((team) => (
            <div key={team.id} className="card hover:shadow-md transition-shadow">
              <div className="card-body p-6">
                {/* Team Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {team.logoUrl ? (
                      <img
                        src={team.logoUrl}
                        alt={team.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                        <UserGroupIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{team.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          team.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {team.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {team.isPlayoffEligible && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <TrophyIcon className="h-3 w-3 mr-1" />
                            Playoff
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Team Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">{team.wins || 0}</div>
                    <div className="text-xs text-gray-500">Wins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">{team.losses || 0}</div>
                    <div className="text-xs text-gray-500">Losses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">{getWinPercentage(team)}%</div>
                    <div className="text-xs text-gray-500">Win %</div>
                  </div>
                </div>

                {/* Player Count */}
                <div className="flex items-center justify-center mb-4 py-2 bg-gray-50 rounded">
                  <UsersIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {team.playerCount || 0} Players
                  </span>
                </div>

                {/* Description */}
                {team.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {team.description}
                  </p>
                )}

                {/* Actions */}
                <div className="flex space-x-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleViewTeam(team)}
                    className="btn-outline flex-1 text-sm"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleEditTeam(team)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    title="Edit Team"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTeam(team)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Delete Team"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="card-body p-4">
            <div className="text-2xl font-bold text-gray-900">{teams.length}</div>
            <div className="text-sm text-gray-500">Total Teams</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body p-4">
            <div className="text-2xl font-bold text-green-600">
              {teams.filter(t => t.isActive).length}
            </div>
            <div className="text-sm text-gray-500">Active Teams</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {teams.filter(t => t.isPlayoffEligible).length}
            </div>
            <div className="text-sm text-gray-500">Playoff Eligible</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body p-4">
            <div className="text-2xl font-bold text-blue-600">
              {teams.reduce((sum, team) => sum + (team.playerCount || 0), 0)}
            </div>
            <div className="text-sm text-gray-500">Total Players</div>
          </div>
        </div>
      </div>

      {/* Team Modal */}
      {showModal && (
        <TeamModal
          team={selectedTeam}
          mode={modalMode}
          season={activeSeason}
          onClose={() => {
            setShowModal(false)
            setSelectedTeam(null)
          }}
          onSubmit={(data) => {
            if (modalMode === 'create') {
              createTeamMutation.mutate({ ...data, seasonId: activeSeason?.id })
            } else if (modalMode === 'edit') {
              updateTeamMutation.mutate({ id: selectedTeam.id, ...data })
            }
          }}
          isLoading={updateTeamMutation.isPending || createTeamMutation.isPending}
        />
      )}
    </div>
  )
}

// Team Modal Component
function TeamModal({ team, mode, season, onClose, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    name: team?.name || '',
    seasonId: team?.seasonId || season?.id || 1,
    wins: team?.wins || 0,
    losses: team?.losses || 0,
    pointsFor: team?.pointsFor || 0,
    pointsAgainst: team?.pointsAgainst || 0
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const isReadOnly = mode === 'view'

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg max-w-lg w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {mode === 'create' ? 'Create Team' : 
               mode === 'edit' ? 'Edit Team' : 'Team Details'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team Name
              </label>
              <input
                type="text"
                placeholder="Enter team name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                readOnly={isReadOnly}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Season
              </label>
              <select
                value={formData.seasonId}
                onChange={(e) => setFormData({ ...formData, seasonId: parseInt(e.target.value) })}
                disabled={isReadOnly || mode === 'edit'}
                className="form-input"
                required
              >
                <option value={1}>2025 Season</option>
              </select>
              {mode === 'edit' && (
                <p className="text-xs text-gray-500 mt-1">Season cannot be changed for existing teams</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wins
                </label>
                <input
                  type="number"
                  value={formData.wins}
                  onChange={(e) => setFormData({ ...formData, wins: parseInt(e.target.value) || 0 })}
                  readOnly={isReadOnly}
                  className="form-input"
                  min={0}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Losses
                </label>
                <input
                  type="number"
                  value={formData.losses}
                  onChange={(e) => setFormData({ ...formData, losses: parseInt(e.target.value) || 0 })}
                  readOnly={isReadOnly}
                  className="form-input"
                  min={0}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points For
                </label>
                <input
                  type="number"
                  value={formData.pointsFor}
                  onChange={(e) => setFormData({ ...formData, pointsFor: parseInt(e.target.value) || 0 })}
                  readOnly={isReadOnly}
                  className="form-input"
                  min={0}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points Against
                </label>
                <input
                  type="number"
                  value={formData.pointsAgainst}
                  onChange={(e) => setFormData({ ...formData, pointsAgainst: parseInt(e.target.value) || 0 })}
                  readOnly={isReadOnly}
                  className="form-input"
                  min={0}
                />
              </div>
            </div>

            {!isReadOnly && (
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="form-checkbox"
                  />
                  <span className="ml-2 text-sm text-gray-900">Active</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isPlayoffEligible}
                    onChange={(e) => setFormData({ ...formData, isPlayoffEligible: e.target.checked })}
                    className="form-checkbox"
                  />
                  <span className="ml-2 text-sm text-gray-900">Playoff Eligible</span>
                </label>
              </div>
            )}

            {mode === 'view' && team && (
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-gray-900">{team.wins || 0}</div>
                    <div className="text-xs text-gray-500">Wins</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{team.losses || 0}</div>
                    <div className="text-xs text-gray-500">Losses</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{team.playerCount || 0}</div>
                    <div className="text-xs text-gray-500">Players</div>
                  </div>
                </div>
                <div className="text-center">
                  <Link
                    to={`/teams/${team.id}`}
                    className="btn-outline"
                  >
                    View Public Page
                  </Link>
                </div>
              </div>
            )}

            {!isReadOnly && (
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="btn-outline">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="btn-primary"
                >
                  {isLoading ? <LoadingSpinner size="sm" color="white" /> : 
                   mode === 'create' ? 'Create Team' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}