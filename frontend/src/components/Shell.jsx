import Navbar from './Navbar.jsx'

export default function Shell({ children, authed = true }) {
  return (
    <div className="min-h-screen bg-canvas pb-12">
      <Navbar authed={authed} />
      <div className="container-page mt-5">
        <div className="rounded-3xl border border-line bg-white p-6 shadow-soft md:p-9">
          {children}
        </div>
      </div>
    </div>
  )
}
