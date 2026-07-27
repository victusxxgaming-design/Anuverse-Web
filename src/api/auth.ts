import { AuthUser } from '../context/AuthContext'

const BASE = '/api/auth'

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.detail ?? `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

export async function apiLogin(email: string, password: string): Promise<AuthUser> {
  const res = await fetch(`${BASE}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await handleResponse<{ user: AuthUser }>(res)
  return data.user
}

export async function apiRegister(
  name: string,
  email: string,
  password: string,
): Promise<AuthUser> {
  const res = await fetch(`${BASE}/register`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
  const data = await handleResponse<{ user: AuthUser }>(res)
  return data.user
}

export async function apiLogout(): Promise<void> {
  await fetch(`${BASE}/logout`, { method: 'POST', credentials: 'include' })
}

export async function apiMe(): Promise<AuthUser | false> {
  const res = await fetch(`${BASE}/me`, { credentials: 'include' })
  if (res.status === 401 || res.status === 403) return false
  if (!res.ok) return false
  const data = await res.json() as { user: AuthUser }
  return data.user
}
