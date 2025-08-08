import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useSeason } from '../contexts/SeasonContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { playerService } from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { 
  UserCircleIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  TrophyIcon,
  UserGroupIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { appUser, updateProfile } = useAuth()
  const { activeSeason } = useSeason()
  const queryClient = useQueryClient()
  
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    firstName: appUser?.firstName || '',
    lastName: appUser?.lastName || '',
    phone: appUser?.phone || '',
    emergencyContactName: appUser?.emergencyContactName || '',
    emergencyContactPhone: appUser?.emergencyContactPhone || '',
    isFreeAgent: appUser?.isFreeAgent || false
  })

  // Fetch player data for current season
  const { data: playerData, isLoading: playerLoading } = useQuery({
    queryKey: ['player', 'current-user', activeSeason?.id],
    queryFn: () => playerService.getAllPlayers({ 
      userId: appUser.id, 
      seasonId: activeSeason.id 
    }).then(res => res[0]), // Get first result
    enabled: !!appUser && !!activeSeason,
  })

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success('Profile updated successfully!')
      setIsEditing(false)
      queryClient.invalidateQueries(['player', 'current-user'])
    },
    onError: (error) => {
      toast.error('Failed to update profile')
      console.error('Update error:', error)
    }
  })

  // Toggle free agent status mutation
  const toggleFreeAgentMutation = useMutation({
    mutationFn: (isFreeAgent) => updateProfile({ isFreeAgent }),
    onSuccess: (response) => {
      toast.success(response.user.isFreeAgent ? 'Marked as free agent' : 'Removed from free agents')
      queryClient.invalidateQueries(['player', 'current-user'])
    },
    onError: () => {
      toast.error('Failed to update free agent status')
    }
  })

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(editForm)
  }

  const handleCancelEdit = () => {
    setEditForm({
      firstName: appUser?.firstName || '',
      lastName: appUser?.lastName || '',
      phone: appUser?.phone || '',
      emergencyContactName: appUser?.emergencyContactName || '',
      emergencyContactPhone: appUser?.emergencyContactPhone || '',
      isFreeAgent: appUser?.isFreeAgent || false
    })
    setIsEditing(false)
  }

  const toggleFreeAgent = () => {
    toggleFreeAgentMutation.mutate(!appUser.isFreeAgent)
  }

  if (!appUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Not signed in</h2>
          <p className="text-gray-600">Please sign in to view your profile</p>
        </div>
      </div>
    )
  }

  const currentTeam = playerData?.playerTeams?.find(pt => pt.status === 'ACTIVE')?.team

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="card mb-8">
          <div className="card-body p-8">
            <div className="flex items-center space-x-6">
              {/* Profile Picture */}
              <div className="relative">
                {appUser.profileImageUrl ? (
                  <img
                    src={appUser.profileImageUrl}
                    alt={`${appUser.firstName} ${appUser.lastName}`}
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                    <UserCircleIcon className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                <button className="absolute -bottom-1 -right-1 p-2 bg-white rounded-full border-2 border-gray-200 hover:bg-gray-50">
                  <PencilIcon className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={editForm.firstName}
                        onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                        placeholder="First Name"
                        className="form-input"
                      />
                      <input
                        type="text"
                        value={editForm.lastName}
                        onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                        placeholder="Last Name"
                        className="form-input"
                      />
                    </div>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      placeholder="Phone Number"
                      className="form-input"
                    />
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSaveProfile}
                        disabled={updateProfileMutation.isPending}
                        className="btn-primary flex items-center space-x-2"
                      >
                        {updateProfileMutation.isPending ? (
                          <LoadingSpinner size="sm" color="white" />
                        ) : (
                          <CheckIcon className="h-4 w-4" />
                        )}
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="btn-outline flex items-center space-x-2"
                      >
                        <XMarkIcon className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {appUser.firstName} {appUser.lastName}
                    </h1>
                    <p className="text-gray-600 mt-1">{appUser.email}</p>
                    <div className="flex items-center space-x-4 mt-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        appUser.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                        appUser.role === 'COACH' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {appUser.role}
                      </span>
                      {appUser.isFreeAgent && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                          Free Agent
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-4 btn-outline flex items-center space-x-2"
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Season Status */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900">
                  {activeSeason?.name} Status
                </h2>
              </div>
              <div className="card-body">
                {playerLoading ? (
                  <LoadingSpinner size="sm" />
                ) : playerData ? (
                  <div>
                    {currentTeam ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{currentTeam.name}</h3>
                          <p className="text-sm text-gray-600">
                            Position: {playerData.position} 
                            {playerData.jerseyNumber && ` • #${playerData.jerseyNumber}`}
                          </p>
                        </div>
                        <button className="btn-outline">View Team</button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Not on a team</h3>
                        <p className="text-gray-600 mb-4">
                          {appUser.isFreeAgent 
                            ? "You're listed as a free agent. Teams can find and recruit you."
                            : "Mark yourself as a free agent to be discovered by teams."
                          }
                        </p>
                        <button
                          onClick={toggleFreeAgent}
                          disabled={toggleFreeAgentMutation.isPending}
                          className={`btn-primary ${appUser.isFreeAgent ? 'btn-outline' : ''}`}
                        >
                          {toggleFreeAgentMutation.isPending ? (
                            <LoadingSpinner size="sm" color="white" />
                          ) : appUser.isFreeAgent ? (
                            'Remove from Free Agents'
                          ) : (
                            'Become Free Agent'
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No player data for current season</p>
                  </div>
                )}
              </div>
            </div>

            {/* Season Stats */}
            {playerData && playerData.statsGamesPlayed > 0 && (
              <div className="card">
                <div className="card-header">
                  <h2 className="text-lg font-semibold text-gray-900">Season Statistics</h2>
                </div>
                <div className="card-body">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">{playerData.statsGamesPlayed}</div>
                      <div className="text-sm text-gray-600">Games Played</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600">
                        {(playerData.statsPoints / playerData.statsGamesPlayed).toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600">Points Per Game</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600">
                        {(playerData.statsRebounds / playerData.statsGamesPlayed).toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600">Rebounds Per Game</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600">
                        {(playerData.statsAssists / playerData.statsGamesPlayed).toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600">Assists Per Game</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Emergency Contact */}
          <div>
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900">Emergency Contact</h2>
              </div>
              <div className="card-body">
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editForm.emergencyContactName}
                      onChange={(e) => setEditForm({ ...editForm, emergencyContactName: e.target.value })}
                      placeholder="Contact Name"
                      className="form-input"
                    />
                    <input
                      type="tel"
                      value={editForm.emergencyContactPhone}
                      onChange={(e) => setEditForm({ ...editForm, emergencyContactPhone: e.target.value })}
                      placeholder="Contact Phone"
                      className="form-input"
                    />
                  </div>
                ) : appUser.emergencyContactName || appUser.emergencyContactPhone ? (
                  <div className="space-y-2">
                    {appUser.emergencyContactName && (
                      <div>
                        <div className="text-sm text-gray-500">Name</div>
                        <div className="font-medium text-gray-900">{appUser.emergencyContactName}</div>
                      </div>
                    )}
                    {appUser.emergencyContactPhone && (
                      <div>
                        <div className="text-sm text-gray-500">Phone</div>
                        <div className="font-medium text-gray-900">{appUser.emergencyContactPhone}</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">No emergency contact information</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}