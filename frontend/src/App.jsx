import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Auth from './pages/Auth.jsx'
import Reg from './pages/Reg.jsx'
import Profile from './pages/Profile.jsx'
import Mentors from './pages/Mentors.jsx'
import Knowledge from './pages/Knowledge.jsx'
import RequireAuth from './auth/RequireAuth.jsx'
import { Navigate } from 'react-router-dom'
import { useAuth } from './auth/AuthContext.jsx'

// Доступ только студентам: ментора уводим в его кабинет
function StudentOnly({ children }) {
  const { user } = useAuth()
  if (user?.mentor_id) return <Navigate to="/profile" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Reg />} />
      <Route
        path="/profile"
        element={
          <RequireAuth>
            <Profile />
          </RequireAuth>
        }
      />
      <Route
        path="/mentors"
        element={
          <RequireAuth>
            <StudentOnly>
              <Mentors />
            </StudentOnly>
          </RequireAuth>
        }
      />
      <Route
        path="/knowledge"
        element={
          <RequireAuth>
            <Knowledge />
          </RequireAuth>
        }
      />
    </Routes>
  )
}
