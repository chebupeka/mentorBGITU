import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'

// Оборачивает приватные страницы: без токена — редирект на /login.
export default function RequireAuth({ children }) {
  const { isAuthed, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas text-muted">
        Загрузка…
      </div>
    )
  }
  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}
