import { Link } from 'react-router-dom'
import { 
  UserCircleIcon,
  TrophyIcon,
  ChartBarIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'

export default function PlayerCard({ player, showContact = false, showStats = true }) {
  const user = player.user || player
  const position = player.position || 'UTIL'
  const team = player.playerTeams?.find(pt => pt.status === 'ACTIVE')?.team

  // Position display names
  const positionNames = {
    PG: 'Point Guard',
    SG: 'Shooting Guard',
    SF: 'Small Forward',
    PF: 'Power Forward',
    C: 'Center',
    UTIL: 'Utility'
  }

  // Position colors
  const positionColors = {
    PG: 'bg-blue-100 text-blue-800',
    SG: 'bg-green-100 text-green-800',
    SF: 'bg-yellow-100 text-yellow-800',
    PF: 'bg-red-100 text-red-800',
    C: 'bg-purple-100 text-purple-800',
    UTIL: 'bg-gray-100 text-gray-800'
  }

  const formatHeight = (heightInches) => {
    if (!heightInches) return null
    const feet = Math.floor(heightInches / 12)
    const inches = heightInches % 12
    return `${feet}'${inches}"`
  }

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="card-body p-6">
        {/* Player Header */}
        <div className="flex items-center space-x-4 mb-4">
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
              <UserCircleIcon className="h-10 w-10 text-gray-400" />
            </div>
          )}
          
          <div className="flex-1">
            <Link to={`/players/${player.id}`}>
              <h3 className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors cursor-pointer">
                {user.firstName} {user.lastName}
              </h3>
            </Link>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${positionColors[position]}`}>
                {position} - {positionNames[position]}
              </span>
              {player.jerseyNumber && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  #{player.jerseyNumber}
                </span>
              )}
            </div>
            
            {/* Team Affiliation */}
            {team && (
              <div className="mt-2">
                <Link
                  to={`/teams/${team.id}`}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {team.name}
                </Link>
              </div>
            )}
            
            {user.isFreeAgent && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Free Agent
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Player Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {player.heightInches && (
            <div>
              <div className="text-sm text-gray-500">Height</div>
              <div className="font-medium text-gray-900">{formatHeight(player.heightInches)}</div>
            </div>
          )}
          {player.weightLbs && (
            <div>
              <div className="text-sm text-gray-500">Weight</div>
              <div className="font-medium text-gray-900">{player.weightLbs} lbs</div>
            </div>
          )}
          {player.yearsExperience !== undefined && (
            <div>
              <div className="text-sm text-gray-500">Experience</div>
              <div className="font-medium text-gray-900">
                {player.yearsExperience === 0 ? 'Rookie' : 
                 player.yearsExperience === 1 ? '1 year' : 
                 `${player.yearsExperience} years`}
              </div>
            </div>
          )}
          {player.season && (
            <div>
              <div className="text-sm text-gray-500">Season</div>
              <div className="font-medium text-gray-900">{player.season.name}</div>
            </div>
          )}
        </div>

        {/* Player Stats */}
        {showStats && (player.statsGamesPlayed > 0) && (
          <div className="border-t border-gray-200 pt-4 mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Season Stats</h4>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div>
                <div className="text-lg font-bold text-gray-900">{player.statsGamesPlayed}</div>
                <div className="text-xs text-gray-500">GP</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">
                  {(player.statsPoints / player.statsGamesPlayed).toFixed(1)}
                </div>
                <div className="text-xs text-gray-500">PPG</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">
                  {(player.statsRebounds / player.statsGamesPlayed).toFixed(1)}
                </div>
                <div className="text-xs text-gray-500">RPG</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">
                  {(player.statsAssists / player.statsGamesPlayed).toFixed(1)}
                </div>
                <div className="text-xs text-gray-500">APG</div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Information */}
        {showContact && (
          <div className="border-t border-gray-200 pt-4 mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Contact</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <EnvelopeIcon className="h-4 w-4" />
                <a href={`mailto:${user.email}`} className="hover:text-primary-600">
                  {user.email}
                </a>
              </div>
              {user.phone && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <PhoneIcon className="h-4 w-4" />
                  <a href={`tel:${user.phone}`} className="hover:text-primary-600">
                    {user.phone}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-4 border-t border-gray-200">
          <Link
            to={`/players/${player.id}`}
            className="btn-outline flex-1 text-center"
          >
            <div className="flex items-center justify-center space-x-2">
              <ChartBarIcon className="h-4 w-4" />
              <span>View Profile</span>
            </div>
          </Link>
          
          {showStats && player.statsGamesPlayed > 0 && (
            <Link
              to={`/players/${player.id}/stats`}
              className="btn-ghost flex items-center justify-center"
            >
              <TrophyIcon className="h-4 w-4" />
            </Link>
          )}
        </div>

        {/* Player Status */}
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            {player.isActive === false ? (
              <span className="badge bg-gray-100 text-gray-600">Inactive</span>
            ) : user.isFreeAgent ? (
              <span className="badge bg-green-100 text-green-800">Available</span>
            ) : team ? (
              <span className="badge bg-blue-100 text-blue-800">On Team</span>
            ) : (
              <span className="badge bg-gray-100 text-gray-600">Unassigned</span>
            )}
          </div>
          
          {player.statsGamesPlayed > 0 && (
            <div className="text-xs text-gray-500">
              {player.statsPoints} total points this season
            </div>
          )}
        </div>
      </div>
    </div>
  )
}