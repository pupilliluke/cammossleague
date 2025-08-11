import { Link } from 'react-router-dom'
import { 
  UserGroupIcon, 
  TrophyIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/outline'
import { useAuth } from '../../contexts/AuthContext'

export default function TeamCard({ team, showJoinButton = false }) {
  const { isAuthenticated, appUser } = useAuth()
  const winPercentage = team.wins / (team.wins + team.losses) || 0
  const pointsDiff = team.pointsFor - team.pointsAgainst

  const handleJoinTeam = () => {
    // TODO: Implement join team functionality
    console.log('Join team:', team.id)
  }

  return (
    <div className="card hover:shadow-lg transition-all duration-200 group">
      <div className="card-body p-6">
        {/* Team Header */}
        <div className="flex items-center space-x-4 mb-4">
          {team.logoUrl ? (
            <img
              src={team.logoUrl}
              alt={`${team.name} logo`}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div
              className="w-16 h-16 rounded-full border-2 border-gray-200 flex items-center justify-center"
              style={{ 
                backgroundColor: team.primaryColor || '#6B7280',
                color: team.secondaryColor || '#FFFFFF' 
              }}
            >
              <span className="text-xl font-bold">
                {team.name.charAt(0)}
              </span>
            </div>
          )}
          
          <div className="flex-1">
            <Link to={`/teams/${team.id}`}>
              <h3 className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors cursor-pointer">
                {team.name}
              </h3>
            </Link>
            
            {/* Team Colors */}
            {(team.primaryColor || team.secondaryColor) && (
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-xs text-gray-500">Colors:</span>
                {team.primaryColor && (
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: team.primaryColor }}
                    title="Primary Color"
                  />
                )}
                {team.secondaryColor && (
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: team.secondaryColor }}
                    title="Secondary Color"
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {team.wins}-{team.losses}
            </div>
            <div className="text-xs text-gray-500">Record</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {winPercentage.toFixed(3)}
            </div>
            <div className="text-xs text-gray-500">Win %</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              pointsDiff > 0 ? 'text-green-600' : 
              pointsDiff < 0 ? 'text-red-600' : 'text-gray-900'
            }`}>
              {pointsDiff > 0 ? '+' : ''}{pointsDiff}
            </div>
            <div className="text-xs text-gray-500">Point Diff</div>
          </div>
        </div>

        {/* Team Leadership */}
        <div className="space-y-2 mb-4">
          {team.captain && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Captain:</span>
              <span className="font-medium text-gray-900">
                {team.captain.firstName} {team.captain.lastName}
              </span>
            </div>
          )}
          {team.coach && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Coach:</span>
              <span className="font-medium text-gray-900">
                {team.coach.firstName} {team.coach.lastName}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Roster:</span>
            <div className="flex items-center space-x-1">
              <UserGroupIcon className="h-4 w-4 text-gray-400" />
              <span className="font-medium text-gray-900">
                {team.playerTeams?.filter(pt => pt.status === 'ACTIVE').length || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-4 border-t border-gray-200">
          <Link
            to={`/teams/${team.id}`}
            className="btn-outline flex-1 text-center"
          >
            <div className="flex items-center justify-center space-x-2">
              <ChartBarIcon className="h-4 w-4" />
              <span>View Team</span>
            </div>
          </Link>
          
          {showJoinButton && isAuthenticated && appUser?.isFreeAgent && (
            <button
              onClick={handleJoinTeam}
              className="btn-primary flex-1"
            >
              <div className="flex items-center justify-center space-x-2">
                <UserGroupIcon className="h-4 w-4" />
                <span>Request to Join</span>
              </div>
            </button>
          )}
        </div>

        {/* Team Status Indicators */}
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            {team.wins + team.losses === 0 ? (
              <span className="badge bg-gray-100 text-gray-600">No Games</span>
            ) : winPercentage >= 0.7 ? (
              <span className="badge bg-green-100 text-green-800">Strong</span>
            ) : winPercentage >= 0.5 ? (
              <span className="badge bg-yellow-100 text-yellow-800">Average</span>
            ) : (
              <span className="badge bg-red-100 text-red-800">Struggling</span>
            )}
            
            {team.isActive === false && (
              <span className="badge bg-gray-100 text-gray-600">Inactive</span>
            )}
          </div>
          
          {(team.wins + team.losses > 0) && (
            <div className="text-xs text-gray-500">
              {team.pointsFor} PF, {team.pointsAgainst} PA
            </div>
          )}
        </div>
      </div>
    </div>
  )
}