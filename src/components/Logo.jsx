import logoIT from '../../frontend/media/logoIT.png'

export default function Logo({ size = 36, className = '' }) {
  return (
    <img
      src={logoIT}
      alt="MentorBGITU"
      width={size}
      height={size}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  )
}
