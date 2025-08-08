import { useState } from 'react'
import { TrophyIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { format, parseISO } from 'date-fns'

export default function PlayoffBracket({ bracket = null, teams = [] }) {
  const [selectedRound, setSelectedRound] = useState(1)

  // Mock bracket structure if no data provided
  const mockBracket = {
    rounds: [
      {
        name: 'Quarterfinals',
        games: [
          {
            id: 1,
            homeTeam: teams[0] || { id: 1, name: 'Thunder Hawks', seed: 1 },
            awayTeam: teams[7] || { id: 8, name: 'Blue Sharks', seed: 8 },
            result: { homeTeamScore: 78, awayTeamScore: 72, winningTeam: teams[0] || { id: 1, name: 'Thunder Hawks' } },
            gameDate: '2025-08-01',
            gameTime: '18:00'
          },
          {
            id: 2,
            homeTeam: teams[3] || { id: 4, name: 'Steel Warriors', seed: 4 },
            awayTeam: teams[4] || { id: 5, name: 'Green Hornets', seed: 5 },
            result: { homeTeamScore: 85, awayTeamScore: 82, winningTeam: teams[4] || { id: 5, name: 'Green Hornets' } },
            gameDate: '2025-08-01',
            gameTime: '19:30'
          },
          {
            id: 3,
            homeTeam: teams[1] || { id: 2, name: 'Fire Dragons', seed: 2 },
            awayTeam: teams[6] || { id: 7, name: 'Ice Wolves', seed: 7 },
            result: null,
            gameDate: '2025-08-02',
            gameTime: '18:00'
          },
          {
            id: 4,
            homeTeam: teams[2] || { id: 3, name: 'Lightning Bolts', seed: 3 },
            awayTeam: teams[5] || { id: 6, name: 'Golden Eagles', seed: 6 },
            result: null,
            gameDate: '2025-08-02',
            gameTime: '19:30'
          }
        ]
      },
      {
        name: 'Semifinals',
        games: [
          {
            id: 5,
            homeTeam: teams[0] || { id: 1, name: 'Thunder Hawks', seed: 1 },
            awayTeam: teams[4] || { id: 5, name: 'Green Hornets', seed: 5 },
            result: null,
            gameDate: '2025-08-08',
            gameTime: '18:00'
          },
          {
            id: 6,
            homeTeam: null, // TBD
            awayTeam: null, // TBD
            result: null,
            gameDate: '2025-08-08',
            gameTime: '19:30'
          }
        ]
      },
      {
        name: 'Championship',
        games: [
          {
            id: 7,
            homeTeam: null, // TBD
            awayTeam: null, // TBD
            result: null,
            gameDate: '2025-08-15',
            gameTime: '19:00'
          }
        ]
      }
    ]
  }

  const bracketData = bracket || mockBracket

  const GameMatchup = ({ game, roundIndex, gameIndex }) => {
    const isCompleted = game.result && game.winningTeam
    const isPast = game.gameDate && new Date() > parseISO(`${game.gameDate}T${game.gameTime || '00:00'}`)
    
    return (
      <div className={`card p-4 min-w-[280px] ${isCompleted ? 'bg-green-50 border-green-200' : isPast ? 'bg-yellow-50 border-yellow-200' : 'bg-white'}`}>
        {/* Game Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-gray-500">
            {bracketData.rounds[roundIndex]?.name} - Game {gameIndex + 1}
          </div>
          {isCompleted && (
            <TrophyIcon className="h-4 w-4 text-green-600" />
          )}
        </div>

        {/* Teams */}
        <div className="space-y-2">
          {/* Team 1 */}
          <div className={`flex items-center justify-between p-2 rounded ${
            isCompleted && game.result.winningTeam?.id === game.homeTeam?.id 
              ? 'bg-green-100 border border-green-300' 
              : 'bg-gray-50'
          }`}>
            <div className="flex items-center space-x-2">
              {game.homeTeam ? (
                <>
                  {game.homeTeam.logoUrl && (
                    <img src={game.homeTeam.logoUrl} alt="" className="w-6 h-6 rounded-full" />
                  )}
                  <span className={`font-medium ${
                    isCompleted && game.result.winningTeam?.id === game.homeTeam.id 
                      ? 'text-green-800' 
                      : 'text-gray-900'
                  }`}>
                    {game.homeTeam.name}
                  </span>
                  {game.homeTeam.seed && (
                    <span className="text-xs text-gray-500">#{game.homeTeam.seed}</span>
                  )}
                </>
              ) : (
                <span className="text-gray-500 italic">TBD</span>
              )}
            </div>
            {isCompleted && (
              <span className={`font-bold ${
                game.result.winningTeam?.id === game.homeTeam?.id 
                  ? 'text-green-800' 
                  : 'text-gray-600'
              }`}>
                {game.result.homeTeamScore}
              </span>
            )}
          </div>

          {/* VS */}
          <div className="text-center text-xs text-gray-400">
            {isCompleted ? 'FINAL' : 'vs'}
          </div>

          {/* Team 2 */}
          <div className={`flex items-center justify-between p-2 rounded ${
            isCompleted && game.result.winningTeam?.id === game.awayTeam?.id 
              ? 'bg-green-100 border border-green-300' 
              : 'bg-gray-50'
          }`}>
            <div className="flex items-center space-x-2">
              {game.awayTeam ? (
                <>
                  {game.awayTeam.logoUrl && (
                    <img src={game.awayTeam.logoUrl} alt="" className="w-6 h-6 rounded-full" />
                  )}
                  <span className={`font-medium ${
                    isCompleted && game.result.winningTeam?.id === game.awayTeam.id 
                      ? 'text-green-800' 
                      : 'text-gray-900'
                  }`}>
                    {game.awayTeam.name}
                  </span>
                  {game.awayTeam.seed && (
                    <span className="text-xs text-gray-500">#{game.awayTeam.seed}</span>
                  )}
                </>
              ) : (
                <span className="text-gray-500 italic">TBD</span>
              )}
            </div>
            {isCompleted && (
              <span className={`font-bold ${
                game.result.winningTeam?.id === game.awayTeam?.id 
                  ? 'text-green-800' 
                  : 'text-gray-600'
              }`}>
                {game.result.awayTeamScore}
              </span>
            )}
          </div>
        </div>

        {/* Game Details */}
        {game.gameDate && (
          <div className="mt-3 pt-2 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <CalendarIcon className="h-3 w-3" />
              <span>{format(parseISO(game.gameDate), 'MMM d')}</span>
              {game.gameTime && (
                <>
                  <span>•</span>
                  <span>{format(parseISO(`${game.gameDate}T${game.gameTime}`), 'h:mm a')}</span>
                </>
              )}
            </div>
            {game.result?.notes && (
              <div className="text-xs text-gray-600 mt-1">{game.result.notes}</div>
            )}
          </div>
        )}
      </div>
    )
  }

  if (!bracketData.rounds || bracketData.rounds.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center py-12">
          <TrophyIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Playoffs Not Started</h3>
          <p className="text-gray-600 mb-4">
            The playoff bracket will be available once the regular season ends.
          </p>
          <p className="text-sm text-gray-500">
            Top 4 teams qualify for the playoffs
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Round Selector */}
      <div className="flex justify-center">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {bracketData.rounds.map((round, index) => (
            <button
              key={index}
              onClick={() => setSelectedRound(index + 1)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedRound === index + 1
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {round.name}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Bracket View */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <div className="flex space-x-8 justify-center min-w-max px-8">
            {bracketData.rounds.map((round, roundIndex) => (
              <div key={roundIndex} className="flex flex-col space-y-4 min-w-[300px]">
                <h3 className="text-lg font-bold text-center text-gray-900 mb-4">
                  {round.name}
                </h3>
                <div className="space-y-6">
                  {round.games.map((game, gameIndex) => (
                    <GameMatchup
                      key={game.id}
                      game={game}
                      roundIndex={roundIndex}
                      gameIndex={gameIndex}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Bracket View */}
      <div className="lg:hidden">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-center text-gray-900">
            {bracketData.rounds[selectedRound - 1]?.name}
          </h3>
          <div className="space-y-4">
            {bracketData.rounds[selectedRound - 1]?.games.map((game, gameIndex) => (
              <GameMatchup
                key={game.id}
                game={game}
                roundIndex={selectedRound - 1}
                gameIndex={gameIndex}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bracket Legend */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Bracket Legend</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-gray-700">Game Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
            <span className="text-gray-700">Game Overdue</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
            <span className="text-gray-700">Upcoming Game</span>
          </div>
        </div>
      </div>
    </div>
  )
}