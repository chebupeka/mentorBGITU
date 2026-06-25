// Анимированный фон для страниц входа/регистрации:
// мягкие голубые пятна, медленно дрейфующие за карточкой.
export default function AuthBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute rounded-full blur-2xl"
        style={{
          width: 480,
          height: 480,
          top: -120,
          left: -110,
          background: 'radial-gradient(circle, rgba(0,136,255,.22), transparent 70%)',
          animation: 'auth-drift 22s ease-in-out infinite',
        }}
      />
      <div
        className="absolute rounded-full blur-2xl"
        style={{
          width: 420,
          height: 420,
          bottom: -130,
          right: -90,
          background: 'radial-gradient(circle, rgba(86,180,255,.20), transparent 70%)',
          animation: 'auth-drift 27s ease-in-out infinite reverse',
        }}
      />
      <div
        className="absolute rounded-full blur-2xl"
        style={{
          width: 360,
          height: 360,
          top: '34%',
          right: '12%',
          background: 'radial-gradient(circle, rgba(10,95,214,.16), transparent 70%)',
          animation: 'auth-drift2 31s ease-in-out infinite',
        }}
      />
    </div>
  )
}
