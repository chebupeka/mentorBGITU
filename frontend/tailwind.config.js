/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0088ff',
          50: 'var(--brand-50)',
          100: '#d9ecff',
          500: '#0088ff',
          600: '#0072e0',
          700: '#0059b3',
        },
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        canvas: 'var(--canvas)',
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,0.04), 0 6px 20px rgba(16,24,40,0.06)',
        soft: '0 2px 12px rgba(16,24,40,0.06)',
      },
      borderRadius: {
        xl2: '20px',
      },
    },
  },
  plugins: [],
}
