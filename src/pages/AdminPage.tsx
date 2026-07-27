import { useAuth } from '../context/AuthContext'
import type { AuthUser } from '../context/AuthContext'

export default function AdminPage() {
  const { user } = useAuth()
  const u = user ? (user as AuthUser) : null

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-white px-6">
      <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
      <p className="text-gray-400">Logged in as {u?.email} (role: {u?.role}).</p>
    </main>
  )
}
