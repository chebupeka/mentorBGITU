import { useMemo, useState } from 'react'
import { Search, ChevronRight, ChevronLeft, ChevronDown, X, Calendar, Clock } from 'lucide-react'
import Shell from '../components/Shell.jsx'
import { mentors, directions } from '../data/mentors.js'
import heroMentors from '../../media/secondpage.png'
import SuccessCheck from '../components/SuccessCheck.jsx'

function initials(name) {
  const p = name.split(' ')
  return ((p[0]?.[0] || '') + (p[1]?.[0] || '')).toUpperCase()
}

export default function Mentors() {
  const [filter, setFilter] = useState('Все')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [success, setSuccess] = useState(false)
  const [comment, setComment] = useState('')

  const list = useMemo(() => {
    return mentors.filter((m) => {
      const byDir = filter === 'Все' || m.direction === filter
      const q = query.trim().toLowerCase()
      const byQuery =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.stack.toLowerCase().includes(q) ||
        m.direction.toLowerCase().includes(q)
      return byDir && byQuery
    })
  }, [filter, query])

  function openModal(m) {
    setSelected(m)
    setComment('')
    setSuccess(false)
  }
  function submit() {
    setSuccess(true)
  }
  function closeAll() {
    setSelected(null)
    setSuccess(false)
  }

  return (
    <>
      <Shell authed>
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-ink">Менторы</h1>
            <p className="mt-2 max-w-md text-sm text-muted">
              Выберите наставника и получите помощь от специалистов из своего университета.
            </p>
          </div>
          <img src={heroMentors} alt="" className="hidden object-contain md:block md:w-[420px] lg:w-[520px]" />
        </div>

        {/* Search */}
        <div className="relative mt-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по имени, навыкам или направлению..."
            className="field py-3 pl-11"
          />
        </div>

        {/* Filters */}
        <div className="mt-5 flex flex-wrap gap-2">
          {directions.map((d) => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                filter === d
                  ? 'bg-brand text-white'
                  : 'border border-line bg-white text-ink/80 hover:bg-slate-50'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          {list.map((m) => (
            <div key={m.id} className="card p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-base font-semibold text-white">
                    {initials(m.name)}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-ink">{m.name}</h3>
                    <p className="text-sm text-muted">{m.role}</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-300" />
              </div>

              <p className="mt-4 text-sm text-ink/80">{m.stack}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {m.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <button onClick={() => openModal(m)} className="btn-primary mt-5 w-full py-2.5">
                Записаться
              </button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-9 flex items-center justify-center gap-2">
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-white text-muted hover:bg-slate-50">
            <ChevronLeft size={18} />
          </button>
          {['1', '2', '3'].map((n, i) => (
            <button
              key={n}
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium ${
                i === 0 ? 'bg-brand text-white' : 'border border-line bg-white text-ink/80 hover:bg-slate-50'
              }`}
            >
              {n}
            </button>
          ))}
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-white text-muted hover:bg-slate-50">
            <ChevronRight size={18} />
          </button>
        </div>
      </Shell>

      {/* Booking modal */}
      {selected && !success && (
        <Overlay onClose={closeAll}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-card">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-bold text-ink">Запись на консультацию</h2>
              <button onClick={closeAll} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 p-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
                {initials(selected.name)}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-ink">{selected.name}</h3>
                <p className="text-xs text-muted">{selected.role}</p>
                <p className="text-xs text-brand">{selected.stack}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <label className="label">Дата</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select className="field appearance-none pl-9 pr-9">
                    <option>25 июня 2026</option>
                    <option>26 июня 2026</option>
                    <option>27 июня 2026</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
              <div>
                <label className="label">Время</label>
                <div className="relative">
                  <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select className="field appearance-none pl-9 pr-9">
                    <option>18:00</option>
                    <option>19:00</option>
                    <option>20:00</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="label">Комментарий (необязательно)</label>
              <textarea
                value={comment}
                maxLength={200}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Напишите, с чем вам нужна помощь..."
                rows={3}
                className="field resize-none"
              />
              <div className="mt-1 text-right text-xs text-muted">{comment.length}/200</div>
            </div>

            <div className="mt-5 flex gap-3">
              <button onClick={closeAll} className="btn-ghost flex-1 py-2.5">Отмена</button>
              <button onClick={submit} className="btn-primary flex-1 py-2.5">Записаться</button>
            </div>
          </div>
        </Overlay>
      )}

      {/* Success modal */}
      {success && (
        <Overlay onClose={closeAll}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-card">
            <div className="mx-auto flex h-16 w-16 items-center justify-center">
              <SuccessCheck size={64} />
            </div>
            <h2 className="mt-5 text-lg font-bold text-ink">Вы успешно записаны!</h2>
            <p className="mt-2 text-sm text-muted">
              Наставник получил вашу заявку и свяжется с вами в ближайшее время.
            </p>
            <button onClick={closeAll} className="btn-primary mt-6 w-full py-2.5">
              Понятно
            </button>
          </div>
        </Overlay>
      )}
    </>
  )
}

function Overlay({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  )
}
