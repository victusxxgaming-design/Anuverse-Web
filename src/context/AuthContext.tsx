import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { apiLogin, apiRegister, apiLogout, apiMe } from '../api/auth'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  created_at: string
}

/**
 * Three-state user value:
 *   null       — auth check still in flight (loading)
 *   false      — auth check complete, no session (logged out)
 *   AuthUser   — authenticated
 */
export type AuthState = AuthUser | null | false

interface AuthContextValue {
  user: AuthState

  /** Sign in with email + password. Sets user on success, throws on failure. */
  login: (email: string, password: string) => Promise<void>

  /** Create account. Sets user on success, throws on failure. */
  register: (name: string, email: string, password: string) => Promise<void>

  /** Sign out. Always sets user to false. */
  logout: () => Promise<void>

  /** Redirect to Google OAuth (backend-handled). */
  loginWithGoogle: () => void

  /** Redirect to Discord OAuth (backend-handled). */
  loginWithDiscord: () => void

  /** Re-fetch /api/auth/me and update user state. */
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthState>(null)   // null = loading

  const refresh = useCallback(async () => {
    setUser(null)
    const result = await apiMe()
    setUser(result)   // AuthUser or false
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const login = useCallback(async (email: string, password: string) => {
    const authUser = await apiLogin(email, password)
    setUser(authUser)
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const authUser = await apiRegister(name, email, password)
    setUser(authUser)
  }, [])

  const logout = useCallback(async () => {
    await apiLogout()
    setUser(false)
  }, [])

  /** Redirect to the backend OAuth initiation route — backend handles everything. */
  const loginWithGoogle = useCallback(() => {
    window.location.href = '/api/auth/google'
  }, [])

  const loginWithDiscord = useCallback(() => {
    window.location.href = '/api/auth/discord'
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loginWithGoogle, loginWithDiscord, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
