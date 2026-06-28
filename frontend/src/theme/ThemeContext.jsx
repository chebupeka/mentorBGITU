import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || saved === 'light') return saved
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  // Переключение с круговым «расплыванием» из точки клика (кнопки).
  function toggle(event) {
    const next = theme === 'dark' ? 'light' : 'dark'
    const x = event?.clientX ?? window.innerWidth - 32
    const y = event?.clientY ?? 32

    const noVT =
      !document.startViewTransition ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (noVT) {
      setTheme(next)
      return
    }

    const transition = document.startViewTransition(() => {
      setTheme(next)
    })
    transition.ready.then(() => {
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      )
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 520,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        },
      )
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme должен использоваться внутри <ThemeProvider>')
  return ctx
}
