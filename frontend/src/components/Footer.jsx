import Logo from './Logo.jsx'

export default function Footer() {
  return (
    <footer className="bg-brand text-white">
      <div className="container-page grid gap-8 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
              <Logo size={24} />
            </span>
            <span className="text-base font-bold">MentorBGITU</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-white/80">
            Платформа наставничества для студентов и выпускников БГИТУ.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Навигация</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li>Главная</li>
            <li>Наставники</li>
            <li>База знаний</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Контакты</h4>
          <p className="text-sm text-white/80">
            Кафедра информационных технологий
            <br /> г. Брянск
            <br /> it.bgitu.ru
          </p>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="container-page py-5 text-center text-xs text-white/70">
          © 2026 MentorBGITU. Все права защищены.
        </div>
      </div>
    </footer>
  )
}
