import { useState, useEffect } from "react"
import Cookies from 'js-cookie'

import { AuthContext } from './AuthContext';
import { registerRequest, loginRequest, verifyTokenRequest } from '../api/auth'

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [errors, setErrors] = useState([])
    const [loading, setLoading] = useState(true)
    const [failLogin, setFailLogin] = useState(0)

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
            // console.log('register', res.data)
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
            // console.log('login', res.data)
            setUser(res.data)
            setIsAuthenticated(true)
            setErrors([])
        } catch (error) {
            if (Array.isArray(error.response.data) && error.response.data.length > 0) {
                // console.log('error Singin', error.response.data)
                setErrors(error.response.data)
            } else if (error.response.data.failLogin) {
                const message = error.response.data.message
                const failLogin = error.response.data.failLogin
                // console.log('failLogin', message, failLogin)
                setErrors([message])
                setFailLogin(failLogin)
            }
        }
    }

    const logout = () => {
        Cookies.remove("token")
        setIsAuthenticated(false)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ signup, signin, logout, setLoading, loading, user, isAuthenticated, errors, failLogin }}>
            {children}
        </AuthContext.Provider>
    )
}