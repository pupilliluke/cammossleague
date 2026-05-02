import React, { useState, useEffect } from 'react'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'
import { useSeason } from '../contexts/SeasonContext'
import { teamService } from '../services/api'
import { authService } from '../services/auth'

export default function TeamRegistrationPage() {
  const { appUser, user, isAuthenticated } = useAuth()
  const { activeSeason } = useSeason()
  const [teamName, setTeamName] = useState('')
  const [players, setPlayers] = useState([''])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [currentUser, setCurrentUser] = useState(null)

  // Get current user data and debug
  useEffect(() => {
    console.log('=== AUTHENTICATION DEBUG ===')
    console.log('isAuthenticated:', isAuthenticated)
    console.log('appUser:', appUser)
    console.log('appUser keys:', appUser ? Object.keys(appUser) : 'No appUser')
    console.log('appUser.userId:', appUser?.userId)
    console.log('appUser.id:', appUser?.id)
    
    if (isAuthenticated && appUser) {
      setCurrentUser(appUser)
    }
  }, [isAuthenticated, appUser])

  const addPlayer = () => {
    setPlayers([...players, ''])
  }

  const removePlayer = (index) => {
    if (players.length > 1) {
      const newPlayers = players.filter((_, i) => i !== index)
      setPlayers(newPlayers)
    }
  }

  const updatePlayer = (index, value) => {
    const newPlayers = [...players]
    newPlayers[index] = value
    setPlayers(newPlayers)
    
    // Clear errors when user starts typing
    if (errors.players) {
      setErrors(prev => ({ ...prev, players: null }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Validate team name
    if (!teamName.trim()) {
      newErrors.teamName = 'Team name is required'
    }

    // Filter out empty player names
    const validPlayers = players.filter(player => player.trim() !== '')
    
    // Validate at least one player
    if (validPlayers.length === 0) {
      newErrors.players = 'At least one player is required'
    }

    // Validate unique player names (case-insensitive)
    const playerNames = validPlayers.map(name => name.trim().toLowerCase())
    const duplicates = playerNames.filter((name, index) => playerNames.indexOf(name) !== index)
    
    if (duplicates.length > 0) {
      newErrors.players = 'Player names must be unique'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    if (!validateForm()) {
      return
    }

    // Check if user is authenticated and get user ID
    // Try multiple possible field names for robustness
    const userId = appUser?.userId || appUser?.id || currentUser?.userId || currentUser?.id
    
    console.log('=== USER ID DEBUG ===')
    console.log('appUser:', appUser)
    console.log('currentUser:', currentUser)
    console.log('Extracted userId:', userId)
    console.log('isAuthenticated:', isAuthenticated)
    
    if (!isAuthenticated) {
      alert('You must be logged in to register a team. Please sign in first.')
      return
    }
    
    if (!userId) {
      alert('Unable to get your user ID. Please try logging out and back in.')
      return
    }

    // Check if active season exists, default to season 1 for now
    const currentSeasonId = activeSeason?.id || 1
    
    if (!currentSeasonId) {
      alert('No active season found. Please contact admin.')
      return
    }

    setIsSubmitting(true)

    try {
      // Filter out empty player names
      const validPlayers = players.filter(player => player.trim() !== '')
      
      const teamData = {
        name: teamName.trim(),
        season_id: currentSeasonId,
        captain_id: userId,
        players: validPlayers.map(name => name.trim())
      }

      console.log('Submitting team registration:', teamData)
      
      // Make API call to create team
      const response = await teamService.create(teamData)
      
      console.log('Team registration successful:', response)
      alert('Team registration submitted successfully!')
      
      // Reset form
      setTeamName('')
      setPlayers([''])
      setErrors({})
      
    } catch (error) {
      console.error('Team registration error:', error)
      
      if (error.response?.data?.message) {
        alert(`Failed to register team: ${error.response.data.message}`)
      } else {
        alert('Failed to register team. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white">Register Your Team</h1>
              <p className="mt-2 text-purple-100">
                Join the Cam Moss League
              </p>
              {/* Debug info */}
              <div className="mt-4 text-xs text-purple-200">
                Logged in as: {appUser?.firstName || 'Not logged in'} (ID: {appUser?.userId || appUser?.id || 'None'})
                <br />
                Authenticated: {isAuthenticated ? 'Yes' : 'No'}
                <br />
                appUser keys: {appUser ? Object.keys(appUser).join(', ') : 'No appUser'}
                <br />
                Raw appUser: {JSON.stringify(appUser)}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
            {/* Team Name Section */}
            <div>
              <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-2">
                Team Name
              </label>
              <input
                type="text"
                id="teamName"
                value={teamName}
                onChange={(e) => {
                  setTeamName(e.target.value)
                  if (errors.teamName) {
                    setErrors(prev => ({ ...prev, teamName: null }))
                  }
                }}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 ${
                  errors.teamName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your team name"
                required
              />
              {errors.teamName && (
                <p className="mt-1 text-sm text-red-600">{errors.teamName}</p>
              )}
            </div>

            {/* Players Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Players
                </label>
                <button
                  type="button"
                  onClick={addPlayer}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Player
                </button>
              </div>

              <div className="space-y-3">
                {players.map((player, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={player}
                        onChange={(e) => updatePlayer(index, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                        placeholder={`Player ${index + 1} name`}
                      />
                    </div>
                    {players.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePlayer(index)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {errors.players && (
                <p className="mt-2 text-sm text-red-600">{errors.players}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Add all players who will be on your team. You can add more players later.
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {isSubmitting ? 'Registering Team...' : 'Register Team'}
              </button>
            </div>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Need help? Contact us for assistance with team registration.
          </p>
        </div>
      </div>
    </div>
  )
}