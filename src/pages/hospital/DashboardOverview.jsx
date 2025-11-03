import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  
  Users, 
  Bell, 
  AlertTriangle,
  ArrowUpRight,
  Calendar,
  Clock,
  Loader2,
  
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as appointmentService from '../../services/appointmentService';
import * as inventoryService from '../../services/inventoryService';
import * as analyticsService from '../../services/analyticsService';
import * as requestService from '../../services/requestService';
import StatCard from '../../components/hospital/StatCard';
import BloodInventoryChart from '../../components/hospital/BloodInventoryChart';
import RequestsChart from '../../components/hospital/RequestsChart';
import RecentRequests from '../../components/hospital/RecentRequests';
import QuickActions from '../../components/hospital/QuickActions';

function DashboardOverview() {
  // Get hospital ID from localStorage
  const getHospitalId = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.id;
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
    return null;
  };

  const hospitalId = getHospitalId();

  const [stats, setStats] = useState({
    totalRequests: 0,
    activeRequests: 0,
    totalDonors: 0,
    bloodUnits: 0,
  });
  const [loadingStats, setLoadingStats] = useState(false);

  const [criticalAlerts, setCriticalAlerts] = useState([
    {
      id: 1,
      type: 'low_inventory',
      message: 'Blood types O- and AB- are running low',
      severity: 'warning',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'urgent_request',
      message: 'Critical request for A+ blood - 4 units needed',
      severity: 'critical',
      time: '30 minutes ago'
    }
  ]);

  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState(null);

  // Chart data states
  const [inventoryData, setInventoryData] = useState(null);
  const [requestTrendsData, setRequestTrendsData] = useState(null);
  const [loadingCharts, setLoadingCharts] = useState(false);

  // Recent requests state
  const [recentRequests, setRecentRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Fetch all data from API
  useEffect(() => {
    if (hospitalId) {
      fetchDashboardStats();
      fetchTodaysAppointments();
      fetchInventoryData();
      fetchRequestTrends();
      fetchRecentRequests();
    }
  }, [hospitalId]);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    if (!hospitalId) return;

    const interval = setInterval(() => {
      console.log('Auto-refreshing dashboard data...');
      fetchDashboardStats();
      fetchRecentRequests();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [hospitalId]);

  // Refresh when page becomes visible again
  useEffect(() => {
    if (!hospitalId) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Page visible, refreshing data...');
        fetchDashboardStats();
        fetchRecentRequests();
        fetchTodaysAppointments();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [hospitalId]);

  const fetchDashboardStats = async () => {
    try {
      setLoadingStats(true);
      
      // Fetch hospital stats from analytics API
      const statsData = await analyticsService.getHospitalStats(hospitalId);
      
      // Fetch inventory to calculate total blood units
      const inventoryData = await inventoryService.getHospitalInventory(hospitalId);
      const totalBloodUnits = inventoryData.reduce((sum, item) => sum + item.units_available, 0);
      
      // Fetch requests to count active ones
      const requestsData = await requestService.getHospitalRequests(hospitalId);
      const activeRequestsCount = requestsData.filter(r => r.status === 'pending' || r.status === 'active').length;
      
      setStats({
        totalRequests: statsData.totalRequests || requestsData.length,
        activeRequests: activeRequestsCount,
        totalDonors: statsData.totalDonors || 0,
        bloodUnits: totalBloodUnits,
      });
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
      // Keep default values if fetch fails
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchTodaysAppointments = async () => {
    try {
      setLoadingAppointments(true);
      const today = new Date().toISOString().split('T')[0];
      const data = await appointmentService.getHospitalAppointments(
        hospitalId,
        today,
        'all' // Get all statuses for today
      );
      
      console.log('=== APPOINTMENTS DEBUG ===');
      console.log('Hospital ID:', hospitalId);
      console.log('Fetched appointments:', data);
      console.log('First appointment details:', data[0]);
      if (data[0]) {
        console.log('Donor Name:', data[0].donorName);
        console.log('Blood Type:', data[0].bloodType);
        console.log('Donor ID:', data[0].donorId);
      }
      
      // Filter to show only confirmed and pending appointments
      const todaysAppointments = data
        .filter(apt => apt.status === 'confirmed' || apt.status === 'pending')
        .slice(0, 5); // Show only first 5
      
      console.log('Filtered appointments:', todaysAppointments);
      console.log('=========================');
      
      setUpcomingAppointments(todaysAppointments);
      setAppointmentsError(null);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
      setAppointmentsError('Failed to load appointments');
    } finally {
      setLoadingAppointments(false);
    }
  };

  const fetchInventoryData = async () => {
    try {
      setLoadingCharts(true);
      const data = await inventoryService.getHospitalInventory(hospitalId);
      
      // Transform data for chart
      const chartData = data.map(item => ({
        bloodType: item.blood_type,
        units: item.units_available,
        critical: item.critical_level || 15
      }));
      
      setInventoryData(chartData);
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
      // Keep default data if fetch fails
    } finally {
      setLoadingCharts(false);
    }
  };

  const fetchRequestTrends = async () => {
    try {
      const currentYear = new Date().getFullYear();
      const trends = [];
      
      // Fetch last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        
        try {
          const data = await analyticsService.getMonthlyReport(hospitalId, year, month);
          trends.push({
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            requests: data.totalRequests || 0,
            fulfilled: data.fulfilledRequests || 0
          });
        } catch (err) {
          // If month data doesn't exist, use 0
          trends.push({
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            requests: 0,
            fulfilled: 0
          });
        }
      }
      
      setRequestTrendsData(trends);
    } catch (err) {
      console.error('Failed to fetch request trends:', err);
      // Keep default data if fetch fails
    }
  };

  const fetchRecentRequests = async () => {
    try {
      setLoadingRequests(true);
      const data = await requestService.getHospitalRequests(hospitalId);
      
      // Transform and get recent 4 requests
      const formattedRequests = data
        .slice(0, 4)
        .map(request => ({
          id: request.id,
          bloodType: request.blood_type,
          units: request.units_needed,
          urgency: request.urgency,
          status: request.status,
          requestedAt: new Date(request.created_at),
          patientName: request.patient_condition || 'Patient',
        }));
      
      setRecentRequests(formattedRequests);
    } catch (err) {
      console.error('Failed to fetch recent requests:', err);
      // Keep empty array if fetch fails
    } finally {
      setLoadingRequests(false);
    }
  };

  // Analytics data
  const monthlyData = [
    { month: 'Jan', donations: 45, requests: 38, fulfilled: 35 },
    { month: 'Feb', donations: 52, requests: 42, fulfilled: 40 },
    { month: 'Mar', donations: 48, requests: 45, fulfilled: 42 },
    { month: 'Apr', donations: 61, requests: 50, fulfilled: 48 },
    { month: 'May', donations: 55, requests: 48, fulfilled: 45 },
    { month: 'Jun', donations: 67, requests: 55, fulfilled: 52 }
  ];

  const bloodTypeData = [
    { name: 'O+', value: 35, color: '#ef4444' },
    { name: 'A+', value: 28, color: '#f97316' },
    { name: 'B+', value: 20, color: '#eab308' },
    { name: 'AB+', value: 8, color: '#84cc16' },
    { name: 'O-', value: 4, color: '#06b6d4' },
    { name: 'A-', value: 3, color: '#3b82f6' },
    { name: 'B-', value: 1.5, color: '#8b5cf6' },
    { name: 'AB-', value: 0.5, color: '#ec4899' }
  ];

  const ageGroupData = [
    { age: '18-25', donors: 120 },
    { age: '26-35', donors: 280 },
    { age: '36-45', donors: 350 },
    { age: '46-55', donors: 220 },
    { age: '56-65', donors: 80 }
  ];

  const urgencyData = [
    { name: 'Critical', value: 15, color: '#dc2626' },
    { name: 'High', value: 25, color: '#f97316' },
    { name: 'Medium', value: 35, color: '#eab308' },
    { name: 'Low', value: 25, color: '#3b82f6' }
  ];

  

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">
                Welcome back! 👋
              </h1>
              <p className="text-red-100 text-sm sm:text-base md:text-lg">
                Here's what's happening with your blood donation center today
              </p>
            </div>
            <Link
              to="/hospital/requests"
              className="flex items-center space-x-2 bg-white text-red-700 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:bg-red-50 transition shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base whitespace-nowrap"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>New Request</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {criticalAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`
                relative overflow-hidden rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-lg
                ${alert.severity === 'critical' 
                  ? 'bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200' 
                  : 'bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200'
                }
              `}
            >
              {/* Decorative background element */}
              <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10 ${
                alert.severity === 'critical' ? 'bg-red-500' : 'bg-amber-500'
              }`}></div>
              
              <div className="relative flex items-start gap-4">
                {/* Icon container */}
                <div className={`
                  flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
                  ${alert.severity === 'critical' 
                    ? 'bg-red-500 shadow-lg shadow-red-500/30' 
                    : 'bg-amber-500 shadow-lg shadow-amber-500/30'
                  }
                `}>
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-sm font-bold uppercase tracking-wide ${
                      alert.severity === 'critical' ? 'text-red-900' : 'text-amber-900'
                    }`}>
                      {alert.severity === 'critical' ? 'Critical Alert' : 'Warning'}
                    </h3>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      alert.severity === 'critical' 
                        ? 'bg-red-200 text-red-800' 
                        : 'bg-amber-200 text-amber-800'
                    }`}>
                      {alert.time}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${
                    alert.severity === 'critical' ? 'text-red-800' : 'text-amber-800'
                  }`}>
                    {alert.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <StatCard
          title="Active Requests"
          value={stats.activeRequests}
          icon={Bell}
          trend="down"
          trendValue="3%"
          color="red"
        />
        <StatCard
          title="Registered Donors"
          value={stats.totalDonors}
          icon={Users}
          trend="up"
          trendValue="8%"
          color="green"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <BloodInventoryChart data={inventoryData} />
        <RequestsChart data={requestTrendsData} />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <RecentRequests requests={recentRequests} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Today's Appointments</h2>
          </div>
          <Link
            to="/hospital/appointments"
            className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {loadingAppointments ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
              <span className="ml-2 text-gray-600">Loading appointments...</span>
            </div>
          ) : appointmentsError ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-2">{appointmentsError}</p>
              <button 
                onClick={fetchTodaysAppointments}
                className="text-red-600 hover:text-red-700 font-medium text-sm"
              >
                Try Again
              </button>
            </div>
          ) : upcomingAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No appointments scheduled for today</p>
            </div>
          ) : (
            upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                    {appointment.donorName ? appointment.donorName.split(' ').map(n => n[0]).join('') : '??'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{appointment.donorName || 'Unknown Donor'}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{appointment.time}</span>
                      <span className="text-gray-400">•</span>
                      <span className="font-medium text-red-600">{appointment.bloodType}</span>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                    appointment.status === 'confirmed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {appointment.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Monthly Donation Trends */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Monthly Donation Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="donations" stroke="#ef4444" strokeWidth={2} name="Donations" />
            <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} name="Requests" />
            <Line type="monotone" dataKey="fulfilled" stroke="#10b981" strokeWidth={2} name="Fulfilled" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Blood Type Distribution & Request Urgency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Blood Type Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Blood Type Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bloodTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {bloodTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Request Urgency */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Request Urgency Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={urgencyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {urgencyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Donor Demographics */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Donor Demographics by Age</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ageGroupData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="age" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="donors" fill="#ef4444" name="Number of Donors" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      
    </div>
  );
}

export default DashboardOverview;
