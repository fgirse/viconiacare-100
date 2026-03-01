'use client'

import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'

export interface AuthUser {
  userId:    string
  email:     string
  firstName: string
  lastName:  string
  role:      string
  patientId?: string
}

interface AuthState {
  user:    AuthUser | null
  loading: boolean
  error:   string | null
}

interface AuthContext extends AuthState {
  login:  (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  refetch: () => void
}

const AuthCtx = createContext<AuthContext | null>(null)

export function useAuth(): AuthContext {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function useAuthState(): AuthState & {
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  refetch: () => void
} {
  const [user,    setUser]    = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)
  const router = useRouter()

  const fetchMe = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchMe() }, [fetchMe])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setError(null)
    try {
      const res = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Login fehlgeschlagen'); return false }
      setUser(data.user)
      return true
    } catch {
      setError('Verbindungsfehler. Bitte versuchen Sie es erneut.')
      return false
    }
  }, [])

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/de/login')
  }, [router])

  return { user, loading, error, login, logout, refetch: fetchMe }
}

export { AuthCtx }