// Базовый адрес API. Можно переопределить через .env: VITE_API_URL=...
export const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// JSON-запрос с опциональным Bearer-токеном.
export async function apiFetch(path, { token, body, headers = {}, ...opts } = {}) {
  const h = { ...headers }
  let payload = body
  if (body !== undefined && !(body instanceof URLSearchParams)) {
    h['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }
  if (body instanceof URLSearchParams) {
    h['Content-Type'] = 'application/x-www-form-urlencoded'
    payload = body
  }
  if (token) h['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, { ...opts, headers: h, body: payload })

  if (!res.ok) {
    let detail
    try {
      detail = (await res.json())?.detail
    } catch {
      /* нет тела */
    }
    throw new Error(detail || `Ошибка запроса (${res.status})`)
  }
  if (res.status === 204) return null
  return res.json()
}
