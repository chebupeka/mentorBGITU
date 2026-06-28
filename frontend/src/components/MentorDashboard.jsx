import { useState } from 'react'
import { Calendar, Clock, Mail, Check, X, MessageSquare, Plus, Trash2 } from 'lucide-react'
import { apiFetch } from '../lib/api.js'
import { useApiData, formatDate, initials } from '../lib/useApi.js'
import { useAuth } from '../auth/AuthContext.jsx'
import { useToast } from './Toast.jsx'
import { StatCardSkeleton } from './Skeleton.jsx'

const STATUS_LABEL = {
  pending: { text: 'Ожидает', cls: 'bg-amber-50 text-amber-600' },
  active: { text: 'Подтверждено', cls: 'bg-emerald-50 text-emerald-600' },
  completed: { text: 'Проведено', cls: 'bg-slate-100 text-slate-500' },
  cancelled: { text: 'Отклонено', cls: 'bg-red-50 text-red-500' },
}

export default function MentorDashboard() {
  const { token } = useAuth()
  const toast = useToast()
  const { data: stats, loading: statsLoading, reload: reloadStats } = useApiData(
    '/mentor/stats',
    { auth: true },
  )
  const { data: bookings, loading, reload } = useApiData('/mentor/bookings', { auth: true })
  const [busyId, setBusyId] = useState(null)

  async function act(id, action) {
    setBusyId(id)
    try {
      await apiFetch(`/mentor/bookings/${id}/${action}`, { method: 'POST', token })
      toast.success(action === 'accept' ? 'Заявка принята' : 'Заявка отклонена')
      reload()
      reloadStats()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setBusyId(null)
    }
  }

  const cards = [
    { value: stats?.pending ?? '—', title: 'Новые заявки', sub: 'Ожидают решения', tint: 'bg-amber-50' },
    { value: stats?.upcoming ?? '—', title: 'Подтверждённые', sub: 'Предстоящие встречи', tint: 'bg-emerald-50' },
    { value: stats?.completed ?? '—', title: 'Проведено', sub: 'Завершённых консультаций', tint: 'bg-brand-50' },
  ]

  const list = bookings || []

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <section className="grid gap-5 md:grid-cols-3">
        {statsLoading
          ? Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)
          : cards.map((c, i) => (
              <div
                key={c.title}
                className="card anim-card flex items-center gap-4 p-6"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${c.tint}`}>
                  <span className="text-lg font-extrabold text-ink">{c.value}</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink">{c.title}</div>
                  <div className="text-xs text-muted">{c.sub}</div>
                </div>
              </div>
            ))}
      </section>

      {/* Schedule */}
      <ScheduleSection />

      {/* Requests */}
      <section>
        <h2 className="text-xl font-bold text-ink">Заявки на консультации</h2>
        <p className="mt-1 text-sm text-muted">
          Принимайте записи и связывайтесь со студентами по почте.
        </p>

        {loading ? (
          <p className="mt-5 text-sm text-muted">Загрузка заявок…</p>
        ) : list.length === 0 ? (
          <div className="card mt-5 p-6 text-sm text-muted">Пока нет заявок.</div>
        ) : (
          <div className="mt-5 space-y-4">
            {list.map((b, i) => {
              const badge = STATUS_LABEL[b.status] || STATUS_LABEL.pending
              const showEmail = b.status === 'active' || b.status === 'pending'
              return (
                <div
                  key={b.id}
                  className="card anim-card p-5"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
                        {initials(b.client_name)}
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold text-ink">{b.client_name}</h3>
                        {showEmail ? (
                          <a
                            href={`mailto:${b.client_email}`}
                            className="flex items-center gap-1.5 text-sm text-brand hover:underline"
                          >
                            <Mail size={14} /> {b.client_email}
                          </a>
                        ) : (
                          <span className="text-xs text-muted">почта скрыта</span>
                        )}
                      </div>
                    </div>
                    <span className={`rounded-md px-2.5 py-1 text-xs font-medium ${badge.cls}`}>
                      {badge.text}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={15} /> {formatDate(b.date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={15} /> {b.time}
                    </span>
                    <span className="flex items-center gap-1.5">{b.format}</span>
                  </div>

                  {b.comment && (
                    <p className="mt-3 flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-ink/80">
                      <MessageSquare size={15} className="mt-0.5 flex-shrink-0 text-slate-400" />
                      {b.comment}
                    </p>
                  )}

                  {b.status === 'pending' && (
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => act(b.id, 'accept')}
                        disabled={busyId === b.id}
                        className="btn-primary flex-1 py-2.5 disabled:opacity-60"
                      >
                        <Check size={16} /> Принять
                      </button>
                      <button
                        onClick={() => act(b.id, 'decline')}
                        disabled={busyId === b.id}
                        className="btn-ghost flex-1 py-2.5 disabled:opacity-60"
                      >
                        <X size={16} /> Отклонить
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

const TIME_OPTIONS = [
  '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
]

function ScheduleSection() {
  const { token } = useAuth()
  const toast = useToast()
  const { data: slots, loading, reload } = useApiData('/mentor/slots', { auth: true })
  const today = new Date().toISOString().slice(0, 10)
  const [date, setDate] = useState(today)
  const [time, setTime] = useState('18:00')
  const [busy, setBusy] = useState(false)
  const [delId, setDelId] = useState(null)

  async function addSlot(e) {
    e.preventDefault()
    setBusy(true)
    try {
      await apiFetch('/mentor/slots', { method: 'POST', token, body: { date, time } })
      toast.success('Слот добавлен')
      reload()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function removeSlot(id) {
    setDelId(id)
    try {
      await apiFetch(`/mentor/slots/${id}`, { method: 'DELETE', token })
      toast.success('Слот удалён')
      reload()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDelId(null)
    }
  }

  const list = slots || []

  return (
    <section>
      <h2 className="text-xl font-bold text-ink">Моё расписание</h2>
      <p className="mt-1 text-sm text-muted">
        Добавьте свободное время — студенты увидят его при записи.
      </p>

      {/* Форма добавления */}
      <form onSubmit={addSlot} className="card mt-5 flex flex-wrap items-end gap-4 p-5">
        <div>
          <label className="label">Дата</label>
          <input
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="field"
            required
          />
        </div>
        <div>
          <label className="label">Время</label>
          <select value={time} onChange={(e) => setTime(e.target.value)} className="field">
            {TIME_OPTIONS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={busy} className="btn-primary py-2.5 disabled:opacity-60">
          <Plus size={16} /> Добавить слот
        </button>
      </form>

      {/* Список слотов */}
      {loading ? (
        <p className="mt-4 text-sm text-muted">Загрузка расписания…</p>
      ) : list.length === 0 ? (
        <div className="card mt-4 p-6 text-sm text-muted">
          Пока нет слотов. Добавьте время выше.
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap gap-3">
          {list.map((s) => (
            <div
              key={s.id}
              className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm ${
                s.is_free ? 'border-line bg-white' : 'border-amber-200 bg-amber-50'
              }`}
            >
              <span className="flex items-center gap-1.5 text-muted">
                <Calendar size={14} /> {formatDate(s.date)}
              </span>
              <span className="flex items-center gap-1.5 font-medium text-ink">
                <Clock size={14} /> {s.time}
              </span>
              {s.is_free ? (
                <button
                  onClick={() => removeSlot(s.id)}
                  disabled={delId === s.id}
                  className="text-slate-400 transition hover:text-red-500 disabled:opacity-50"
                  title="Удалить слот"
                >
                  <Trash2 size={15} />
                </button>
              ) : (
                <span className="text-xs font-medium text-amber-600">занят</span>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
