// Google OAuth Service using popup-based authentication
class GoogleAuthService {
  constructor() {
    this.isInitialized = false
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '421846493835-dtr9vku1qtrin2stgglsf6lffrno5tl0.apps.googleusercontent.com'
    this.tokenClient = null
  }

  async initialize() {
    if (this.isInitialized) return

    return new Promise((resolve, reject) => {
      const checkGoogleLoaded = () => {
        if (window.google && window.google.accounts) {
          // Initialize OAuth2 popup flow instead of One Tap
          this.tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: this.clientId,
            scope: 'openid email profile',
            callback: (response) => {
              if (response.error) {
                console.error('Google OAuth error:', response.error)
                return
              }
              // Token will be handled by the calling code
            }
          })
          
          this.isInitialized = true
          resolve()
        } else {
          setTimeout(checkGoogleLoaded, 100)
        }
      }
      
      // Start checking if Google is loaded
      checkGoogleLoaded()
      
      // Timeout after 10 seconds
      setTimeout(() => {
        if (!this.isInitialized) {
          reject(new Error('Google Sign-In failed to load'))
        }
      }, 10000)
    })
  }

  async signInWithPopup() {
    await this.initialize()
    
    return new Promise((resolve, reject) => {
      // Use popup-based OAuth flow
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${this.clientId}&` +
        `response_type=code&` +
        `scope=openid email profile&` +
        `redirect_uri=${encodeURIComponent('postmessage')}&` +
        `state=${Date.now()}`

      const popup = window.open(
        authUrl,
        'google-signin',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      )

      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed)
          reject(new Error('User closed the popup'))
        }
      }, 1000)

      // Listen for message from popup
      const messageListener = (event) => {
        if (event.origin !== window.location.origin) return
        
        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          clearInterval(checkClosed)
          window.removeEventListener('message', messageListener)
          popup.close()
          resolve(event.data.credential)
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          clearInterval(checkClosed)
          window.removeEventListener('message', messageListener)
          popup.close()
          reject(new Error(event.data.error || 'Google authentication failed'))
        }
      }

      window.addEventListener('message', messageListener)
    })
  }

  // Alternative method using Google's ID token flow
  async signInWithGoogle() {
    await this.initialize()
    
    return new Promise((resolve, reject) => {
      // Use the simpler approach with Google's sign-in button
      const tempDiv = document.createElement('div')
      tempDiv.style.display = 'none'
      document.body.appendChild(tempDiv)

      window.google.accounts.id.initialize({
        client_id: this.clientId,
        callback: (response) => {
          document.body.removeChild(tempDiv)
          if (response.credential) {
            resolve(response.credential)
          } else {
            reject(new Error('No credential received from Google'))
          }
        }
      })

      window.google.accounts.id.renderButton(tempDiv, {
        theme: 'outline',
        size: 'large',
        type: 'standard'
      })

      // Programmatically click the button
      setTimeout(() => {
        const button = tempDiv.querySelector('div[role="button"]')
        if (button) {
          button.click()
        } else {
          document.body.removeChild(tempDiv)
          reject(new Error('Could not render Google sign-in button'))
        }
      }, 100)
    })
  }

  // Main sign-in method that tries Google's ID flow first
  async signIn() {
    try {
      return await this.signInWithGoogle()
    } catch (error) {
      console.warn('Google ID sign-in failed, trying popup:', error)
      return await this.signInWithPopup()
    }
  }

  async signOut() {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.disableAutoSelect()
    }
  }

  renderButton(element, options = {}) {
    if (!this.isInitialized) {
      throw new Error('Google Auth not initialized')
    }

    const defaultOptions = {
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'rectangular',
      type: 'standard',
      ...options
    }

    window.google.accounts.id.initialize({
      client_id: this.clientId,
      callback: options.callback || (() => {})
    })

    window.google.accounts.id.renderButton(element, defaultOptions)
  }
}

export const googleAuthService = new GoogleAuthService()