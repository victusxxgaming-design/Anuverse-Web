import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ReactNode } from 'react'
import RouteSpinner from './RouteSpinner'

/**
 * Guards a route for admin users only.
 *
 * user === null                   → show spinner
 * user === false                  → redirect to /
 * user.role !== "admin"           → redirect to /
 * user is AuthUser with admin role → render children
 */
export default function AdminRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  if (user === null) return <RouteSpinner />

  if (user === false || user.role !== 'admin') return <Navigate to="/" replace />

  return <>{children}</>
}
