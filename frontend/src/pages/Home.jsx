import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import homeimg1 from '../../media/homeimg1.png'
import icoProfile from '../../media/profile.png'
import icoLupa from '../../media/lupa.png'
import icoPortf from '../../media/portf.png'
import icoRaket from '../../media/raket.png'

const steps = [
  { img: icoProfile, title: '1. Зарегистрируйся', text: 'Создай профиль и расскажи о своих целях.' },
  { img: icoLupa, title: '2. Выбери наставника', text: 'Найди эксперта по навыкам, опыту и отзывам.' },
  { img: icoPortf, title: '3. Назначь встречу', text: 'Выбери удобное время и начни общение.' },
  { img: icoRaket, title: '4. Получи результат', text: 'Получай знания, опыт и двигайся вперед.' },
]

const directions = [
  {
    emoji: '⚙️',
    title: 'Backend',
    text: 'Осваивай серверную разработку, работу с API, базами данных и создание надежной логики приложений.',
    count: '20+ выпускников',
  },
  {
    emoji: '💻',
    title: 'Frontend',
    text: 'Изучай HTML, CSS, JavaScript, React и современные инструменты для создания удобных и красивых веб-приложений.',
    count: '12+ выпускников',
  },
  {
    emoji: '🗄️',
    title: 'Базы данных',
    text: 'Изучай SQL, PostgreSQL и проектирование баз данных для хранения и обработки информации.',
    count: '10+ выпускников',
  },
  {
    emoji: '🥇',
    title: 'Карьера в IT',
    text: 'Получай помощь в составлении резюме, подготовке к собеседованиям, поиске стажировок и построении успешной карьеры в IT от выпускников своего вуза.',
    count: '',
  },
]

const team = [
  { name: 'Поленок Максим Викторович', org: 'Разработчик «НооСофт»', status: 'Выпускник БГИТУ', disc: 'Backend & Frontend' },
  { name: 'Бондаренко Сергей Владимирович', org: 'Разработчик «НооСофт»', status: 'Выпускник БГИТУ', disc: 'Frontend' },
  { name: 'Исакович Максим Юрьевич', org: 'Разработчик GAP', status: 'Будущий выпускник БГИТУ', disc: 'Frontend' },
  { name: 'Иванов Иван Иванович', org: 'Разработчик GAP', status: 'Будущий выпускник БГИТУ', disc: 'Backend' },
  { name: 'Тарасов Леонид Артемович', org: 'Разработчик GAP', status: 'Будущий выпускник БГИТУ', disc: 'Frontend' },
  { name: 'Жинжиков Владислав Олегович', org: 'Разработчик GAP', status: 'Будущий выпускник БГИТУ', disc: 'DevOps' },
]

const reviews = [
  {
    name: 'Иванов Иван Иванович',
    sub: 'студент 3 курса БГИТУ',
    text: '«Наставник помог разобраться с лабораторными работами по Frontend, объяснил сложные темы простыми словами и подсказал, как лучше оформить проект.»',
  },
  {
    name: 'Петров Максим Андреевич',
    sub: 'студент 2 курса БГИТУ',
    text: '«Благодаря наставнику понял основы алгоритмов, научился эффективнее писать программы на C++ и увереннее выполнять практические задания.»',
  },
  {
    name: 'Смирнов Александр Сергеевич',
    sub: 'студент 4 курса БГИТУ',
    text: '«Наставник помог составить резюме, рассказал о требованиях работодателей и дал советы по подготовке к первой стажировке в IT.»',
  },
]

function initials(name) {
  const p = name.split(' ')
  return ((p[0]?.[0] || '') + (p[1]?.[0] || '')).toUpperCase()
}

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas">
      <Navbar authed={false} />

      {/* Hero */}
      <section className="container-page grid items-center gap-10 py-16 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-extrabold leading-tight text-ink md:text-5xl">
            Получи <span className="text-brand">поддержку</span> от выпускников своего университета
          </h1>
          <p className="mt-5 max-w-md text-base text-muted">
            Общайся с выпускниками своего университета, получай советы по учебе, стажировкам и построению карьеры.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/mentors" className="btn-primary px-6 py-3">Найти ментора</Link>
            <Link to="/register" className="btn-ghost px-6 py-3">Стать ментором</Link>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <img src={homeimg1} alt="Наставничество" className="w-full max-w-lg object-contain" />
        </div>
      </section>

      {/* How it works */}
      <section className="container-page py-10">
        <h2 className="text-2xl font-bold text-ink">Как это работает?</h2>
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.title} className="card p-6">
              <img src={s.img} alt="" className="h-14 w-14 object-contain" />
              <h3 className="mt-4 text-base font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm text-muted">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Directions */}
      <section className="container-page py-10">
        <h2 className="text-2xl font-bold text-ink">Популярные направления</h2>
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {directions.map((d) => (
            <div key={d.title} className="card p-6">
              <h3 className="text-lg font-semibold text-ink">
                <span className="mr-2">{d.emoji}</span>
                {d.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{d.text}</p>
              {d.count && <p className="mt-4 text-sm font-medium text-brand">{d.count}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="container-page py-10">
        <h2 className="text-2xl font-bold text-ink">Наши наставники</h2>
        <p className="mt-2 text-sm text-muted">
          Выпускники БГИТУ, готовые помочь с учебой, проектами и построением карьеры.
        </p>
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m) => (
            <div key={m.name} className="card flex items-center gap-4 p-5">
              <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-700 text-base font-semibold text-white">
                {initials(m.name)}
              </span>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-ink">{m.name}</h3>
                <p className="text-xs text-muted">{m.org}</p>
                <p className="text-xs text-muted">{m.status}</p>
                <p className="mt-1 text-xs font-medium text-brand">Дисциплина: {m.disc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="container-page py-10 pb-16">
        <h2 className="text-2xl font-bold text-ink">Отзывы студентов</h2>
        <p className="mt-2 text-sm text-muted">
          Узнай, что говорят студенты БГИТУ о работе с менторами.
        </p>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {reviews.map((r) => (
            <div key={r.name} className="card p-6">
              <div className="text-sm text-amber-400">★★★★★</div>
              <p className="mt-3 text-sm leading-relaxed text-ink/80">{r.text}</p>
              <div className="mt-5">
                <p className="text-sm font-semibold text-ink">{r.name}</p>
                <p className="text-xs text-muted">{r.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
