// Анимированная зелёная галочка для модалки «Вы успешно записаны!».
// Анимация на чистом CSS (keyframes в index.css): модалка монтируется один раз
// при открытии, поэтому анимация проигрывается ровно один раз и остаётся видимой.
// В покое strokeDashoffset=0 — даже если анимация не сработает, галочка видна.
export default function SuccessCheck({ size = 72 }) {
  return (
    <span
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size, animation: 'check-pop .5s ease both' }}
    >
      <span
        className="absolute rounded-full bg-emerald-500"
        style={{
          width: size * 0.9,
          height: size * 0.9,
          opacity: 0,
          animation: 'check-pulse 1.5s ease-out .35s forwards',
        }}
      />
      <svg viewBox="0 0 80 80" width={size} height={size} className="relative">
        <circle
          cx="40"
          cy="40"
          r="34"
          fill="none"
          stroke="#16a34a"
          strokeWidth="4"
          strokeDasharray="214"
          strokeDashoffset="0"
          style={{ animation: 'check-ring .62s ease both' }}
        />
        <path
          d="M25 41 l10 11 l21 -23"
          fill="none"
          stroke="#16a34a"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="62"
          strokeDashoffset="0"
          style={{ animation: 'check-draw .76s ease both' }}
        />
      </svg>
    </span>
  )
}
