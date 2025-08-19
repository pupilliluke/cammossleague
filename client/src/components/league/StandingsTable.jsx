import { useState } from 'react'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid'

export default function StandingsTable({ teams = [] }) {
  const [sortBy, setSortBy] = useState('winPercentage')
  const [sortOrder, setSortOrder] = useState('desc')

  const sortedTeams = [...teams].sort((a, b) => {
    let aVal, bVal
    
    switch (sortBy) {
      case 'wins':
        aVal = a.wins
        bVal = b.wins
        break
      case 'losses':
        aVal = a.losses
        bVal = b.losses
        break
      case 'winPercentage':
        aVal = a.wins / (a.wins + a.losses) || 0
        bVal = b.wins / (b.wins + b.losses) || 0
        break
      case 'pointsFor':
        aVal = a.pointsFor
        bVal = b.pointsFor
        break
      case 'pointsAgainst':
        aVal = a.pointsAgainst
        bVal = b.pointsAgainst
        break
      case 'pointsDiff':
        aVal = a.pointsFor - a.pointsAgainst
        bVal = b.pointsFor - b.pointsAgainst
        break
      default:
        aVal = a.name
        bVal = b.name
    }
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }

  const SortIcon = ({ column }) => {
    if (sortBy !== column) return null
    return sortOrder === 'asc' ? 
      <ChevronUpIcon className="h-4 w-4" /> : 
      <ChevronDownIcon className="h-4 w-4" />
  }

  if (teams.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center py-8">
          <p className="text-gray-500">No teams data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-900">Standings</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Team</span>
                  <SortIcon column="name" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('wins')}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>W</span>
                  <SortIcon column="wins" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('losses')}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>L</span>
                  <SortIcon column="losses" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('winPercentage')}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>PCT</span>
                  <SortIcon column="winPercentage" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('pointsFor')}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>PF</span>
                  <SortIcon column="pointsFor" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('pointsAgainst')}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>PA</span>
                  <SortIcon column="pointsAgainst" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('pointsDiff')}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>DIFF</span>
                  <SortIcon column="pointsDiff" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTeams.map((team, index) => {
              const winPercentage = team.wins / (team.wins + team.losses) || 0
              const pointsDiff = team.pointsFor - team.pointsAgainst
              const isPlayoffPosition = index < 4 // Top 4 make playoffs
              
              return (
                <tr 
                  key={team.id} 
                  className={`hover:bg-gray-50 ${
                    isPlayoffPosition ? 'bg-green-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${
                        isPlayoffPosition ? 'text-green-700' : 'text-gray-900'
                      }`}>
                        {index + 1}
                      </span>
                      {isPlayoffPosition && (
                        <span className="ml-1 text-xs text-green-600">•</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      {team.logoUrl ? (
                        <img
                          src={team.logoUrl}
                          alt={team.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className="team-colors"
                          style={{ backgroundColor: team.primaryColor || '#6B7280' }}
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {team.name}
                        </div>
                        {team.city && (
                          <div className="text-xs text-gray-500">{team.city}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm font-medium text-gray-900">
                      {team.wins}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-gray-900">{team.losses}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm font-medium text-gray-900">
                      {winPercentage.toFixed(3)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-gray-900">{team.pointsFor}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-gray-900">{team.pointsAgainst}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`text-sm font-medium ${
                      pointsDiff > 0 ? 'text-green-600' : 
                      pointsDiff < 0 ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {pointsDiff > 0 ? '+' : ''}{pointsDiff}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {sortedTeams.some((_, index) => index < 4) && (
        <div className="card-footer">
          <p className="text-xs text-gray-500">
            <span className="text-green-600">•</span> Teams will be seeded based on their regular season performance.
          </p>
        </div>
      )}
    </div>
  )
}