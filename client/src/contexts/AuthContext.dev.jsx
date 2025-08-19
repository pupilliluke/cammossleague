import { createContext, useContext, useState } from 'react'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user] = useState(null)
  const [loading] = useState(false)
  const [appUser] = useState(null)

  const value = {
    user,
    appUser,
    loading,
    isAuthenticated: false,
    signIn: () => Promise.resolve(),
    signUp: () => Promise.resolve(),
    signInWithGoogle: () => Promise.resolve(),
    signOut: () => Promise.resolve(),
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}