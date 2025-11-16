import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Users, Droplet, Calendar } from 'lucide-react';

function AnalyticsPage() {
  // Monthly donation trends
  const monthlyData = [
    { month: 'Jan', donations: 45, requests: 38, fulfilled: 35 },
    { month: 'Feb', donations: 52, requests: 42, fulfilled: 40 },
    { month: 'Mar', donations: 48, requests: 45, fulfilled: 42 },
    { month: 'Apr', donations: 61, requests: 50, fulfilled: 48 },
    { month: 'May', donations: 55, requests: 48, fulfilled: 45 },
    { month: 'Jun', donations: 67, requests: 55, fulfilled: 52 }
  ];

  // Blood type distribution
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

  // Donor demographics
  const ageGroupData = [
    { age: '18-25', donors: 120 },
    { age: '26-35', donors: 280 },
    { age: '36-45', donors: 350 },
    { age: '46-55', donors: 220 },
    { age: '56-65', donors: 80 }
  ];

  // Request urgency breakdown
  const urgencyData = [
    { name: 'Critical', value: 15, color: '#dc2626' },
    { name: 'High', value: 25, color: '#f97316' },
    { name: 'Medium', value: 35, color: '#eab308' },
    { name: 'Low', value: 25, color: '#3b82f6' }
  ];

  const stats = [
    {
      title: 'Total Donations',
      value: '328',
      change: '+12.5%',
      trend: 'up',
      icon: Droplet,
      color: 'blue'
    },
    {
      title: 'Active Donors',
      value: '1,248',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'green'
    },
    {
      title: 'Fulfillment Rate',
      value: '94.3%',
      change: '+2.1%',
      trend: 'up',
      icon: Activity,
      color: 'purple'
    },
    {
      title: 'Avg Response Time',
      value: '2.4h',
      change: '-15.3%',
      trend: 'down',
      icon: Calendar,
      color: 'orange'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
        <p className="text-gray-600 mt-1">Comprehensive insights into blood donation activities</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-semibold ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Monthly Donation Trends</h2>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blood Type Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Blood Type Distribution</h2>
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
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Request Urgency Breakdown</h2>
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
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Donor Demographics by Age</h2>
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

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Average Units per Donation</h3>
          <p className="text-3xl font-bold text-gray-900">2.8</p>
          <div className="mt-4 flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
            </div>
            <span className="text-sm text-gray-600">70%</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Donor Retention Rate</h3>
          <p className="text-3xl font-bold text-gray-900">87.5%</p>
          <div className="mt-4 flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87.5%' }}></div>
            </div>
            <span className="text-sm text-gray-600">87.5%</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Emergency Response Rate</h3>
          <p className="text-3xl font-bold text-gray-900">96.2%</p>
          <div className="mt-4 flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '96.2%' }}></div>
            </div>
            <span className="text-sm text-gray-600">96.2%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
