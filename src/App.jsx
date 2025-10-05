import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import RegisterDonor from './pages/RegisterDonor'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register-donor" element={<RegisterDonor />} />
      </Routes>
    </Router>
  )
}

export default App
