import React, { useState, useEffect, createContext, useContext } from 'react'
import { api } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    // If no context, create a local auth state
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const token = localStorage.getItem('token')
          if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            const response = await api.get('/auth/me')
            setUser(response.data.data)
          }
        } catch (error) {
          localStorage.removeItem('token')
          delete api.defaults.headers.common['Authorization']
        } finally {
          setLoading(false)
        }
      }

      checkAuth()
    }, [])

    const login = async (email, password) => {
      try {
        const response = await api.post('/auth/login', { email, password })
        const { user, token } = response.data.data
        
        localStorage.setItem('token', token)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        setUser(user)
        
        return { success: true, user }
      } catch (error) {
        return { 
          success: false, 
          error: error.response?.data?.message || 'Login failed' 
        }
      }
    }

    const logout = () => {
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
      setUser(null)
    }

    return {
      user,
      loading,
      isAuthenticated: !!user,
      login,
      logout
    }
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const auth = useAuth()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}