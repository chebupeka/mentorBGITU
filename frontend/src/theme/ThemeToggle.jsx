import { Sun, Moon } from 'lucide-react'
import { useTheme } from './ThemeContext.jsx'

// Кнопка смены темы. floating=true — фиксированная в правом верхнем углу
// (для страниц без навбара).
export default function ThemeToggle({ floating = false }) {
  const { isDark, toggle } = useTheme()
  const base =
    'flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink shadow-soft transition hover:scale-105 active:scale-95'
  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Светлая тема' : 'Тёмная тема'}
      title={isDark ? 'Светлая тема' : 'Тёмная тема'}
      className={floating ? `fixed right-5 top-5 z-[60] ${base}` : base}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
