import { Paperclip, Flag, CalendarClock, Send, BookOpen, Airplay } from 'lucide-react'
import Shell from '../components/Shell.jsx'
import Logo from '../components/Logo.jsx'
import heroKnowledge from '../../media/thirdpage.png'

const resources = [
  {
    icon: Paperclip,
    title: 'Сайт БГИТУ',
    text: 'Официальный сайт Брянского государственного инженерно-технологического университета.',
  },
  {
    icon: Flag,
    title: 'Кафедра ИТ',
    text: 'Информация о кафедре информационных технологий, преподавателях и образовательных программах.',
  },
  {
    icon: CalendarClock,
    title: 'Расписание',
    text: 'Актуальное расписание занятий для всех курсов и направлений подготовки.',
  },
  {
    icon: Send,
    title: 'Telegram',
    text: 'Актуальные новости, объявления и полезные материалы для студентов БГИТУ.',
  },
  {
    icon: BookOpen,
    title: 'Методические материалы',
    text: 'Полезные методички, рекомендации и материалы для подготовки к занятиям.',
  },
  {
    icon: Airplay,
    title: 'IT-сообщество БГИТУ',
    text: 'Новости, мероприятия и возможности для студентов и выпускников.',
  },
]

export default function Knowledge() {
  return (
    <Shell authed>
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-ink">База знаний</h1>
            <p className="mt-2 max-w-lg text-sm text-muted">
              Ссылки на важные ресурсы БГИТУ и IT-сообщества. Все, что поможет вам в учебе и развитии.
            </p>
          </div>
          <img src={heroKnowledge} alt="" className="hidden w-[320px] object-contain md:block lg:w-[400px]" />
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((r) => (
            <a
              key={r.title}
              href="#"
              className="card group flex flex-col p-6 transition hover:-translate-y-0.5 hover:shadow-card"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand">
                <r.icon size={22} />
              </div>
              <h3 className="mt-4 text-base font-semibold text-ink">{r.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted">{r.text}</p>
              <span className="mt-4 text-sm font-medium text-brand group-hover:underline">
                Перейти →
              </span>
            </a>
          ))}
        </div>

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
