import { Calendar, Clock, MapPin } from 'lucide-react'
import Shell from '../components/Shell.jsx'
import Logo from '../components/Logo.jsx'
import { useAuth } from '../auth/AuthContext.jsx'
import { useApiData, formatDate, initials } from '../lib/useApi.js'
import { StatCardSkeleton } from '../components/Skeleton.jsx'
import MentorDashboard from '../components/MentorDashboard.jsx'
import heroProfile from '../../media/firstpage.png'
import icoCalendar from '../../media/Calendar.png'
import icoSuccess from '../../media/Success.png'
import icoClock from '../../media/Clock.png'
import icoUsers from '../../media/Users.png'
import icoBookmark from '../../media/Bookmark.png'
import icoMessage from '../../media/Message square.png'

export default function Profile() {
  const { user } = useAuth()
  const name = user?.first_name || user?.email || 'друг'

  const { data: pStats, loading: pLoading } = useApiData('/profile/stats', { auth: true })
  const { data: next, loading: nextLoading } = useApiData(
    '/profile/next-appointment',
    { auth: true },
  )
  const { data: platformStats } = useApiData('/stats/platform')

  const stats = [
    { img: icoCalendar, value: pStats?.active ?? '—', title: 'Записи', sub: 'Активные записи', tint: 'bg-brand-50' },
    { img: icoSuccess, value: pStats?.completed ?? '—', title: 'Завершенных', sub: 'Всего проведено', tint: 'bg-emerald-50' },
    { img: icoClock, value: pStats?.pending ?? '—', title: 'Ожидают', sub: 'Предстоящие записи', tint: 'bg-amber-50' },
  ]

  const platform = [
    { img: icoUsers, value: platformStats?.mentors ?? '—', title: 'Наставников', sub: 'На платформе' },
    { img: icoBookmark, value: platformStats?.directions ?? '—', title: 'Направлений', sub: 'Доступно' },
    { img: icoMessage, value: platformStats?.consultations ?? '—', title: 'Консультации', sub: 'Проведено' },
  ]

  return (
    <Shell authed>
      <div className="space-y-8">
        {/* Greeting */}
        <section className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-ink">
              Здравствуйте, <span className="text-brand">{name}!</span>
            </h1>
            <p className="mt-2 text-sm text-muted">Рады видеть вас в личном кабинете.</p>
          </div>
          <img src={heroProfile} alt="Личный кабинет" className="hidden w-[360px] object-contain md:block" />
        </section>

        {user?.mentor_id ? (
          <MentorDashboard />
        ) : (
        <>
        {/* Stat cards */}
        <section className="grid gap-5 md:grid-cols-3">
          {pLoading
            ? Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)
            : stats.map((s, i) => (
            <div
              key={s.title}
              className="card anim-card flex items-center gap-4 p-6"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.tint}`}>
                <img src={s.img} alt="" className="h-6 w-6 object-contain" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-ink">{s.value}</div>
                <div className="text-sm font-semibold text-ink">{s.title}</div>
                <div className="text-xs text-muted">{s.sub}</div>
              </div>
            </div>
          ))}
        </section>

        {/* Next appointment */}
        <section>
          <h2 className="text-xl font-bold text-ink">Ближайшая запись</h2>
          <p className="mt-1 text-sm text-muted">
            Информация о вашей следующей записи к наставнику.
          </p>
          {nextLoading ? (
            <div className="card mt-5 p-6 text-sm text-muted">Загрузка…</div>
          ) : next ? (
            <div className="card mt-5 grid gap-6 p-6 md:grid-cols-2">
              <div className="flex items-center gap-4 md:border-r md:border-line md:pr-6">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-700 text-lg font-semibold text-white">
                  {initials(next.mentor_name)}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-ink">{next.mentor_name}</h3>
                  <p className="text-sm font-medium text-brand">{next.mentor_direction}</p>
                </div>
              </div>
              <div className="space-y-3">
                <Row icon={Calendar} label="Дата" value={formatDate(next.date)} />
                <Row icon={Clock} label="Время" value={next.time} />
                <Row icon={MapPin} label="Формат" value={next.format} />
              </div>
            </div>
          ) : (
            <div className="card mt-5 p-6 text-sm text-muted">
              У вас пока нет предстоящих записей.{' '}
              <a href="/mentors" className="font-medium text-brand hover:underline">
                Выбрать наставника →
              </a>
            </div>
          )}
        </section>

        {/* Bottom */}
        <section className="grid gap-5 md:grid-cols-2">
          <div className="card p-6">
            <h3 className="text-base font-semibold text-ink">Статистика платформы</h3>
            <div className="mt-5 grid grid-cols-3 gap-4">
              {platform.map((p) => (
                <div key={p.title}>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
                    <img src={p.img} alt="" className="h-5 w-5 object-contain" />
                  </div>
                  <div className="text-xl font-extrabold text-ink">{p.value}</div>
                  <div className="text-xs font-semibold text-ink">{p.title}</div>
                  <div className="text-[11px] text-muted">{p.sub}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-base font-semibold text-ink">О платформе</h3>
            <div className="mt-4 flex gap-4">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50">
                <Logo size={36} />
              </div>
              <p className="text-sm text-muted">
                MentorBGITU — сервис взаимодействия студентов и выпускников БГИТУ. Найдите
                наставника, запишитесь на консультацию и получайте помощь по учебным дисциплинам.
              </p>
            </div>
            <button className="mt-5 w-full rounded-lg bg-slate-100 py-2.5 text-sm font-medium text-ink transition hover:bg-slate-200">
              Узнать больше →
            </button>
          </div>
        </section>
        </>
        )}
      </div>
    </Shell>
  )
}

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5">
      <span className="flex items-center gap-2 text-sm text-muted">
        <Icon size={16} /> {label}
      </span>
      <span className="text-sm font-medium text-ink">{value}</span>
    </div>
  )
}
