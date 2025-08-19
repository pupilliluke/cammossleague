import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/auth'
import { googleAuthService } from '../services/googleAuth'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [appUser, setAppUser] = useState(null)

  // Initialize auth on app load
  useEffect(() => {
    const initAuth = async () => {
      // Initialize Google Auth
      try {
        await googleAuthService.initialize()
      } catch (error) {
        console.warn('Google Auth initialization failed:', error)
      }

      const token = authService.getToken()
      if (token) {
        authService.setAuthToken(token)
        try {
          const currentUser = await authService.getCurrentUser()
          setUser(currentUser)
          setAppUser(currentUser)
        } catch (error) {
          console.error('Auth initialization error:', error)
          authService.logout()
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (username, password) => {
    setLoading(true)
    try {
      const response = await authService.login(username, password)
      authService.setAuthToken(response.token)
      setUser(response)
      setAppUser(response)
      return response
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    setLoading(true)
    try {
      const response = await authService.register(userData)
      authService.setAuthToken(response.token)
      setUser(response)
      setAppUser(response)
      return response
    } catch (error) {
      console.error('Register error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await authService.logout()
    await googleAuthService.signOut()
    setUser(null)
    setAppUser(null)
  }

  const loginWithGoogle = async (idToken) => {
    setLoading(true)
    try {
      // If no idToken provided, get it from googleAuthService
      let token = idToken
      if (!token) {
        token = await googleAuthService.signIn()
      }
      
      const response = await authService.googleLogin(token)
      authService.setAuthToken(response.token)
      setUser(response.user)
      setAppUser(response.user)
      return response
    } catch (error) {
      console.error('Google login error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }
  const signIn = login
  const signUp = register
  const signInWithGoogle = loginWithGoogle
  const signOut = logout

  const value = {
    user,
    appUser,
    loading,
    isAuthenticated: !!user,
    isAdmin: appUser?.role === 'ADMIN',
    login,
    register,
    logout,
    loginWithGoogle,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}