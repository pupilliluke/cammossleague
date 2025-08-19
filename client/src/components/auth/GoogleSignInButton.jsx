import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const GoogleSignInButton = ({ 
  onSuccess, 
  onError, 
  text = 'Continue with Google',
  className = '',
  disabled = false 
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const { loginWithGoogle } = useAuth()
  const buttonRef = useRef(null)
  const googleButtonRef = useRef(null)

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '421846493835-dtr9vku1qtrin2stgglsf6lffrno5tl0.apps.googleusercontent.com'

  useEffect(() => {
    const initGoogleButton = () => {
      if (window.google && buttonRef.current && !googleButtonRef.current) {
        // Create a hidden container for the actual Google button
        const hiddenContainer = document.createElement('div')
        hiddenContainer.style.position = 'absolute'
        hiddenContainer.style.left = '-9999px'
        hiddenContainer.style.visibility = 'hidden'
        document.body.appendChild(hiddenContainer)

        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: false
          })

          // Detect mobile device
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
          
          window.google.accounts.id.renderButton(hiddenContainer, {
            theme: 'outline',
            size: isMobile ? 'medium' : 'large',
            type: 'standard',
            shape: 'rectangular',
            text: 'continue_with',
            logo_alignment: 'left',
            // Mobile-specific settings
            width: isMobile ? '100%' : undefined
          })

          googleButtonRef.current = hiddenContainer
        } catch (error) {
          console.error('Error initializing Google button:', error)
          document.body.removeChild(hiddenContainer)
        }
      }
    }

    // Wait for Google API to load
    const checkGoogleLoaded = () => {
      if (window.google && window.google.accounts) {
        initGoogleButton()
      } else {
        setTimeout(checkGoogleLoaded, 100)
      }
    }

    checkGoogleLoaded()

    return () => {
      if (googleButtonRef.current && document.body.contains(googleButtonRef.current)) {
        document.body.removeChild(googleButtonRef.current)
      }
    }
  }, [clientId])

  const handleCredentialResponse = async (response) => {
    if (response.credential) {
      setIsLoading(true)
      try {
        const result = await loginWithGoogle(response.credential)
        if (onSuccess) onSuccess(result)
      } catch (error) {
        console.error('Google sign-in error:', error)
        if (onError) onError(error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleClick = () => {
    if (disabled || isLoading) return

    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    if (googleButtonRef.current) {
      // Find and click the actual Google button
      const googleButton = googleButtonRef.current.querySelector('div[role="button"]')
      if (googleButton) {
        // On mobile, add a small delay to ensure the click is processed properly
        if (isMobile) {
          setTimeout(() => googleButton.click(), 50)
        } else {
          googleButton.click()
        }
      } else {
        // Fallback: trigger Google sign-in prompt
        if (window.google && window.google.accounts) {
          // On mobile, use a more direct approach
          if (isMobile) {
            window.google.accounts.id.prompt((notification) => {
              if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                // Force a direct authentication flow on mobile
                console.log('Google prompt not displayed on mobile, using alternative flow')
              }
            })
          } else {
            window.google.accounts.id.prompt()
          }
        }
      }
    }
  }

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`
        w-full flex items-center justify-center px-4 py-3 border border-gray-300 
        rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 
        hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
        focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200 
        sm:py-2 touch-manipulation select-none
        ${className}
      `}
    >
      {isLoading ? (
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Signing in...
        </div>
      ) : (
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>{text}</span>
        </div>
      )}
    </button>
  )
}

export default GoogleSignInButton