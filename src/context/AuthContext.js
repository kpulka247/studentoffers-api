import React, {createContext, useState, useEffect} from 'react'
import jwt_decode from 'jwt-decode'
import {useNavigate} from 'react-router-dom'
import {useTranslation} from 'react-i18next'


const AuthContext = createContext()

export default AuthContext

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem('authTokens')
      ? JSON.parse(localStorage.getItem('authTokens'))
      : null
  )
  const [user, setUser] = useState(() =>
    localStorage.getItem('authTokens')
      ? jwt_decode(localStorage.getItem('authTokens'))
      : null
  )
  const [loading, setLoading] = useState(true)

  const [t] = useTranslation()
  const navigate = useNavigate()

  const loginUser = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: e.target.username.value,
          password: e.target.password.value,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setAuthTokens(data)
        setUser(jwt_decode(data.access))
        localStorage.setItem('authTokens', JSON.stringify(data))
        navigate('/')
      } else {
        alert(t('login.incorrect'))
      }
    } catch (error) {
      console.error('Error during login:', error)
      alert(t('login.error'))
    }
  }

  const logoutUser = () => {
    setAuthTokens(null)
    setUser(null)
    localStorage.removeItem('offerType')
    localStorage.removeItem('authTokens')
    navigate('/login')
  }

  const updateToken = async () => {
    if (authTokens?.refresh) {
      try {
        const response = await fetch(`/api/token/refresh/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh: authTokens.refresh }),
        })

        const data = await response.json()

        if (response.ok) {
          setAuthTokens(data)
          setUser(jwt_decode(data.access))
          localStorage.setItem('authTokens', JSON.stringify(data))
        } else {
          logoutUser()
        }
      } catch (error) {
        console.error('Error during token refresh:', error)
        logoutUser()
      }
    }
  }

  useEffect(() => {
    updateToken()
  }, [])

  useEffect(() => {
    const fourMinutes = 1000 * 60 * 30
    const interval = setInterval(updateToken, fourMinutes)

    return () => clearInterval(interval)
  }, [authTokens])

  useEffect(() => {
    if (loading) {
      setLoading(false)
    }
  }, [loading])

  const contextData = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser
  }

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  )
}