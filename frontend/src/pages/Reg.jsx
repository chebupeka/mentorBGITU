import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import Logo from '../components/Logo.jsx'

export default function Reg() {
  const [show1, setShow1] = useState(false)
  const [show2, setShow2] = useState(false)
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 py-12">
      <div className="card w-full max-w-md p-8">
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

        <form className="mt-7 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Имя</label>
              <input className="field" placeholder="Иван" />
            </div>
            <div>
              <label className="label">Фамилия</label>
              <input className="field" placeholder="Иванов" />
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" placeholder="your@email.bgitu.ru" className="field" />
          </div>
          <div>
            <label className="label">Пароль</label>
            <div className="relative">
              <input
                type={show1 ? 'text' : 'password'}
                placeholder="••••••••••••"
                className="field pr-10"
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
                placeholder="••••••••••••"
                className="field pr-10"
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
          <button type="submit" className="btn-primary w-full py-3">Зарегистрироваться</button>
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
