import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import RegisterDonor from './pages/RegisterDonor'
import RegisterHospital from './pages/RegisterHospital'
import FindBlood from './pages/FindBlood'
import Login from './pages/Login'
import AboutUs from './pages/AboutUs'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import Dashboard from './pages/Dashboard'
import HospitalBloodRequest from './pages/HospitalBloodRequest'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register-donor" element={<RegisterDonor />} />
        <Route path="/register-hospital" element={<RegisterHospital />} />
        <Route path="/find-blood" element={<FindBlood />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/hospital/request-blood" element={<HospitalBloodRequest />} />
      </Routes>
    </Router>
  )
}

export default App
