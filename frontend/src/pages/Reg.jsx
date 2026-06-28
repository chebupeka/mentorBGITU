import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import Logo from '../components/Logo.jsx'
import AuthBackground from '../components/AuthBackground.jsx'
import { useAuth } from '../auth/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'
import ThemeToggle from '../theme/ThemeToggle.jsx'

export default function Reg() {
  const [show1, setShow1] = useState(false)
  const [show2, setShow2] = useState(false)
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm: '',
  })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const { register } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const upd = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Пароли не совпадают')
      return
    }
    if (form.password.length < 6) {
      setError('Пароль должен быть не короче 6 символов')
      return
    }
    setBusy(true)
    try {
      await register({
        first_name: form.first_name || null,
        last_name: form.last_name || null,
        email: form.email,
        password: form.password,
      })
      toast.success('Аккаунт создан. Добро пожаловать!')
      navigate('/profile', { replace: true })
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
          <h1 className="text-xl font-bold text-ink">Регистрация</h1>
          <p className="mt-1 text-sm text-muted">
            Создайте аккаунт, чтобы найти наставника и записаться на консультацию.
          </p>
        </div>

        <form className="mt-7 space-y-4" onSubmit={onSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Имя</label>
              <input
                className="field"
                placeholder="Иван"
                value={form.first_name}
                onChange={upd('first_name')}
              />
            </div>
            <div>
              <label className="label">Фамилия</label>
              <input
                className="field"
                placeholder="Иванов"
                value={form.last_name}
                onChange={upd('last_name')}
              />
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              required
              placeholder="your@email.bgitu.ru"
              className="field"
              value={form.email}
              onChange={upd('email')}
            />
          </div>
          <div>
            <label className="label">Пароль</label>
            <div className="relative">
              <input
                type={show1 ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                className="field pr-10"
                value={form.password}
                onChange={upd('password')}
              />
              <button
                type="button"
                onClick={() => setShow1((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Показать пароль"
              >
                {show1 ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="label">Подтвердите пароль</label>
            <div className="relative">
              <input
                type={show2 ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                className="field pr-10"
                value={form.confirm}
                onChange={upd('confirm')}
              />
              <button
                type="button"
                onClick={() => setShow2((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Показать пароль"
              >
                {show2 ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={busy} className="btn-primary w-full py-3 disabled:opacity-60">
            {busy ? 'Создаём аккаунт…' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="font-medium text-brand hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}
