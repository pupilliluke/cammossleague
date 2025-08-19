import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Disclosure } from '@headlessui/react'
import { 
  Bars3Icon, 
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../../contexts/AuthContext'
import { useSeason } from '../../contexts/SeasonContext'
import LoginModal from '../auth/LoginModal'
import RegisterModal from '../auth/RegisterModal'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'League', href: '/league' },
  { name: 'Teams', href: '/teams' },
  { name: 'Players', href: '/players' },
  { name: 'Bracket', href: '/bracket' },
  { name: 'Free Agents', href: '/free-agents' },
  { name: 'History', href: '/history' },
]

export default function Header() {
  const location = useLocation()
  const { isAuthenticated, appUser, logout, isAdmin } = useAuth()
  const { activeSeason } = useSeason()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <>
      <Disclosure as="nav" className="bg-white shadow-sm border-b border-gray-200 relative">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex">
                  <div className="flex flex-shrink-0 items-center">
                    <Link to="/" className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">🏀</span>
                      </div>
                      <div className="hidden sm:block">
                        <h1 className="text-xl font-bold text-gray-900">Cam Moss League</h1>
                        {activeSeason && (
                          <p className="text-xs text-gray-500">{activeSeason.name}</p>
                        )}
                      </div>
                    </Link>
                  </div>
                  
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                          location.pathname === item.href
                            ? 'border-primary-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
                
                <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
                  {isAuthenticated ? (
                    <div className="relative ml-3 z-40">
                      <Disclosure>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className="flex items-center space-x-2 rounded-full bg-white text-sm text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                              <span className="sr-only">Open user menu</span>
                              {appUser?.profileImageUrl ? (
                                <img
                                  className="h-8 w-8 rounded-full object-cover"
                                  src={appUser.profileImageUrl}
                                  alt={appUser.firstName}
                                />
                              ) : (
                                <UserCircleIcon className="h-8 w-8" />
                              )}
                              <span className="hidden md:block font-medium">
                                {appUser?.firstName || 'User'}
                              </span>
                              <ChevronDownIcon className="h-4 w-4" />
                            </Disclosure.Button>
                            
                            <Disclosure.Panel className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200">
                              <div className="py-1">
                                <Link
                                  to="/profile"
                                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                  <UserCircleIcon className="h-4 w-4" />
                                  <span>Profile</span>
                                </Link>
                                
                                {appUser?.role === 'PLAYER' && (
                                  <Link
                                    to="/team/dashboard"
                                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                  >
                                    <span>🏀 Team Dashboard</span>
                                  </Link>
                                )}
                                
                                {isAdmin && (
                                  <Link
                                    to="/admin"
                                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                  >
                                    <Cog6ToothIcon className="h-4 w-4" />
                                    <span>Admin Panel</span>
                                  </Link>
                                )}
                                
                                <div className="border-t border-gray-100 my-1"></div>
                                
                                <button
                                  onClick={handleLogout}
                                  className="flex w-full items-center space-x-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                                  <span>Sign out</span>
                                </button>
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    </div>
                  ) : (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowLoginModal(true)}
                        className="btn-ghost"
                      >
                        Sign in
                      </button>
                      <Link
                        to="/signup"
                        className="btn-primary"
                      >
                        Join League
                      </Link>
                    </div>
                  )}
                </div>
                
                <div className="-mr-2 flex items-center sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 pb-3 pt-2">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.href}
                    className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium transition-colors duration-200 ${
                      location.pathname === item.href
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'
                    }`}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
              
              {isAuthenticated ? (
                <div className="border-t border-gray-200 pb-3 pt-4">
                  <div className="flex items-center px-4">
                    {appUser?.profileImageUrl ? (
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={appUser.profileImageUrl}
                        alt={appUser.firstName}
                      />
                    ) : (
                      <UserCircleIcon className="h-10 w-10 text-gray-400" />
                    )}
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {appUser?.firstName} {appUser?.lastName}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {appUser?.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <Disclosure.Button
                      as={Link}
                      to="/profile"
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    >
                      Profile
                    </Disclosure.Button>
                    {isAdmin && (
                      <Disclosure.Button
                        as={Link}
                        to="/admin"
                        className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                      >
                        Admin Panel
                      </Disclosure.Button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-200 pb-3 pt-4">
                  <div className="space-y-1">
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="block w-full px-4 py-2 text-left text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    >
                      Sign in
                    </button>
                    <Link
                      to="/signup"
                      className="block w-full px-4 py-2 text-left text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    >
                      Join League
                    </Link>
                  </div>
                </div>
              )}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      
      {/* Auth Modals */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false)
          setShowRegisterModal(true)
        }}
      />
      <RegisterModal 
        isOpen={showRegisterModal} 
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false)
          setShowLoginModal(true)
        }}
      />
    </>
  )
}