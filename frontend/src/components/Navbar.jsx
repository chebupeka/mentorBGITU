import { Link, NavLink, useNavigate } from 'react-router-dom'
import Logo from './Logo.jsx'
import { useAuth } from '../auth/AuthContext.jsx'
import { useToast } from './Toast.jsx'

const nav = [
  { to: '/', label: 'Главная' },
  { to: '/mentors', label: 'Менторы' },
  { to: '/knowledge', label: 'База знаний' },
]

function displayName(user) {
  const name = [user?.first_name, user?.last_name].filter(Boolean).join(' ')
  return name || user?.email || 'Профиль'
}

function initial(user) {
  return (user?.first_name?.[0] || user?.email?.[0] || '?').toUpperCase()
}

export default function Navbar() {
  const { isAuthed, user, logout } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  function onLogout() {
    logout()
    toast.success('Вы вышли из аккаунта')
    navigate('/login')
  }

  const content = (
    <>
      <Link to="/" className="flex items-center gap-2.5">
        <Logo size={36} />
        <span className="text-[15px] font-bold text-ink">MentorBGITU</span>
      </Link>

      <nav className="hidden items-center gap-9 md:flex">
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive ? 'text-brand' : 'text-ink/80 hover:text-brand'
              }`
            }
            end={n.to === '/'}
          >
            {n.label}
          </NavLink>
        ))}
      </nav>

      {isAuthed ? (
        <div className="flex items-center gap-3">
          <Link to="/profile" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
              {initial(user)}
            </span>
            <span className="hidden text-sm font-medium text-ink sm:inline">
              {displayName(user)}
            </span>
          </Link>
          <button
            onClick={onLogout}
            className="text-sm font-medium text-muted transition hover:text-brand"
          >
            Выйти
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link to="/login" className="btn-ghost">Войти</Link>
          <Link to="/register" className="btn-primary">Регистрация</Link>
        </div>
      )}
    </>
  )

  return (
    <div className="container-page pt-5">
      <header className="rounded-2xl border border-line bg-white shadow-soft">
        <div className="flex h-[68px] items-center justify-between px-6">{content}</div>
      </header>
    </div>
  )
}
