import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Droplet, Calendar, Award, TrendingUp, Heart, MapPin, Bell, Clock } from 'lucide-react';
import notificationService from '../../services/notificationService';
import { getAuthHeaders } from '../../config/api';

function DonorDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ totalDonations: 0, livesImpacted: 0, nextEligible: 'Now', points: 0 });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentDonations, setRecentDonations] = useState([]);
  const [urgentRequests, setUrgentRequests] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        setError('');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

        // Donations for stats and recent (with auth headers)
        const donRes = await fetch(`${API_URL}/api/donations/donor/${user.id}`, {
          headers: getAuthHeaders(),
        });
        const donJson = await donRes.json();
        if (donJson.status === 'success') {
          const rows = Array.isArray(donJson.data) ? donJson.data : [];
          const mapped = rows.map((r) => ({
            id: r.id,
            date: r.date || r.created_at,
            hospital: r.hospital_name || 'Hospital',
            units: r.units,
            bloodType: r.blood_type,
            status: r.status,
          }));
          setRecentDonations(mapped.slice(0, 3));
          const totalUnits = mapped.reduce((s, d) => s + (Number(d.units) || 0), 0);
          const lives = totalUnits * 3;
          // Next eligible: 56 days after last completed donation
          let nextEligible = 'Now';
          if (mapped.length > 0) {
            const last = new Date(mapped[0].date);
            const next = new Date(last);
            next.setDate(next.getDate() + 56);
            const diffDays = Math.ceil((next.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            nextEligible = diffDays > 0 ? `${diffDays} days` : 'Now';
          }
          setStats({ totalDonations: mapped.length, livesImpacted: lives, nextEligible, points: mapped.length * 100 });
        }

        // Appointments (donor) with auth headers
        const apptRes = await fetch(`${API_URL}/api/appointments/donor/${user.id}`, {
          headers: getAuthHeaders(),
        });
        const apptJson = await apptRes.json();
        if (apptJson.status === 'success') {
          const appts = Array.isArray(apptJson.data) ? apptJson.data : [];
          const upcoming = appts
            .filter((a) => a.status === 'confirmed' || a.status === 'pending')
            .map((a) => ({
              id: a.id,
              hospital: a.hospital || 'Hospital',
              date: a.date,
              time: a.time,
              type: a.type,
              status: a.status,
            }))
            .slice(0, 2);
          setUpcomingAppointments(upcoming);
        }

        // Urgent requests from notifications
        const notifs = await notificationService.getUserNotifications(user.id);
        const urgent = (notifs || [])
          .filter((n) => ['critical', 'urgent'].includes(String(n.data?.urgency || '').toLowerCase()))
          .slice(0, 4)
          .map((n) => ({
            id: n.id,
            hospital: n.data?.hospitalName || 'Hospital',
            bloodType: n.data?.bloodType || '—',
            units: n.data?.unitsNeeded || 0,
            urgency: n.data?.urgency || 'urgent',
            distance: '—',
            postedTime: new Date(n.createdAt).toLocaleString(),
          }));
        setUrgentRequests(urgent);
      } catch (e) {
        setError(e?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">{error}</div>
      )}
      {loading && (
        <div className="text-sm text-gray-600">Loading dashboard...</div>
      )}
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Hero! 👋</h1>
            <p className="text-red-100 text-lg">
              Your donations have impacted <span className="font-bold">{stats.livesImpacted} lives</span>
            </p>
          </div>
          <Link
            to="/donor/appointments"
            className="hidden md:block bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition shadow-lg"
          >
            Book Appointment
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Donations</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalDonations}</p>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +2 this year
              </p>
            </div>
            <Droplet className="w-12 h-12 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Lives Impacted</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.livesImpacted}</p>
              <p className="text-xs text-gray-500 mt-1">3 lives per donation</p>
            </div>
            <Heart className="w-12 h-12 text-pink-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Next Eligible</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.nextEligible}</p>
              <p className="text-xs text-gray-500 mt-1">Until next donation</p>
            </div>
            <Calendar className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Reward Points</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.points}</p>
              <p className="text-xs text-purple-600 mt-1">300 to next level</p>
            </div>
            <Award className="w-12 h-12 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Calendar className="w-6 h-6 text-red-600" />
              <span>Upcoming Appointments</span>
            </h2>
            <Link to="/donor/appointments" className="text-red-600 hover:text-red-700 font-medium text-sm">
              View All →
            </Link>
          </div>

          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{appointment.hospital}</h3>
                    <p className="text-sm text-gray-600 mt-1">{appointment.type}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(appointment.date).toLocaleDateString()}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.time}</span>
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    appointment.status === 'confirmed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Urgent Requests */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Bell className="w-6 h-6 text-red-600" />
              <span>Urgent Requests</span>
            </h2>
          </div>

          <div className="space-y-3">
            {urgentRequests.map((request) => (
              <div
                key={request.id}
                className="p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    request.urgency === 'critical' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-orange-500 text-white'
                  }`}>
                    {request.urgency.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">{request.postedTime}</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">{request.hospital}</h3>
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span className="text-gray-600">
                    <span className="font-bold text-red-600">{request.bloodType}</span> • {request.units} units
                  </span>
                  <span className="text-gray-500 flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{request.distance}</span>
                  </span>
                </div>
                <button className="w-full mt-3 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium">
                  Respond Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Donations */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <Droplet className="w-6 h-6 text-red-600" />
            <span>Recent Donations</span>
          </h2>
          <Link to="/donor/donations" className="text-red-600 hover:text-red-700 font-medium text-sm">
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Hospital</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Blood Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Units</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentDonations.map((donation) => (
                <tr key={donation.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {new Date(donation.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">{donation.hospital}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold">
                      {donation.bloodType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">{donation.units}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                      {donation.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/donor/hospitals"
          className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition"
        >
          <MapPin className="w-10 h-10 mb-4" />
          <h3 className="text-xl font-bold mb-2">Find Hospitals</h3>
          <p className="text-blue-100">Locate nearby donation centers</p>
        </Link>

        <Link
          to="/donor/achievements"
          className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition"
        >
          <Award className="w-10 h-10 mb-4" />
          <h3 className="text-xl font-bold mb-2">My Achievements</h3>
          <p className="text-purple-100">View badges and rewards</p>
        </Link>

        <Link
          to="/donor/community"
          className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition"
        >
          <Heart className="w-10 h-10 mb-4" />
          <h3 className="text-xl font-bold mb-2">Community</h3>
          <p className="text-green-100">Connect with other donors</p>
        </Link>
      </div>
    </div>
  );
}

export default DonorDashboard;
