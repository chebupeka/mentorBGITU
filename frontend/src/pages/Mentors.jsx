import { useMemo, useState } from 'react'
import { Search, ChevronRight, ChevronLeft, ChevronDown, X, Clock } from 'lucide-react'
import Shell from '../components/Shell.jsx'
import SuccessCheck from '../components/SuccessCheck.jsx'
import { MentorCardSkeleton } from '../components/Skeleton.jsx'
import { useToast } from '../components/Toast.jsx'
import heroMentors from '../../media/secondpage.png'
import { apiFetch } from '../lib/api.js'
import { useApiData, formatDate, initials } from '../lib/useApi.js'
import { useAuth } from '../auth/AuthContext.jsx'

const directions = ['Все', 'Frontend', 'Backend', 'Python', 'C++', '1С', 'DevOps']
const PAGE_SIZE = 6

export default function Mentors() {
  const [filter, setFilter] = useState('Все')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)
  const [success, setSuccess] = useState(false)

  // Серверный запрос со всеми параметрами
  const path = useMemo(() => {
    const p = new URLSearchParams({ page: String(page), size: String(PAGE_SIZE) })
    if (query.trim()) p.set('search', query.trim())
    if (filter !== 'Все') p.set('direction', filter)
    return `/mentors/?${p.toString()}`
  }, [page, query, filter])

  const { data, loading, error, reload } = useApiData(path)
  const items = data?.items ?? []
  const total = data?.total ?? 0
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  function changeFilter(d) {
    setFilter(d)
    setPage(1)
  }
  function changeQuery(v) {
    setQuery(v)
    setPage(1)
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
            onChange={(e) => changeQuery(e.target.value)}
            placeholder="Поиск по имени, навыкам или направлению..."
            className="field py-3 pl-11"
          />
        </div>

        {/* Filters */}
        <div className="mt-5 flex flex-wrap gap-2">
          {directions.map((d) => (
            <button
              key={d}
              onClick={() => changeFilter(d)}
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
        {loading ? (
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <MentorCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <p className="mt-8 text-sm text-red-600">Не удалось загрузить менторов: {error.message}</p>
        ) : items.length === 0 ? (
          <p className="mt-8 text-sm text-muted">По вашему запросу никого не нашлось.</p>
        ) : (
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            {items.map((m, i) => (
              <div
                key={m.id}
                className="card anim-card p-6 transition hover:-translate-y-0.5 hover:shadow-card"
                style={{ animationDelay: `${i * 60}ms` }}
              >
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
                  {(m.tags || []).map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setSelected(m)
                    setSuccess(false)
                  }}
                  className="btn-primary mt-5 w-full py-2.5"
                >
                  Записаться
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="mt-9 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-white text-muted hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium ${
                  n === page ? 'bg-brand text-white' : 'border border-line bg-white text-ink/80 hover:bg-slate-50'
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-white text-muted hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </Shell>

      {/* Booking modal */}
      {selected && !success && (
        <BookingModal
          mentor={selected}
          onClose={() => setSelected(null)}
          onSuccess={() => {
            setSuccess(true)
            reload()
          }}
        />
      )}

      {/* Success modal */}
      {success && (
        <Overlay onClose={() => { setSuccess(false); setSelected(null) }}>
          <div className="anim-modal w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-card">
            <div className="mx-auto flex h-16 w-16 items-center justify-center">
              <SuccessCheck size={64} />
            </div>
            <h2 className="mt-5 text-lg font-bold text-ink">Вы успешно записаны!</h2>
            <p className="mt-2 text-sm text-muted">
              Наставник получил вашу заявку и свяжется с вами в ближайшее время.
            </p>
            <button
              onClick={() => { setSuccess(false); setSelected(null) }}
              className="btn-primary mt-6 w-full py-2.5"
            >
              Понятно
            </button>
          </div>
        </Overlay>
      )}
    </>
  )
}

function BookingModal({ mentor, onClose, onSuccess }) {
  const { token } = useAuth()
  const toast = useToast()
  const { data: slots, loading } = useApiData(`/mentors/${mentor.id}/slots?only_free=true`)
  const [slotId, setSlotId] = useState('')
  const [format, setFormat] = useState('Яндекс Телемост')
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit() {
    setError('')
    if (!slotId) {
      setError('Выберите дату и время')
      return
    }
    setBusy(true)
    try {
      await apiFetch('/bookings/', {
        method: 'POST',
        token,
        body: {
          mentor_id: mentor.id,
          slot_id: Number(slotId),
          format,
          comment: comment || null,
        },
      })
      toast.success('Вы записаны на консультацию!')
      onSuccess()
    } catch (e) {
      setError(e.message)
      toast.error(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Overlay onClose={onClose}>
      <div className="anim-modal w-full max-w-lg rounded-2xl bg-white p-6 shadow-card">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-bold text-ink">Запись на консультацию</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 p-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
            {initials(mentor.name)}
          </span>
          <div>
            <h3 className="text-sm font-semibold text-ink">{mentor.name}</h3>
            <p className="text-xs text-muted">{mentor.role}</p>
            <p className="text-xs text-brand">{mentor.stack}</p>
          </div>
        </div>

        <div className="mt-5">
          <label className="label">Свободное время</label>
          <div className="relative">
            <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={slotId}
              onChange={(e) => setSlotId(e.target.value)}
              disabled={loading}
              className="field appearance-none pl-9 pr-9"
            >
              <option value="">
                {loading ? 'Загрузка слотов…' : 'Выберите дату и время'}
              </option>
              {(slots || []).map((s) => (
                <option key={s.id} value={s.id}>
                  {formatDate(s.date)} — {s.time}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          {!loading && (slots || []).length === 0 && (
            <p className="mt-1 text-xs text-muted">У наставника пока нет свободных слотов.</p>
          )}
        </div>

        <div className="mt-4">
          <label className="label">Формат</label>
          <div className="relative">
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="field appearance-none pr-9"
            >
              <option>Яндекс Телемост</option>
              <option>Google Meet</option>
              <option>Очно</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
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

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-5 flex gap-3">
          <button onClick={onClose} className="btn-ghost flex-1 py-2.5">Отмена</button>
          <button
            onClick={submit}
            disabled={busy}
            className="btn-primary flex-1 py-2.5 disabled:opacity-60"
          >
            {busy ? 'Записываем…' : 'Записаться'}
          </button>
        </div>
      </div>
    </Overlay>
  )
}

function Overlay({ children, onClose }) {
  return (
    <div
      className="anim-overlay fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  )
}
