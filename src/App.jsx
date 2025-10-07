import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import RegisterDonor from './pages/RegisterDonor'
import RegisterHospital from './pages/RegisterHospital'
import FindBlood from './pages/FindBlood'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register-donor" element={<RegisterDonor />} />
        <Route path="/register-hospital" element={<RegisterHospital />} />
        <Route path="/find-blood" element={<FindBlood />} />
      </Routes>
    </Router>
  )
}

export default App
