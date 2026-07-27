import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ReactNode } from 'react'
import RouteSpinner from './RouteSpinner'

/**
 * Guards a route for authenticated users only.
 *
 * user === null  (loading)      → show spinner
 * user === false (not logged in) → redirect to /
 * user is AuthUser               → render children
 */
export default function PrivateRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  if (user === null) return <RouteSpinner />

  if (user === false) return <Navigate to="/" replace />

  return <>{children}</>
}
