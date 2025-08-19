import React, { useState, useEffect } from 'react';
import { PlusIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AdminGames = () => {
  const [games, setGames] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('');
  const [newGame, setNewGame] = useState({
    seasonId: '',
    homeTeamId: '',
    awayTeamId: '',
    gameDate: '',
    gameTime: '19:00',
    location: 'Community Center',
    courtNumber: 'Court 1',
    weekNumber: ''
  });

  useEffect(() => {
    fetchGames();
    fetchSeasons();
  }, [selectedSeason, selectedWeek]);

  const fetchGames = async () => {
    try {
      let url = '/api/admin/games';
      const params = new URLSearchParams();
      
      if (selectedSeason) params.append('seasonId', selectedSeason);
      if (selectedWeek) params.append('weekNumber', selectedWeek);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setGames(data.content || []);
      } else {
        toast.error('Failed to load games');
      }
    } catch (error) {
      toast.error('Error loading games');
    } finally {
      setLoading(false);
    }
  };

  const fetchSeasons = async () => {
    try {
      const response = await fetch('/api/public/seasons');
      if (response.ok) {
        const data = await response.json();
        setSeasons(data);
      }
    } catch (error) {
      console.error('Error loading seasons:', error);
    }
  };

  const fetchTeams = async (seasonId) => {
    if (!seasonId) return;
    
    try {
      const response = await fetch(`/api/public/seasons/${seasonId}/teams`);
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
      }
    } catch (error) {
      console.error('Error loading teams:', error);
    }
  };

  const handleCreateGame = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newGame)
      });

      if (response.ok) {
        toast.success('Game created successfully');
        setShowCreateModal(false);
        setNewGame({
          seasonId: '',
          homeTeamId: '',
          awayTeamId: '',
          gameDate: '',
          gameTime: '19:00',
          location: 'Community Center',
          courtNumber: 'Court 1',
          weekNumber: ''
        });
        fetchGames();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to create game');
      }
    } catch (error) {
      toast.error('Error creating game');
    }
  };

  const updateGameScore = async (gameId, homeScore, awayScore) => {
    try {
      const response = await fetch(`/api/admin/games/${gameId}/score`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ homeScore: parseInt(homeScore), awayScore: parseInt(awayScore) })
      });

      if (response.ok) {
        toast.success('Score updated successfully');
        fetchGames();
      } else {
        toast.error('Failed to update score');
      }
    } catch (error) {
      toast.error('Error updating score');
    }
  };

  const completeGame = async (gameId) => {
    try {
      const response = await fetch(`/api/admin/games/${gameId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast.success('Game completed successfully');
        fetchGames();
      } else {
        toast.error('Failed to complete game');
      }
    } catch (error) {
      toast.error('Error completing game');
    }
  };

  const deleteGame = async (gameId) => {
    if (!confirm('Are you sure you want to delete this game?')) return;

    try {
      const response = await fetch(`/api/admin/games/${gameId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast.success('Game deleted successfully');
        fetchGames();
      } else {
        toast.error('Failed to delete game');
      }
    } catch (error) {
      toast.error('Error deleting game');
    }
  };

  const generateSchedule = async (seasonId) => {
    try {
      const response = await fetch(`/api/admin/games/schedule/generate/${seasonId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const message = await response.text();
        toast.success(message);
        fetchGames();
      } else {
        toast.error('Failed to generate schedule');
      }
    } catch (error) {
      toast.error('Error generating schedule');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Game Management</h1>
          <p className="text-gray-600">Manage league games and schedules</p>
        </div>
        <div className="flex gap-3">
          {selectedSeason && (
            <button
              onClick={() => generateSchedule(selectedSeason)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Generate Schedule
            </button>
          )}
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5" />
            Add Game
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Season
            </label>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">All Seasons</option>
              {seasons.map(season => (
                <option key={season.id} value={season.id}>
                  {season.name} ({season.year})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Week
            </label>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">All Weeks</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Week {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Games List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Game
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {games.map((game) => (
                <tr key={game.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {game.awayTeamName} @ {game.homeTeamName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {game.seasonName} - Week {game.weekNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {new Date(game.gameDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {game.gameTime}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{game.location}</div>
                    {game.courtNumber && (
                      <div className="text-sm text-gray-500">{game.courtNumber}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {game.isCompleted ? (
                      <div className="text-sm font-medium">
                        <span className="text-gray-900">{game.awayScore}</span>
                        <span className="text-gray-500 mx-2">-</span>
                        <span className="text-gray-900">{game.homeScore}</span>
                      </div>
                    ) : (
                      <div className="flex space-x-1">
                        <input
                          type="number"
                          placeholder="Away"
                          className="w-16 px-2 py-1 text-xs border rounded"
                          defaultValue={game.awayScore || ''}
                          onBlur={(e) => {
                            const homeInput = e.target.parentElement.querySelector('input[placeholder="Home"]');
                            if (e.target.value && homeInput.value) {
                              updateGameScore(game.id, homeInput.value, e.target.value);
                            }
                          }}
                        />
                        <span className="text-gray-500">-</span>
                        <input
                          type="number"
                          placeholder="Home"
                          className="w-16 px-2 py-1 text-xs border rounded"
                          defaultValue={game.homeScore || ''}
                          onBlur={(e) => {
                            const awayInput = e.target.parentElement.querySelector('input[placeholder="Away"]');
                            if (e.target.value && awayInput.value) {
                              updateGameScore(game.id, e.target.value, awayInput.value);
                            }
                          }}
                        />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      game.isCompleted 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {game.isCompleted ? 'Completed' : 'Scheduled'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {!game.isCompleted && game.homeScore && game.awayScore && (
                        <button
                          onClick={() => completeGame(game.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Complete
                        </button>
                      )}
                      <button
                        onClick={() => deleteGame(game.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {games.length === 0 && (
            <div className="text-center py-12">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No games scheduled</h3>
              <p className="text-gray-600 mb-4">Create your first game or generate a full schedule</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Add Game
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Game Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Game</h2>
            
            <form onSubmit={handleCreateGame} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Season
                </label>
                <select
                  value={newGame.seasonId}
                  onChange={(e) => {
                    setNewGame({...newGame, seasonId: e.target.value});
                    fetchTeams(e.target.value);
                  }}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                >
                  <option value="">Select a season</option>
                  {seasons.map(season => (
                    <option key={season.id} value={season.id}>
                      {season.name} ({season.year})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Away Team
                  </label>
                  <select
                    value={newGame.awayTeamId}
                    onChange={(e) => setNewGame({...newGame, awayTeamId: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Select team</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Home Team
                  </label>
                  <select
                    value={newGame.homeTeamId}
                    onChange={(e) => setNewGame({...newGame, homeTeamId: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Select team</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newGame.gameDate}
                    onChange={(e) => setNewGame({...newGame, gameDate: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newGame.gameTime}
                    onChange={(e) => setNewGame({...newGame, gameTime: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={newGame.location}
                  onChange={(e) => setNewGame({...newGame, location: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Community Center"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Court
                  </label>
                  <input
                    type="text"
                    value={newGame.courtNumber}
                    onChange={(e) => setNewGame({...newGame, courtNumber: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Court 1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Week
                  </label>
                  <input
                    type="number"
                    value={newGame.weekNumber}
                    onChange={(e) => setNewGame({...newGame, weekNumber: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="1"
                    min="1"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Create Game
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGames;