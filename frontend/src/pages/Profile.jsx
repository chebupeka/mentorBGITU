import { Calendar, Clock, MapPin } from 'lucide-react'
import Shell from '../components/Shell.jsx'
import Logo from '../components/Logo.jsx'
import heroProfile from '../../media/firstpage.png'
import icoCalendar from '../../media/Calendar.png'
import icoSuccess from '../../media/Success.png'
import icoClock from '../../media/Clock.png'
import icoUsers from '../../media/Users.png'
import icoBookmark from '../../media/Bookmark.png'
import icoMessage from '../../media/Message square.png'

const stats = [
  { img: icoCalendar, value: '2', title: 'Записи', sub: 'Активные записи', tint: 'bg-brand-50' },
  { img: icoSuccess, value: '4', title: 'Завершенных', sub: 'Всего проведено', tint: 'bg-emerald-50' },
  { img: icoClock, value: '1', title: 'Ожидают', sub: 'Предстоящие записи', tint: 'bg-amber-50' },
]

const platform = [
  { img: icoUsers, value: '6', title: 'Наставников', sub: 'На платформе' },
  { img: icoBookmark, value: '7', title: 'Направлений', sub: 'Доступно' },
  { img: icoMessage, value: '32', title: 'Консультации', sub: 'Проведено' },
]

export default function Profile() {
  return (
    <Shell authed>
      <div className="space-y-8">
        {/* Greeting */}
        <section className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-ink">
              Здравствуйте, <span className="text-brand">Леонид!</span>
            </h1>
            <p className="mt-2 text-sm text-muted">Рады видеть вас в личном кабинете.</p>
          </div>
          <img src={heroProfile} alt="Личный кабинет" className="hidden w-[360px] object-contain md:block" />
        </section>

        {/* Stat cards */}
        <section className="grid gap-5 md:grid-cols-3">
          {stats.map((s) => (
            <div key={s.title} className="card flex items-center gap-4 p-6">
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
          <div className="card mt-5 grid gap-6 p-6 md:grid-cols-2">
            <div className="flex items-center gap-4 md:border-r md:border-line md:pr-6">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-700 text-lg font-semibold text-white">
                СБ
              </span>
              <div>
                <h3 className="text-base font-semibold text-ink">Сергей Бондаренко</h3>
                <p className="text-sm font-medium text-brand">Frontend-разработка</p>
              </div>
            </div>
            <div className="space-y-3">
              <Row icon={Calendar} label="Дата" value="25 июня 2026" />
              <Row icon={Clock} label="Время" value="18:00" />
              <Row icon={MapPin} label="Формат" value="Яндекс Телемост" />
            </div>
          </div>
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
