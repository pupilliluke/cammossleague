import { useState, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useSeason } from '../contexts/SeasonContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { playerService, authService } from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { 
  UserCircleIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  TrophyIcon,
  UserGroupIcon,
  CalendarIcon,
  PhotoIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { appUser, updateProfile, changePassword } = useAuth()
  const { activeSeason } = useSeason()
  const queryClient = useQueryClient()
  const fileInputRef = useRef(null)
  
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [editForm, setEditForm] = useState({
    username: appUser?.username || '',
    firstName: appUser?.firstName || '',
    lastName: appUser?.lastName || '',
    email: appUser?.email || '',
    phone: appUser?.phone || '',
    emergencyContactName: appUser?.emergencyContactName || '',
    emergencyContactPhone: appUser?.emergencyContactPhone || '',
    profileImageUrl: appUser?.profileImageUrl || '',
    isFreeAgent: appUser?.isFreeAgent || false,
    yearsPlayed: appUser?.yearsPlayed || 0,
    bio: appUser?.bio || '',
    teamHistory: appUser?.teamHistory || ''
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Fetch player data for current season
  const { data: playerData, isLoading: playerLoading } = useQuery({
    queryKey: ['player', 'current-user', activeSeason?.id],
    queryFn: () => {
      if (!appUser?.id || !activeSeason?.id) {
        return Promise.resolve(null)
      }
      return playerService.getAllPlayers({ 
        userId: appUser.id, 
        seasonId: activeSeason.id 
      }).then(res => res?.[0] || null)
    },
    enabled: !!appUser && !!activeSeason,
  })

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedUser) => {
      toast.success('Profile updated successfully!')
      setIsEditing(false)
      
      // Update edit form with the response data
      if (updatedUser) {
        setEditForm({
          username: updatedUser.username || '',
          firstName: updatedUser.firstName || '',
          lastName: updatedUser.lastName || '',
          email: updatedUser.email || '',
          phone: updatedUser.phone || '',
          emergencyContactName: updatedUser.emergencyContactName || '',
          emergencyContactPhone: updatedUser.emergencyContactPhone || '',
          profileImageUrl: updatedUser.profileImageUrl || '',
          isFreeAgent: updatedUser.isFreeAgent || false,
          yearsPlayed: updatedUser.yearsPlayed || 0,
          bio: updatedUser.bio || '',
          teamHistory: updatedUser.teamHistory || ''
        })
      }
      
      // Only invalidate queries if we have valid data
      if (appUser?.id && activeSeason?.id) {
        queryClient.invalidateQueries(['player', 'current-user'])
      }
    },
    onError: (error) => {
      console.error('Update error:', error)
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data
        if (typeof errorMessage === 'string' && errorMessage.includes('already exists')) {
          toast.error('Username or email already exists. Please choose different values.')
        } else if (typeof errorMessage === 'string' && errorMessage.includes('unique result')) {
          toast.error('Database conflict detected. Please create a new account with a unique username to continue.')
        } else {
          toast.error('Invalid data provided. Please check your inputs.')
        }
      } else if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.')
      } else if (error.response?.status === 500) {
        toast.error('Server error. Please try again later.')
      } else {
        toast.error('Failed to update profile. Please try again.')
      }
    }
  })

  // Toggle free agent status mutation
  const toggleFreeAgentMutation = useMutation({
    mutationFn: (isFreeAgent) => updateProfile({ isFreeAgent }),
    onSuccess: (response) => {
      toast.success(response.isFreeAgent ? 'Marked as free agent' : 'Removed from free agents')
      queryClient.invalidateQueries(['player', 'current-user'])
    },
    onError: () => {
      toast.error('Failed to update free agent status')
    }
  })

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully!')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setShowPasswordForm(false)
    },
    onError: (error) => {
      toast.error(error.response?.data || 'Failed to change password')
    }
  })

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(editForm)
  }

  const handleCancelEdit = () => {
    setEditForm({
      username: appUser?.username || '',
      firstName: appUser?.firstName || '',
      lastName: appUser?.lastName || '',
      email: appUser?.email || '',
      phone: appUser?.phone || '',
      emergencyContactName: appUser?.emergencyContactName || '',
      emergencyContactPhone: appUser?.emergencyContactPhone || '',
      profileImageUrl: appUser?.profileImageUrl || '',
      isFreeAgent: appUser?.isFreeAgent || false,
      yearsPlayed: appUser?.yearsPlayed || 0,
      bio: appUser?.bio || '',
      teamHistory: appUser?.teamHistory || ''
    })
    setIsEditing(false)
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
      try {
        const result = await authService.uploadProfilePicture(file)
        setEditForm(prev => ({ ...prev, profileImageUrl: result.url }))
        toast.success('Profile picture updated!')
      } catch (error) {
        toast.error('Failed to upload profile picture')
      }
    }
  }

  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }
    changePasswordMutation.mutate(passwordForm)
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
                {(editForm.profileImageUrl || appUser?.profileImageUrl) ? (
                  <img
                    src={editForm.profileImageUrl || appUser?.profileImageUrl}
                    alt={`${appUser?.firstName} ${appUser?.lastName}`}
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                    <UserCircleIcon className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 p-2 bg-white rounded-full border-2 border-gray-200 hover:bg-gray-50"
                >
                  <PhotoIcon className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    {/* Basic Information */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
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
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={editForm.username}
                          onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                          placeholder="Username"
                          className="form-input"
                        />
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          placeholder="Email"
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
                    </div>

                    {/* Basketball Information */}
                    <div className="space-y-3 border-t pt-4">
                      <h3 className="text-lg font-medium text-gray-900">Basketball Information</h3>
                      <input
                        type="number"
                        value={editForm.yearsPlayed}
                        onChange={(e) => setEditForm({ ...editForm, yearsPlayed: parseInt(e.target.value) || 0 })}
                        placeholder="Years Played"
                        min="0"
                        className="form-input"
                      />
                      <textarea
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        placeholder="Tell us about yourself..."
                        rows="3"
                        className="form-input"
                      />
                      <textarea
                        value={editForm.teamHistory}
                        onChange={(e) => setEditForm({ ...editForm, teamHistory: e.target.value })}
                        placeholder="Previous teams you've played for..."
                        rows="3"
                        className="form-input"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3 pt-4">
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
                        <span>Save Profile</span>
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
                    <p className="text-gray-600 mt-1">@{appUser.username} • {appUser.email}</p>
                    {appUser.yearsPlayed && (
                      <p className="text-gray-600 mt-1">{appUser.yearsPlayed} years playing basketball</p>
                    )}
                    {appUser.bio && (
                      <p className="text-gray-700 mt-2 italic">"{appUser.bio}"</p>
                    )}
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
                    <div className="flex space-x-3 mt-4">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="btn-outline flex items-center space-x-2"
                      >
                        <PencilIcon className="h-4 w-4" />
                        <span>Edit Profile</span>
                      </button>
                      <button
                        onClick={() => setShowPasswordForm(true)}
                        className="btn-outline flex items-center space-x-2"
                      >
                        <KeyIcon className="h-4 w-4" />
                        <span>Change Password</span>
                      </button>
                    </div>
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

          {/* Right Column */}
          <div className="space-y-6">
            {/* Emergency Contact */}
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

            {/* Team History */}
            {appUser.teamHistory && (
              <div className="card">
                <div className="card-header">
                  <h2 className="text-lg font-semibold text-gray-900">Team History</h2>
                </div>
                <div className="card-body">
                  <p className="text-gray-700 whitespace-pre-wrap">{appUser.teamHistory}</p>
                </div>
              </div>
            )}

            {/* Profile Settings */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900">Profile Settings</h2>
              </div>
              <div className="card-body space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Free Agent Status</div>
                    <div className="text-sm text-gray-600">Available for team recruitment</div>
                  </div>
                  <button
                    onClick={toggleFreeAgent}
                    disabled={toggleFreeAgentMutation.isPending}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      appUser.isFreeAgent 
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {toggleFreeAgentMutation.isPending ? (
                      <LoadingSpinner size="xs" />
                    ) : appUser.isFreeAgent ? (
                      'Free Agent'
                    ) : (
                      'Not Available'
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Account Type</div>
                    <div className="text-sm text-gray-600">Your role in the league</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    appUser.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                    appUser.role === 'COACH' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {appUser.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="Current Password"
                  className="form-input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showCurrentPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="New Password"
                  className="form-input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showNewPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Confirm New Password"
                  className="form-input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleChangePassword}
                disabled={changePasswordMutation.isPending}
                className="btn-primary flex items-center space-x-2"
              >
                {changePasswordMutation.isPending ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : (
                  <CheckIcon className="h-4 w-4" />
                )}
                <span>Change Password</span>
              </button>
              <button
                onClick={() => {
                  setShowPasswordForm(false)
                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
                }}
                className="btn-outline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}