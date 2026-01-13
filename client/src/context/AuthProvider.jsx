import { useState, useEffect } from "react"
import { registerRequest, loginRequest, verifyTokenRequest } from '../api/auth'
import { AuthContext } from './AuthContext';
import Cookies from 'js-cookie'

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [errors, setErrors] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([])
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [errors])

    useEffect(() => {
        async function checkLogin() {
            const cookies = Cookies.get()
            
            if (!cookies.token) {
                setUser(null)
                setLoading(false)
                setIsAuthenticated(false)
                return
            }

            try {
                const res = await verifyTokenRequest(cookies.token)
                if (!res.data) {
                    setUser(null)
                    setLoading(false)
                    setIsAuthenticated(false)
                    return
                }
                setUser(res.data)
                setLoading(false)
                setIsAuthenticated(true)
                return
            } catch (error) {
                setUser(null)
                setLoading(false)
                setIsAuthenticated(false)
                return
            }
        }
        checkLogin()
    }, [])

    // REGISTER
    const signup = async (user) => {
        try {
            const res = await registerRequest(user)
            // console.log(res.data)
            setUser(res.data)
            setIsAuthenticated(true)
            setErrors([])
        } catch (error) {
            // console.log('error Singup', error.response.data)
            setErrors(error.response.data)
        }
    }

    // LOGIN
    const signin = async (user) => {
        try {
            const res = await loginRequest(user)
            // console.log(res.data)
            setUser(res.data)
            setIsAuthenticated(true)
            setErrors([])
        } catch (error) {
            // console.log('error Singin', error.response.data)
            setErrors(error.response.data)
        }
    }

    const logout = () => {
        Cookies.remove("token")
        setIsAuthenticated(false)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ signup, signin, logout, loading, user, isAuthenticated, errors }}>
            { children }
        </AuthContext.Provider>
    )
}