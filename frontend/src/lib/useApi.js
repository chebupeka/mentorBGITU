import { useEffect, useState } from 'react'
import { apiFetch } from './api.js'
import { useAuth } from '../auth/AuthContext.jsx'

// Простой хук загрузки данных с API.
// auth=true — добавит Bearer-токен. Возвращает { data, error, loading, reload }.
export function useApiData(path, { auth = false } = {}) {
  const { token } = useAuth()
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    apiFetch(path, auth ? { token } : {})
      .then((d) => active && setData(d))
      .catch((e) => active && setError(e))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, auth, token, tick])

  return { data, error, loading, reload: () => setTick((t) => t + 1) }
}

const MONTHS = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
]

// "2026-06-27" -> "27 июня 2026"
export function formatDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} ${MONTHS[m - 1]} ${y}`
}

export function initials(name = '') {
  const p = name.trim().split(/\s+/)
  return ((p[0]?.[0] || '') + (p[1]?.[0] || '')).toUpperCase()
}
