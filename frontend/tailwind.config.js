/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0088ff',
          50: '#eef6ff',
          100: '#d9ecff',
          500: '#0088ff',
          600: '#0072e0',
          700: '#0059b3',
        },
        ink: '#0f172a',
        muted: '#64748b',
        line: '#e6eaf0',
        canvas: '#f5f7fa',
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
