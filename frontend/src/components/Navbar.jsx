import { Link, NavLink } from 'react-router-dom'
import Logo from './Logo.jsx'

const nav = [
  { to: '/', label: 'Главная' },
  { to: '/mentors', label: 'Менторы' },
  { to: '/knowledge', label: 'База знаний' },
]

export default function Navbar({ authed = true }) {
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

      {authed ? (
        <Link to="/profile" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
            Л
          </span>
          <span className="text-sm font-medium text-ink">Леонид</span>
        </Link>
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
