import { Link } from 'react-router-dom'
import { useSeason } from '../../contexts/SeasonContext'

export default function Footer() {
  const { activeSeason } = useSeason()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">🏀</span>
              </div>
              <div>
                <h3 className="text-white text-lg font-bold">Cam Moss League</h3>
                {activeSeason && (
                  <p className="text-gray-400 text-sm">{activeSeason.name}</p>
                )}
              </div>
            </div>
            <p className="text-gray-400 text-sm max-w-md">
              Recreational basketball league bringing together players of all skill levels 
              for competitive games, community building, and seasonal tournaments.
            </p>
            <div className="mt-6">
              <h4 className="text-white text-sm font-semibold mb-2">Contact</h4>
              <p className="text-gray-400 text-sm">Email: info@cammossleague.com</p>
              <p className="text-gray-400 text-sm">Phone: (555) 123-BALL</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/league" className="text-gray-400 hover:text-white text-sm transition-colors">
                  League Dashboard
                </Link>
              </li>
              <li>
                <Link to="/teams" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Teams
                </Link>
              </li>
              <li>
                <Link to="/players" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Players
                </Link>
              </li>
              <li>
                <Link to="/bracket" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Playoffs
                </Link>
              </li>
              <li>
                <Link to="/free-agents" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Free Agents
                </Link>
              </li>
            </ul>
          </div>

          {/* League Info */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4">League Info</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/history" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Season History
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Rules & Regulations
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Game Locations
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Registration
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Season Stats */}
        {activeSeason && (
          <div className="mt-8 pt-8 border-t border-gray-800">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">
                  {activeSeason.teams?.length || '8'}
                </div>
                <div className="text-gray-400 text-sm">Active Teams</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {activeSeason.totalPlayers || '96'}
                </div>
                <div className="text-gray-400 text-sm">Registered Players</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {activeSeason.gamesPlayed || '24'}
                </div>
                <div className="text-gray-400 text-sm">Games Played</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {activeSeason.weeksRemaining || '6'}
                </div>
                <div className="text-gray-400 text-sm">Weeks Remaining</div>
              </div>
            </div>
          </div>
        )}

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Cam Moss Basketball League. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Code of Conduct
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}