import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Droplet, Calendar, MapPin, Award, TrendingUp, Download, Eye } from 'lucide-react';
import donorService from '../../services/donorService';

function MyDonations() {
  const { user } = useSelector((state) => state.auth);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDonations = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        setError('');
        // Use backend endpoint /api/donations/donor/:donorId
        const API_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API_URL}/api/donations/donor/${user.id}`);
        const data = await res.json();
        if (data.status === 'success') {
          const rows = Array.isArray(data.data) ? data.data : [];
          const mapped = rows.map((r) => ({
            id: r.id,
            date: r.date || r.created_at,
            hospital: r.hospital_name || 'Hospital',
            location: r.hospital_address || '',
            bloodType: r.blood_type,
            units: r.units,
            status: r.status,
            certificate: !!r.certificate,
            impact: (Number(r.units) || 0) * 3,
          }));
          setDonations(mapped);
        } else {
          throw new Error(data.message || 'Failed to load donations');
        }
      } catch (e) {
        setError(e.message || 'Failed to load donations');
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, [user?.id]);

  const stats = {
    totalDonations: donations.length,
    totalUnits: donations.reduce((sum, d) => sum + (Number(d.units) || 0), 0),
    livesImpacted: donations.reduce((sum, d) => sum + ((Number(d.units) || 0) * 3), 0),
    lastDonation: donations[0]?.date
  };

  const filteredDonations = donations;

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">{error}</div>
      )}
      {loading && (
        <div className="text-sm text-gray-600">Loading donations...</div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Donations</h1>
          <p className="text-gray-600 mt-1">Track your donation history and impact</p>
        </div>
        <button className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition shadow-lg">
          <Download className="w-5 h-5" />
          <span>Export History</span>
        </button>
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
                All time
              </p>
            </div>
            <Droplet className="w-12 h-12 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Units</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUnits}</p>
              <p className="text-xs text-gray-500 mt-1">450ml each</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Droplet className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Lives Impacted</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.livesImpacted}</p>
              <p className="text-xs text-gray-500 mt-1">3 per donation</p>
            </div>
            <Award className="w-12 h-12 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Last Donation</p>
              <p className="text-lg font-bold text-gray-900 mt-2">
                {new Date(stats.lastDonation).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {Math.floor((new Date() - new Date(stats.lastDonation)) / (1000 * 60 * 60 * 24))} days ago
              </p>
            </div>
            <Calendar className="w-12 h-12 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Filters removed as requested */}

      {/* Donations List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Hospital</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Location</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Blood Type</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Units</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Impact</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDonations.map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50 transition">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(donation.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm font-medium text-gray-900">{donation.hospital}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{donation.location}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                      {donation.bloodType}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-medium text-gray-900">{donation.units}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1">
                      <Award className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-semibold text-purple-600">{donation.impact} lives</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(donation.status)}`}>
                      {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      {donation.certificate && (
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Download Certificate">
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredDonations.length === 0 && (
          <div className="text-center py-12">
            <Droplet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No donations found</h3>
            <p className="text-gray-600">Try adjusting your filters or search term</p>
          </div>
        )}
      </div>

      {/* Impact Summary */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Your Impact</h3>
            <p className="text-purple-100 mb-4">
              You've made a difference in <span className="font-bold text-white">{stats.livesImpacted} lives</span> through your {stats.totalDonations} donations
            </p>
            <div className="flex items-center space-x-6">
              <div>
                <p className="text-sm text-purple-200">Next Milestone</p>
                <p className="text-xl font-bold">25 Donations</p>
              </div>
              <div>
                <p className="text-sm text-purple-200">Progress</p>
                <div className="w-32 h-2 bg-purple-400 rounded-full mt-1">
                  <div 
                    className="h-full bg-white rounded-full" 
                    style={{ width: `${(stats.totalDonations / 25) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <Award className="hidden md:block w-24 h-24 text-purple-300 opacity-50" />
        </div>
      </div>
    </div>
  );
}

export default MyDonations;
