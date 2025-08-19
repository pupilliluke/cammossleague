import { useState } from 'react'
import { TrophyIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { format, parseISO } from 'date-fns'

export default function PlayoffBracket({ bracket = null, teams = [] }) {
  const [selectedRound, setSelectedRound] = useState(1)

  // Create dynamic bracket structure based on teams - March Madness style
  const createBracketFromTeams = (teams) => {
    const totalTeams = teams.length
    const playoffTeamCount = totalTeams // All teams participate (11 teams)
    const playoffTeams = teams
    
    // March Madness style: 11 teams = 5 byes + 6 first round teams (3 games)
    const byeCount = 5 // Top 5 teams get byes
    const byeTeams = playoffTeams.slice(0, byeCount)
    const firstRoundTeams = playoffTeams.slice(byeCount)
    
    const rounds = []
    
    // First Round - March Madness style play-in games with specific matchups
    if (firstRoundTeams.length >= 2) {
      const firstRoundGames = []
      
      // Find specific teams for custom matchups
      const palakers = playoffTeams.find(t => t.name && t.name.toLowerCase().includes('palakers'))
      const indianaBones = playoffTeams.find(t => t.name && t.name.toLowerCase().includes('indiana') && t.name.toLowerCase().includes('bones'))
      const diddyParty = playoffTeams.find(t => t.name && t.name.toLowerCase().includes('diddy'))
      const redeemTeam = playoffTeams.find(t => t.name && t.name.toLowerCase().includes('redeem'))
      
      // Custom matchups on August 10th
      if (palakers && indianaBones) {
        firstRoundGames.push({
          id: 'first-1',
          homeTeam: palakers,
          awayTeam: indianaBones,
          result: null,
          gameDate: '2025-08-10',
          gameTime: '18:00'
        })
      }
      
      if (diddyParty && redeemTeam) {
        firstRoundGames.push({
          id: 'first-2',
          homeTeam: diddyParty,
          awayTeam: redeemTeam,
          result: null,
          gameDate: '2025-08-10',
          gameTime: '19:30'
        })
      }
      
      // Add any remaining first round teams that weren't in the custom matchups
      const usedTeams = new Set([
        palakers?.id, indianaBones?.id, diddyParty?.id, redeemTeam?.id
      ].filter(Boolean))
      
      const remainingTeams = firstRoundTeams.filter(team => !usedTeams.has(team.id))
      
      // Pair up remaining teams
      for (let i = 0; i < remainingTeams.length; i += 2) {
        if (i + 1 < remainingTeams.length) {
          firstRoundGames.push({
            id: `first-${firstRoundGames.length + 1}`,
            homeTeam: remainingTeams[i],
            awayTeam: remainingTeams[i + 1],
            result: null,
            gameDate: '2025-08-10',
            gameTime: i === 0 ? '21:00' : '21:30'
          })
        }
      }
      
      if (firstRoundGames.length > 0) {
        rounds.push({
          name: 'Play-in Round',
          games: firstRoundGames
        })
      }
    }
    
    // Quarterfinals - March Madness style
    if (playoffTeamCount >= 4) {
      const quarterGames = []
      
      // March Madness quarterfinals: 1 vs winner(6v11), 2 vs winner(7v10), 3 vs winner(8v9), 4 vs 5
      quarterGames.push(
        {
          id: 'quarter-1',
          homeTeam: byeTeams.find(t => t.seed === 1), // #1 seed
          awayTeam: null, // Winner of 6v11
          result: null,
          gameDate: '2025-08-08',
          gameTime: '18:00',
          note: 'vs Winner of 6v11'
        },
        {
          id: 'quarter-2',
          homeTeam: byeTeams.find(t => t.seed === 2), // #2 seed  
          awayTeam: null, // Winner of 7v10
          result: null,
          gameDate: '2025-08-08',
          gameTime: '19:30',
          note: 'vs Winner of 7v10'
        },
        {
          id: 'quarter-3',
          homeTeam: byeTeams.find(t => t.seed === 3), // #3 seed
          awayTeam: null, // Winner of 8v9
          result: null,
          gameDate: '2025-08-09',
          gameTime: '18:00',
          note: 'vs Winner of 8v9'
        },
        {
          id: 'quarter-4',
          homeTeam: byeTeams.find(t => t.seed === 4), // #4 seed
          awayTeam: byeTeams.find(t => t.seed === 5), // #5 seed
          result: null,
          gameDate: '2025-08-09',
          gameTime: '19:30'
        }
      )
      
      if (quarterGames.length > 0) {
        rounds.push({
          name: 'Quarterfinals',
          games: quarterGames
        })
      }
    }
    
    // Semifinals - March Madness style (4 teams advance from quarterfinals)
    if (playoffTeamCount >= 4) {
      rounds.push({
        name: 'Semifinals',
        games: [
          {
            id: 'semi-1',
            homeTeam: null, // Winner of quarter-1
            awayTeam: null, // Winner of quarter-2
            result: null,
            gameDate: '2025-08-15',
            gameTime: '18:00'
          },
          {
            id: 'semi-2',
            homeTeam: null, // Winner of quarter-3
            awayTeam: null, // Winner of quarter-4
            result: null,
            gameDate: '2025-08-15',
            gameTime: '19:30'
          }
        ]
      })
    }
    
    // Championship
    if (playoffTeamCount >= 4) {
      rounds.push({
        name: 'Championship',
        games: [
          {
            id: 'championship',
            homeTeam: null,
            awayTeam: null,
            result: null,
            gameDate: '2025-08-22',
            gameTime: '19:00'
          }
        ]
      })
    }
    
    return { rounds }
  }

  // Mock bracket structure if no data provided
  const mockBracket = teams.length > 0 ? createBracketFromTeams(teams) : {
    rounds: [
      {
        name: 'Play-in Round',
        games: [
          {
            id: 1,
            homeTeam: { id: 5, name: 'Green Hornets', seed: 5 },
            awayTeam: { id: 8, name: 'Blue Sharks', seed: 8 },
            result: null,
            gameDate: '2025-08-01',
            gameTime: '18:00'
          },
          {
            id: 2,
            homeTeam: { id: 6, name: 'Golden Eagles', seed: 6 },
            awayTeam: { id: 7, name: 'Ice Wolves', seed: 7 },
            result: null,
            gameDate: '2025-08-01',
            gameTime: '19:30'
          }
        ]
      },
      {
        name: 'Quarterfinals',
        games: [
          {
            id: 3,
            homeTeam: { id: 1, name: 'Thunder Hawks', seed: 1 },
            awayTeam: null, // Winner of 5v8
            result: null,
            gameDate: '2025-08-08',
            gameTime: '18:00'
          },
          {
            id: 4,
            homeTeam: { id: 2, name: 'Fire Dragons', seed: 2 },
            awayTeam: null, // Winner of 6v7
            result: null,
            gameDate: '2025-08-08',
            gameTime: '19:30'
          },
          {
            id: 5,
            homeTeam: { id: 3, name: 'Lightning Bolts', seed: 3 },
            awayTeam: { id: 4, name: 'Steel Warriors', seed: 4 },
            result: null,
            gameDate: '2025-08-09',
            gameTime: '18:00'
          }
        ]
      },
      {
        name: 'Semifinals',
        games: [
          {
            id: 6,
            homeTeam: null, // TBD
            awayTeam: null, // TBD
            result: null,
            gameDate: '2025-08-15',
            gameTime: '18:00'
          },
          {
            id: 7,
            homeTeam: null, // TBD
            awayTeam: null, // TBD
            result: null,
            gameDate: '2025-08-15',
            gameTime: '19:30'
          }
        ]
      },
      {
        name: 'Championship',
        games: [
          {
            id: 8,
            homeTeam: null, // TBD
            awayTeam: null, // TBD
            result: null,
            gameDate: '2025-08-22',
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
    const hasBye = (game.homeTeam && !game.awayTeam) || (!game.homeTeam && game.awayTeam)
    
    return (
      <div className={`card p-4 min-w-[280px] ${
        isCompleted ? 'bg-green-50 border-green-200' : 
        hasBye ? 'bg-blue-50 border-blue-200' :
        isPast ? 'bg-yellow-50 border-yellow-200' : 'bg-white'
      }`}>
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
            {isCompleted ? 'FINAL' : hasBye ? 'BYE' : 'vs'}
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
                <span className="text-gray-500 italic">
                  {game.note || 'TBD'}
                </span>
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
            All Teams will be seeded based on their regular season performance.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
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
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
            <span className="text-gray-700">Bye/Automatic Advance</span>
          </div>
        </div>
      </div>
    </div>
  )
}