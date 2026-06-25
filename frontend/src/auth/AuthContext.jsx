import { createContext, useContext, useEffect, useState } from 'react'
import { apiFetch } from '../lib/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // При наличии токена подтягиваем профиль (/auth/me).
  useEffect(() => {
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }
    let active = true
    setLoading(true)
    apiFetch('/auth/me', { token })
      .then((u) => active && setUser(u))
      .catch(() => {
        // токен протух/невалиден — сбрасываем
        localStorage.removeItem('token')
        if (active) setToken(null)
      })
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [token])

  function saveToken(t) {
    localStorage.setItem('token', t)
    setToken(t)
  }

  async function login(email, password) {
    const body = new URLSearchParams({ username: email, password })
    const data = await apiFetch('/auth/login', { method: 'POST', body })
    saveToken(data.access_token)
  }

  async function register(payload) {
    const data = await apiFetch('/auth/register', { method: 'POST', body: payload })
    saveToken(data.access_token)
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const value = { token, user, loading, isAuthed: !!token, login, register, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth должен использоваться внутри <AuthProvider>')
  return ctx
}
