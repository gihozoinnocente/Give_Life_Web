import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import RegisterDonor from './pages/RegisterDonor'
import RegisterHospital from './pages/RegisterHospital'
import FindBlood from './pages/FindBlood'
import Login from './pages/Login'
import AboutUs from './pages/AboutUs'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import Dashboard from './pages/Dashboard'
import HospitalDashboard from './pages/HospitalDashboard'
import HospitalBloodRequest from './pages/HospitalBloodRequest'
import NearbyHospitals from './pages/NearbyHospitals'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminDashboardLayout from './components/admin/DashboardLayout'
import AdminDashPage from './pages/admin/dashboard'
import AdminHospitalsPage from './pages/admin/hospitals'

// New Hospital Dashboard with Sidebar
import DashboardLayout from './components/hospital/DashboardLayout'
import DashboardOverview from './pages/hospital/DashboardOverview'
import BloodInventory from './pages/hospital/BloodInventory'
import RequestsManagement from './pages/hospital/RequestsManagement'
import DonorsPage from './pages/hospital/DonorsPage'
import AnalyticsPage from './pages/hospital/AnalyticsPage'
import ActivityLog from './pages/hospital/ActivityLog'
import DonorRecognition from './pages/hospital/DonorRecognition'
import AppointmentsPage from './pages/hospital/AppointmentsPage'
import ReportsPage from './pages/hospital/ReportsPage'
import NearbyHospitalsPage from './pages/hospital/NearbyHospitalsPage'
import HospitalHealthRecords from './pages/hospital/HealthRecords'
import HospitalSettings from './pages/hospital/HospitalSettings'

// Donor Dashboard with Sidebar
import DonorDashboardLayout from './components/donor/DashboardLayout'
import DonorDashboard from './pages/donor/DonorDashboard'
import MyDonations from './pages/donor/MyDonations'
import DonorAppointments from './pages/donor/DonorAppointments'
import Achievements from './pages/donor/Achievements'
import HealthRecords from './pages/donor/HealthRecords'
import Community from './pages/donor/Community'
import DonorActivityLog from './pages/donor/DonorActivityLog'

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
        <Route path="/nearby-hospitals" element={<NearbyHospitals />} />
        {/* Admin Dashboard with Sidebar Navigation */}
        <Route path="/admin" element={<AdminDashboardLayout />}>
          <Route path="dashboard" element={<AdminDashPage />} />
          <Route path="hospitals" element={<AdminHospitalsPage />} />
          {/* Future: add real pages for users, analytics, settings */}
        </Route>
        
        {/* Hospital Dashboard with Sidebar Navigation */}
        <Route path="/hospital" element={<DashboardLayout />}>
          <Route path="dashboard" element={<DashboardOverview />} />
          <Route path="inventory" element={<BloodInventory />} />
          <Route path="requests" element={<RequestsManagement />} />
          <Route path="donors" element={<DonorsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="request-blood" element={<HospitalBloodRequest />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="nearby" element={<NearbyHospitalsPage />} />
          <Route path="health-records" element={<HospitalHealthRecords />} />
          <Route path="recognition" element={<DonorRecognition />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="activity" element={<ActivityLog />} />
          <Route path="settings" element={<HospitalSettings />} />
        </Route>

        {/* Donor Dashboard with Sidebar Navigation */}
        <Route path="/donor" element={<DonorDashboardLayout />}>
          <Route path="dashboard" element={<DonorDashboard />} />
          <Route path="donations" element={<MyDonations />} />
          <Route path="appointments" element={<DonorAppointments />} />
          <Route path="hospitals" element={<NearbyHospitals />} />
          <Route path="requests" element={<FindBlood />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="health" element={<HealthRecords />} />
          <Route path="community" element={<Community />} />
          <Route path="activity" element={<DonorActivityLog />} />
          <Route path="settings" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
