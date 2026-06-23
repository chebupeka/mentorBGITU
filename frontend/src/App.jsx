import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Auth from './pages/Auth.jsx'
import Reg from './pages/Reg.jsx'
import Profile from './pages/Profile.jsx'
import Mentors from './pages/Mentors.jsx'
import Knowledge from './pages/Knowledge.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Reg />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/mentors" element={<Mentors />} />
      <Route path="/knowledge" element={<Knowledge />} />
    </Routes>
  )
}
