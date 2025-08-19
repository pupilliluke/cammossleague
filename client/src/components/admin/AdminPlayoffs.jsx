import React, { useState, useEffect } from 'react';
import { PlusIcon, PlayIcon, TrophyIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AdminPlayoffs = () => {
  const [brackets, setBrackets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBracket, setSelectedBracket] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [newBracket, setNewBracket] = useState({
    seasonId: '',
    bracketName: '',
    bracketType: 'SINGLE_ELIMINATION',
    maxTeams: 8
  });

  useEffect(() => {
    fetchBrackets();
    fetchSeasons();
  }, []);

  const fetchBrackets = async () => {
    try {
      const response = await fetch('/api/admin/playoffs/brackets', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBrackets(data.content || []);
      } else {
        toast.error('Failed to load brackets');
      }
    } catch (error) {
      toast.error('Error loading brackets');
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

  const handleCreateBracket = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/playoffs/brackets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newBracket)
      });

      if (response.ok) {
        toast.success('Bracket created successfully');
        setShowCreateModal(false);
        setNewBracket({
          seasonId: '',
          bracketName: '',
          bracketType: 'SINGLE_ELIMINATION',
          maxTeams: 8
        });
        fetchBrackets();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to create bracket');
      }
    } catch (error) {
      toast.error('Error creating bracket');
    }
  };

  const activateBracket = async (bracketId) => {
    try {
      const response = await fetch(`/api/admin/playoffs/brackets/${bracketId}/activate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast.success('Bracket activated successfully');
        fetchBrackets();
      } else {
        toast.error('Failed to activate bracket');
      }
    } catch (error) {
      toast.error('Error activating bracket');
    }
  };

  const deleteBracket = async (bracketId) => {
    if (!confirm('Are you sure you want to delete this bracket?')) return;

    try {
      const response = await fetch(`/api/admin/playoffs/brackets/${bracketId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast.success('Bracket deleted successfully');
        fetchBrackets();
      } else {
        toast.error('Failed to delete bracket');
      }
    } catch (error) {
      toast.error('Error deleting bracket');
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
          <h1 className="text-2xl font-bold text-gray-900">Playoff Management</h1>
          <p className="text-gray-600">Manage playoff brackets and tournament structure</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5" />
          Create Bracket
        </button>
      </div>

      {/* Brackets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brackets.map((bracket) => (
          <div key={bracket.id} className="bg-white rounded-lg shadow border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{bracket.bracketName}</h3>
              <div className="flex items-center gap-2">
                {bracket.isActive && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                    Active
                  </span>
                )}
                {bracket.isCompleted && (
                  <TrophyIcon className="h-5 w-5 text-yellow-500" />
                )}
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Season:</span> {bracket.seasonName}</p>
              <p><span className="font-medium">Type:</span> {bracket.bracketType.replace('_', ' ')}</p>
              <p><span className="font-medium">Max Teams:</span> {bracket.maxTeams}</p>
              <p><span className="font-medium">Current Round:</span> {bracket.currentRound}</p>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setSelectedBracket(bracket)}
                className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded text-sm font-medium hover:bg-blue-100"
              >
                View Details
              </button>
              
              {!bracket.isActive && (
                <button
                  onClick={() => activateBracket(bracket.id)}
                  className="bg-green-50 text-green-600 px-3 py-2 rounded text-sm font-medium hover:bg-green-100 flex items-center gap-1"
                >
                  <PlayIcon className="h-4 w-4" />
                  Activate
                </button>
              )}
              
              <button
                onClick={() => deleteBracket(bracket.id)}
                className="bg-red-50 text-red-600 px-3 py-2 rounded text-sm font-medium hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {brackets.length === 0 && (
          <div className="col-span-full text-center py-12">
            <TrophyIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No brackets created</h3>
            <p className="text-gray-600 mb-4">Create your first playoff bracket to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Bracket
            </button>
          </div>
        )}
      </div>

      {/* Create Bracket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Bracket</h2>
            
            <form onSubmit={handleCreateBracket} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Season
                </label>
                <select
                  value={newBracket.seasonId}
                  onChange={(e) => setNewBracket({...newBracket, seasonId: e.target.value})}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bracket Name
                </label>
                <input
                  type="text"
                  value={newBracket.bracketName}
                  onChange={(e) => setNewBracket({...newBracket, bracketName: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="e.g., Summer 2025 Playoffs"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bracket Type
                </label>
                <select
                  value={newBracket.bracketType}
                  onChange={(e) => setNewBracket({...newBracket, bracketType: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="SINGLE_ELIMINATION">Single Elimination</option>
                  <option value="DOUBLE_ELIMINATION">Double Elimination</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Teams
                </label>
                <select
                  value={newBracket.maxTeams}
                  onChange={(e) => setNewBracket({...newBracket, maxTeams: parseInt(e.target.value)})}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value={4}>4 Teams</option>
                  <option value={8}>8 Teams</option>
                  <option value={16}>16 Teams</option>
                </select>
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
                  Create Bracket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlayoffs;