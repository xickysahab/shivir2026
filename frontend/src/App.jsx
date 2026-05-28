import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './features/auth/Login'
import AdminDashboard from './features/admin/AdminDashboard'
import TeacherDashboard from './features/teacher/TeacherDashboard'
import MentorDashboard from './features/mentor/MentorDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/mentor" element={<MentorDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
