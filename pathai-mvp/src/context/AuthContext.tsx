'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'

export interface User {
  id: string
  name: string
  trade: string
  state: string
  district: string
  language: string
  email: string
  created_at: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => Promise<void>
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
        if (data.user) {
          localStorage.setItem('pathai_user_id', data.user.id)
          localStorage.setItem('pathai_user', JSON.stringify(data.user))
        } else {
          localStorage.removeItem('pathai_user_id')
          localStorage.removeItem('pathai_user')
        }
      }
    } catch (err) {
      console.error('Error fetching current user:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || 'Login failed')
    }
    setUser(data.user)
    localStorage.setItem('pathai_user_id', data.user.id)
    localStorage.setItem('pathai_user', JSON.stringify(data.user))
  }

  const register = async (userData: any) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed')
    }
    setUser(data.user)
    localStorage.setItem('pathai_user_id', data.user.id)
    localStorage.setItem('pathai_user', JSON.stringify(data.user))
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    localStorage.removeItem('pathai_user_id')
    localStorage.removeItem('pathai_user')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
