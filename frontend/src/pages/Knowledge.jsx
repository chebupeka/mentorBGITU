import { Paperclip, Flag, CalendarClock, Send, BookOpen, Airplay, Link2 } from 'lucide-react'
import Shell from '../components/Shell.jsx'
import Logo from '../components/Logo.jsx'
import heroKnowledge from '../../media/thirdpage.png'
import { useApiData } from '../lib/useApi.js'

// Маппинг icon-строки из API в компонент lucide
const ICONS = {
  paperclip: Paperclip,
  flag: Flag,
  calendar: CalendarClock,
  send: Send,
  book: BookOpen,
  airplay: Airplay,
}

export default function Knowledge() {
  const { data: resources, loading, error } = useApiData('/resources')

  return (
    <Shell authed>
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-ink">База знаний</h1>
            <p className="mt-2 max-w-lg text-sm text-muted">
              Ссылки на важные ресурсы БГИТУ и IT-сообщества. Все, что поможет вам в учебе и развитии.
            </p>
          </div>
          <img src={heroKnowledge} alt="" className="hidden object-contain md:block md:w-[420px] lg:w-[520px]" />
        </div>

        {loading ? (
          <p className="mt-8 text-sm text-muted">Загрузка ресурсов…</p>
        ) : error ? (
          <p className="mt-8 text-sm text-red-600">Не удалось загрузить ресурсы: {error.message}</p>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(resources || []).map((r, i) => {
              const Icon = ICONS[r.icon] || Link2
              return (
                <a
                  key={r.id}
                  href={r.url || '#'}
                  target={r.url && r.url !== '#' ? '_blank' : undefined}
                  rel="noreferrer"
                  className="card anim-card group flex flex-col p-6 transition hover:-translate-y-0.5 hover:shadow-card"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-ink">{r.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted">{r.description}</p>
                  <span className="mt-4 text-sm font-medium text-brand group-hover:underline">
                    Перейти →
                  </span>
                </a>
              )
            })}
          </div>
        )}

        {/* Banner */}
        <div className="card mt-8 flex flex-col items-center gap-4 p-8 text-center md:flex-row md:text-left">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50">
            <Logo size={36} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-ink">
              Все необходимые ресурсы — в одном месте.
            </h3>
            <p className="mt-1 text-sm text-muted">
              MentorBGITU помогает студентам быстро находить полезные материалы, образовательные
              сервисы и официальные ресурсы университета.
            </p>
          </div>
        </div>
    </Shell>
  )
}
