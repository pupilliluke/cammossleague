import React, { useState, useEffect } from 'react';
import { UsersIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const TeamSignupForm = ({ onSuccess }) => {
  const [seasons, setSeasons] = useState([]);
  const [formData, setFormData] = useState({
    submitterName: '',
    submitterEmail: '',
    submitterPhone: '',
    subject: '',
    message: '',
    seasonId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSeasons();
  }, []);

  const fetchSeasons = async () => {
    try {
      const response = await fetch('/api/public/seasons');
      if (response.ok) {
        const data = await response.json();
        // Filter for active seasons with open registration
        const openSeasons = data.filter(season => 
          season.isActive && season.isRegistrationOpen
        );
        setSeasons(openSeasons);
      }
    } catch (error) {
      console.error('Error loading seasons:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/public/forms/submit/team-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Team signup application submitted successfully! We will review your application and contact you soon.');
        setFormData({
          submitterName: '',
          submitterEmail: '',
          submitterPhone: '',
          subject: '',
          message: '',
          seasonId: ''
        });
        if (onSuccess) onSuccess();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to submit application');
      }
    } catch (error) {
      toast.error('Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <UsersIcon className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">New Team Registration</h2>
          <p className="mt-2 text-gray-600">
            Ready to join the league? Submit your team application and we'll get you set up for the season.
          </p>
        </div>

        {seasons.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              <strong>Registration Closed:</strong> There are no seasons currently accepting new team registrations. 
              Please check back later or contact the league administration for more information.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="submitterName" className="block text-sm font-medium text-gray-700 mb-2">
                Team Captain Name *
              </label>
              <input
                type="text"
                id="submitterName"
                name="submitterName"
                value={formData.submitterName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="submitterEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="submitterEmail"
                name="submitterEmail"
                value={formData.submitterEmail}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="submitterPhone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="submitterPhone"
              name="submitterPhone"
              value={formData.submitterPhone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="seasonId" className="block text-sm font-medium text-gray-700 mb-2">
              Season *
            </label>
            <select
              id="seasonId"
              name="seasonId"
              value={formData.seasonId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={seasons.length === 0}
            >
              <option value="">Select a season</option>
              {seasons.map(season => (
                <option key={season.id} value={season.id}>
                  {season.name} {season.year} - {season.seasonType}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Team Name *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your proposed team name"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Team Details *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Please provide the following information:&#10;&#10;• Number of committed players&#10;• Player experience levels&#10;• Preferred playing times/days&#10;• Any additional information about your team&#10;• Any questions you have about joining the league"
              required
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <UsersIcon className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Registration Requirements:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Minimum 8 players required per team</li>
                  <li>Maximum {seasons[0]?.maxPlayersPerTeam || 12} players per team</li>
                  <li>Registration fee will be communicated after approval</li>
                  <li>All players must complete individual registration forms</li>
                  <li>Teams must provide proof of liability insurance</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || seasons.length === 0}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamSignupForm;