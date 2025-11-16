import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Award, Trophy, Star, Medal, Crown, TrendingUp, Gift, Calendar, Droplet, Users, Zap, Target } from 'lucide-react';
import { getRecognitionStats } from '../../services/hospitalService';

function DonorRecognition() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState({ totalDonors: 0, activeDonors: 0, badgesEarned: 0, livesImpacted: 0 });
  const [topDonors, setTopDonors] = useState([]);
  const [badgeCounts, setBadgeCounts] = useState([]);
  const recentRecognitions = [];

  const getInitials = (name) => {
    if (!name) return 'DN';
    const parts = String(name).trim().split(' ');
    const first = parts[0]?.[0] || '';
    const second = parts[1]?.[0] || '';
    return (first + second || first).toUpperCase();
  };

  const deriveLevel = (totalDonations) => {
    if (totalDonations >= 40) return 'Platinum';
    if (totalDonations >= 25) return 'Gold';
    if (totalDonations >= 10) return 'Silver';
    return 'Bronze';
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        setError('');
        const data = await getRecognitionStats(user.id);
        setSummary(data.summary || { totalDonors: 0, activeDonors: 0, badgesEarned: 0, livesImpacted: 0 });
        setTopDonors(Array.isArray(data.topDonors) ? data.topDonors : []);
        setBadgeCounts(Array.isArray(data.badgeCounts) ? data.badgeCounts : []);
      } catch (e) {
        setError(e.message || 'Failed to load recognition stats');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  const getLevelColor = (level) => {
    const colors = {
      'Platinum': 'from-gray-400 to-gray-600',
      'Gold': 'from-yellow-400 to-yellow-600',
      'Silver': 'from-gray-300 to-gray-400',
      'Bronze': 'from-orange-400 to-orange-600'
    };
    return colors[level] || 'from-gray-400 to-gray-600';
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="w-8 h-8 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-8 h-8 text-gray-400" />;
    if (rank === 3) return <Medal className="w-8 h-8 text-orange-600" />;
    return <span className="text-2xl font-bold text-gray-400">#{rank}</span>;
  };

  const getAchievementColor = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      red: 'bg-red-100 text-red-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      purple: 'bg-purple-100 text-purple-600',
      green: 'bg-green-100 text-green-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">{error}</div>
      )}
      {loading && (
        <div className="text-sm text-gray-600">Loading recognition...</div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Donor Recognition</h1>
          <p className="text-gray-600 mt-1">Celebrate and reward our amazing donors</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Total Donors</p>
              <p className="text-3xl font-bold mt-2">{summary.totalDonors}</p>
            </div>
            <Users className="w-12 h-12 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Active Donors</p>
              <p className="text-3xl font-bold mt-2">{summary.activeDonors}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-red-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Badges Earned</p>
              <p className="text-3xl font-bold mt-2">{summary.badgesEarned}</p>
            </div>
            <Award className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Lives Saved</p>
              <p className="text-3xl font-bold mt-2">{summary.livesImpacted}</p>
            </div>
            <Trophy className="w-12 h-12 text-green-200" />
          </div>
        </div>
      </div>

      {/* Top Donors Leaderboard */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Trophy className="w-6 h-6 text-yellow-600" />
            <h2 className="text-xl font-bold text-gray-900">Top Donors Leaderboard</h2>
          </div>
          <button className="text-red-600 hover:text-red-700 font-medium text-sm">
            View All →
          </button>
        </div>

        <div className="space-y-4">
          {topDonors.map((donor, idx) => (
            <div
              key={donor.id}
              className={`relative p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
                idx === 0 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300' :
                idx === 1 ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300' :
                idx === 2 ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300' :
                'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-4">
                {/* Rank */}
                <div className="flex-shrink-0 w-16 text-center">
                  {getRankIcon(idx + 1)}
                </div>

                {/* Avatar */}
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getLevelColor(deriveLevel(donor.totalDonations || 0))} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                  {getInitials(donor.name)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{donor.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getLevelColor(deriveLevel(donor.totalDonations || 0))} text-white`}>
                      {deriveLevel(donor.totalDonations || 0)}
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold">
                      {donor.bloodType}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Donations</p>
                      <p className="font-bold text-gray-900">{donor.totalDonations}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Units</p>
                      <p className="font-bold text-gray-900">{donor.unitsContributed}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Streak</p>
                      <p className="font-bold text-orange-600">{donor.streak} months</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Points</p>
                      <p className="font-bold text-purple-600">{donor.points.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {donor.badges.map((badge, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full text-xs font-semibold flex items-center space-x-1"
                      >
                        <Award className="w-3 h-3" />
                        <span>{badge}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Last Donation */}
                <div className="hidden lg:block text-right">
                  <p className="text-xs text-gray-500">Last Donation</p>
                  <p className="text-sm font-semibold text-gray-900">{donor.lastDonation ? new Date(donor.lastDonation).toLocaleDateString() : '—'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements & Badges (real counts) */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Award className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">Achievements & Badges</h2>
        </div>

        {badgeCounts.length === 0 ? (
          <div className="text-sm text-gray-500">No badges earned yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badgeCounts.map((b) => (
              <div key={b.key} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition">
                <div className="flex items-start space-x-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${getAchievementColor('purple')}`}>
                    <Award className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{b.key}</h3>
                    <p className="text-sm text-gray-600 mb-3">Total earned by your donors</p>
                    <div className="text-2xl font-bold text-gray-900">{b.count}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Recognitions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Star className="w-6 h-6 text-yellow-600" />
          <h2 className="text-xl font-bold text-gray-900">Recent Recognitions</h2>
        </div>

        <div className="space-y-3">
          {recentRecognitions.map((recognition) => (
            <div
              key={recognition.id}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{recognition.donor}</p>
                  <p className="text-sm text-gray-600">{recognition.achievement}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                      {recognition.badge}
                    </span>
                    <span className="text-xs text-gray-500">{recognition.date}</span>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium">
                Celebrate
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards Program */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <Gift className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Rewards Program</h2>
            </div>
            <p className="text-purple-100 mb-4">
              Donors can redeem points for exclusive rewards and benefits
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                <p className="text-sm text-purple-100">Health Checkup</p>
                <p className="font-bold">500 points</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                <p className="text-sm text-purple-100">Gift Voucher</p>
                <p className="font-bold">1,000 points</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                <p className="text-sm text-purple-100">VIP Status</p>
                <p className="font-bold">2,500 points</p>
              </div>
            </div>
          </div>
          <button className="hidden md:block bg-white text-purple-700 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition">
            Manage Rewards
          </button>
        </div>
      </div>
    </div>
  );
}

export default DonorRecognition;
