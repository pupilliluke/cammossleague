import { format, parseISO } from 'date-fns'
import { CalendarIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline'

export default function GameCard({ game, showResult = false }) {
  const gameDateTime = parseISO(`${game.gameDate}T${game.gameTime}`)
  const isCompleted = game.isCompleted && game.gameResult
  const isPast = new Date() > gameDateTime && !isCompleted

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="card-body p-4">
        {/* Game Status Badge */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            {isCompleted ? (
              <span className="badge-completed">Final</span>
            ) : isPast ? (
              <span className="badge-cancelled">Missing Result</span>
            ) : (
              <span className="badge-upcoming">
                {format(gameDateTime, 'h:mm a')}
              </span>
            )}
            {game.gameType !== 'REGULAR' && (
              <span className="badge bg-purple-100 text-purple-800">
                {game.gameType === 'PLAYOFF' ? 'Playoff' : 'Championship'}
              </span>
            )}
          </div>
          {game.weekNumber && (
            <span className="text-xs text-gray-500">Week {game.weekNumber}</span>
          )}
        </div>

        {/* Teams */}
        <div className="space-y-3">
          {/* Away Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {game.awayTeam.logoUrl ? (
                <img
                  src={game.awayTeam.logoUrl}
                  alt={game.awayTeam.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div
                  className="team-colors"
                  style={{ backgroundColor: game.awayTeam.primaryColor || '#6B7280' }}
                />
              )}
              <div>
                <div className="font-medium text-gray-900">{game.awayTeam.name}</div>
              </div>
            </div>
            {showResult && isCompleted && (
              <div className={`text-lg font-bold ${
                game.gameResult.winningTeam?.id === game.awayTeam.id 
                  ? 'text-green-600' 
                  : 'text-gray-600'
              }`}>
                {game.gameResult.awayTeamScore}
              </div>
            )}
          </div>

          {/* VS or @ */}
          <div className="text-center">
            <span className="text-xs text-gray-400 font-medium">
              {isCompleted ? 'vs' : '@'}
            </span>
          </div>

          {/* Home Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {game.homeTeam.logoUrl ? (
                <img
                  src={game.homeTeam.logoUrl}
                  alt={game.homeTeam.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div
                  className="team-colors"
                  style={{ backgroundColor: game.homeTeam.primaryColor || '#6B7280' }}
                />
              )}
              <div>
                <div className="font-medium text-gray-900">{game.homeTeam.name}</div>
              </div>
            </div>
            {showResult && isCompleted && (
              <div className={`text-lg font-bold ${
                game.gameResult.winningTeam?.id === game.homeTeam.id 
                  ? 'text-green-600' 
                  : 'text-gray-600'
              }`}>
                {game.gameResult.homeTeamScore}
              </div>
            )}
          </div>
        </div>

        {/* Game Details */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <CalendarIcon className="h-3 w-3" />
                <span>{format(gameDateTime, 'MMM d, yyyy')}</span>
              </div>
              {!isCompleted && (
                <div className="flex items-center space-x-1">
                  <ClockIcon className="h-3 w-3" />
                  <span>{format(gameDateTime, 'h:mm a')}</span>
                </div>
              )}
              {game.location && (
                <div className="flex items-center space-x-1">
                  <MapPinIcon className="h-3 w-3" />
                  <span>
                    {game.location}
                    {game.courtNumber && ` - ${game.courtNumber}`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Game Result Details */}
          {showResult && isCompleted && (
            <div className="mt-2 text-xs text-gray-600">
              {game.gameResult.overtime && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mr-2">
                  OT
                </span>
              )}
              {game.gameResult.forfeit && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mr-2">
                  Forfeit
                </span>
              )}
              {game.gameResult.notes && (
                <span className="text-gray-500">{game.gameResult.notes}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}