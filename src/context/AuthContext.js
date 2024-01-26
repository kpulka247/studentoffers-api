import React, {createContext, useState, useEffect} from "react"
import jwt_decode from "jwt-decode"
import {useNavigate} from "react-router-dom"


const AuthContext = createContext()

export default AuthContext

export const AuthProvider = ({children}) => {

    const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    const [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    const loginUser = async (e) => {
        // console.log('Login called!')
        e.preventDefault()
        const response = await fetch(`/api/token/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'username': e.target.username.value, 'password': e.target.password.value})
        })
        const data = await response.json()

        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
            navigate('/')
        } else {
            alert('Niepoprawna nazwa użytkownika lub hasło!')
        }
    }

    const logoutUser = () => {
        // console.log('Logout called!')
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('offerType')
        localStorage.removeItem('authTokens')
        navigate('/login')
    }

    const updateToken = async () => {
        // console.log('Refresh token called!')
        const response = await fetch(`/api/token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'refresh': authTokens?.refresh})
        })
        const data = await response.json()

        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
            // console.log('Refresh token succeeded!')
        } else {
            logoutUser()
        }

        if (loading) {
            setLoading(false)
        }
    }

    const contextData = {
        user: user,
        authTokens: authTokens,
        loginUser: loginUser,
        logoutUser: logoutUser
    }

    useEffect(() => {

        if (loading) {
            updateToken()
        }

        const fourMinutes = 1000 * 70 * 4
        const interval = setInterval(() => {
            if (authTokens) {
                updateToken()
            }
        }, fourMinutes)
        return () => clearInterval(interval)
    }, [authTokens, loading])

    return (
        <AuthContext.Provider
            value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}