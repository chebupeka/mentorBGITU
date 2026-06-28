import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import Logo from '../components/Logo.jsx'
import AuthBackground from '../components/AuthBackground.jsx'
import { useAuth } from '../auth/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'
import ThemeToggle from '../theme/ThemeToggle.jsx'

export default function Auth() {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/profile'

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(email, password)
      toast.success('С возвращением!')
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas px-4 py-12">
      <AuthBackground />
      <ThemeToggle floating />
      <div className="card relative z-10 w-full max-w-md p-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex items-center gap-2">
            <Logo size={34} />
            <span className="text-[15px] font-bold text-ink">MentorBGITU</span>
          </div>
          <h1 className="text-xl font-bold text-ink">Вход в аккаунт</h1>
          <p className="mt-1 text-sm text-muted">
            Добро пожаловать! Введите свои данные для входа.
          </p>
        </div>

        <form className="mt-7 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.bgitu.ru"
              className="field"
            />
          </div>
          <div>
            <label className="label">Пароль</label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="field pr-10"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Показать пароль"
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={busy} className="btn-primary w-full py-3 disabled:opacity-60">
            {busy ? 'Вход…' : 'Войти'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          Нет аккаунта?{' '}
          <Link to="/register" className="font-medium text-brand hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  )
}
