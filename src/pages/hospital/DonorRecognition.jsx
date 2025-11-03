import React, { useState } from 'react';
import { Award, Trophy, Star, Medal, Crown, TrendingUp, Gift, Calendar, Droplet, Users, Zap, Target } from 'lucide-react';

function DonorRecognition() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Top donors leaderboard
  const topDonors = [
    {
      id: 1,
      rank: 1,
      name: 'David Wilson',
      bloodType: 'O-',
      totalDonations: 45,
      unitsContributed: 135,
      lastDonation: '1 week ago',
      streak: 24,
      points: 4500,
      badges: ['Gold', 'Lifesaver', 'Consistent'],
      avatar: 'DW',
      level: 'Platinum'
    },
    {
      id: 2,
      rank: 2,
      name: 'Sarah Johnson',
      bloodType: 'A+',
      totalDonations: 38,
      unitsContributed: 114,
      lastDonation: '3 days ago',
      streak: 20,
      points: 3800,
      badges: ['Gold', 'Hero', 'Regular'],
      avatar: 'SJ',
      level: 'Gold'
    },
    {
      id: 3,
      rank: 3,
      name: 'Michael Brown',
      bloodType: 'B+',
      totalDonations: 32,
      unitsContributed: 96,
      lastDonation: '2 weeks ago',
      streak: 16,
      points: 3200,
      badges: ['Silver', 'Champion'],
      avatar: 'MB',
      level: 'Gold'
    },
    {
      id: 4,
      rank: 4,
      name: 'Emily Davis',
      bloodType: 'AB+',
      totalDonations: 28,
      unitsContributed: 84,
      lastDonation: '5 days ago',
      streak: 14,
      points: 2800,
      badges: ['Silver', 'Dedicated'],
      avatar: 'ED',
      level: 'Silver'
    },
    {
      id: 5,
      rank: 5,
      name: 'James Wilson',
      bloodType: 'O+',
      totalDonations: 25,
      unitsContributed: 75,
      lastDonation: '1 week ago',
      streak: 12,
      points: 2500,
      badges: ['Bronze', 'Rising Star'],
      avatar: 'JW',
      level: 'Silver'
    }
  ];

  // Achievement badges
  const achievements = [
    {
      id: 1,
      name: 'First Drop',
      description: 'Complete your first donation',
      icon: Droplet,
      color: 'blue',
      unlocked: 156,
      total: 200
    },
    {
      id: 2,
      name: 'Lifesaver',
      description: 'Save 10 lives through donations',
      icon: Award,
      color: 'red',
      unlocked: 89,
      total: 200
    },
    {
      id: 3,
      name: 'Consistent Hero',
      description: 'Donate 5 times in a row',
      icon: Star,
      color: 'yellow',
      unlocked: 67,
      total: 200
    },
    {
      id: 4,
      name: 'Century Club',
      description: 'Reach 100 total donations',
      icon: Trophy,
      color: 'purple',
      unlocked: 12,
      total: 200
    },
    {
      id: 5,
      name: 'Rare Type Hero',
      description: 'Donate rare blood type (AB-, O-)',
      icon: Medal,
      color: 'green',
      unlocked: 34,
      total: 200
    },
    {
      id: 6,
      name: 'Speed Donor',
      description: 'Complete donation in under 30 minutes',
      icon: Zap,
      color: 'orange',
      unlocked: 98,
      total: 200
    }
  ];

  // Recent recognitions
  const recentRecognitions = [
    {
      id: 1,
      donor: 'David Wilson',
      achievement: 'Reached 45 total donations',
      badge: 'Platinum Donor',
      date: '2 hours ago',
      type: 'milestone'
    },
    {
      id: 2,
      donor: 'Sarah Johnson',
      achievement: 'Maintained 20-month donation streak',
      badge: 'Consistency Champion',
      date: '5 hours ago',
      type: 'streak'
    },
    {
      id: 3,
      donor: 'Michael Brown',
      achievement: 'Donated during critical shortage',
      badge: 'Emergency Hero',
      date: '1 day ago',
      type: 'special'
    },
    {
      id: 4,
      donor: 'Emily Davis',
      achievement: 'Referred 5 new donors',
      badge: 'Ambassador',
      date: '2 days ago',
      type: 'referral'
    }
  ];

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
              <p className="text-3xl font-bold mt-2">1,248</p>
            </div>
            <Users className="w-12 h-12 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Active Donors</p>
              <p className="text-3xl font-bold mt-2">856</p>
            </div>
            <TrendingUp className="w-12 h-12 text-red-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Badges Earned</p>
              <p className="text-3xl font-bold mt-2">3,456</p>
            </div>
            <Award className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Lives Saved</p>
              <p className="text-3xl font-bold mt-2">12,480</p>
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
          {topDonors.map((donor) => (
            <div
              key={donor.id}
              className={`relative p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
                donor.rank === 1 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300' :
                donor.rank === 2 ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300' :
                donor.rank === 3 ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300' :
                'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-4">
                {/* Rank */}
                <div className="flex-shrink-0 w-16 text-center">
                  {getRankIcon(donor.rank)}
                </div>

                {/* Avatar */}
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getLevelColor(donor.level)} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                  {donor.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{donor.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getLevelColor(donor.level)} text-white`}>
                      {donor.level}
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
                  <p className="text-sm font-semibold text-gray-900">{donor.lastDonation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements & Badges */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Award className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">Achievements & Badges</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            const progress = (achievement.unlocked / achievement.total) * 100;

            return (
              <div key={achievement.id} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition">
                <div className="flex items-start space-x-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${getAchievementColor(achievement.color)}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{achievement.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                    
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{achievement.unlocked} donors</span>
                        <span>{progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${
                            achievement.color === 'blue' ? 'from-blue-400 to-blue-600' :
                            achievement.color === 'red' ? 'from-red-400 to-red-600' :
                            achievement.color === 'yellow' ? 'from-yellow-400 to-yellow-600' :
                            achievement.color === 'purple' ? 'from-purple-400 to-purple-600' :
                            achievement.color === 'green' ? 'from-green-400 to-green-600' :
                            'from-orange-400 to-orange-600'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
