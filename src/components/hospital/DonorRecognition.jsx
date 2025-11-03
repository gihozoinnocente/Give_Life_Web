import React, { useState } from 'react';
import { Award, Trophy, Star, Medal, Crown, Zap, Heart, TrendingUp } from 'lucide-react';

const DonorRecognition = () => {
  const [selectedTab, setSelectedTab] = useState('leaderboard');

  // Mock leaderboard data
  const topDonors = [
    {
      id: 1,
      name: 'Michael Chen',
      bloodType: 'O+',
      donations: 48,
      points: 4800,
      level: 'Platinum',
      badges: ['Hero', 'Lifesaver', 'Champion'],
      streak: 24,
    },
    {
      id: 2,
      name: 'Sarah Williams',
      bloodType: 'A+',
      donations: 42,
      points: 4200,
      level: 'Gold',
      badges: ['Hero', 'Lifesaver'],
      streak: 18,
    },
    {
      id: 3,
      name: 'David Martinez',
      bloodType: 'B+',
      donations: 38,
      points: 3800,
      level: 'Gold',
      badges: ['Hero', 'Consistent'],
      streak: 15,
    },
    {
      id: 4,
      name: 'Emily Johnson',
      bloodType: 'AB+',
      donations: 35,
      points: 3500,
      level: 'Silver',
      badges: ['Hero'],
      streak: 12,
    },
    {
      id: 5,
      name: 'James Brown',
      bloodType: 'O-',
      donations: 32,
      points: 3200,
      level: 'Silver',
      badges: ['Rare Hero'],
      streak: 10,
    },
  ];

  // Achievement badges
  const achievements = [
    {
      name: 'First Donation',
      icon: Heart,
      description: 'Complete your first donation',
      color: 'red',
      unlocked: 1248,
    },
    {
      name: 'Lifesaver',
      icon: Award,
      description: 'Save 10 lives',
      color: 'blue',
      unlocked: 856,
    },
    {
      name: 'Hero',
      icon: Trophy,
      description: 'Donate 25 times',
      color: 'yellow',
      unlocked: 432,
    },
    {
      name: 'Champion',
      icon: Crown,
      description: 'Donate 50 times',
      color: 'purple',
      unlocked: 156,
    },
    {
      name: 'Consistent',
      icon: Zap,
      description: '12-month streak',
      color: 'green',
      unlocked: 234,
    },
    {
      name: 'Rare Hero',
      icon: Star,
      description: 'Rare blood type donor',
      color: 'orange',
      unlocked: 89,
    },
  ];

  const getLevelBadge = (level) => {
    const styles = {
      Platinum: 'bg-gradient-to-r from-gray-400 to-gray-600 text-white',
      Gold: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
      Silver: 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900',
      Bronze: 'bg-gradient-to-r from-orange-400 to-orange-600 text-white',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[level]}`}>
        {level}
      </span>
    );
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getAchievementColor = (color) => {
    const colors = {
      red: 'bg-red-100 text-red-600',
      blue: 'bg-blue-100 text-blue-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      purple: 'bg-purple-100 text-purple-600',
      green: 'bg-green-100 text-green-600',
      orange: 'bg-orange-100 text-orange-600',
    };
    return colors[color];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">Donor Recognition & Gamification</h3>
        <p className="text-sm text-gray-600 mt-1">Celebrate and motivate donors</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setSelectedTab('leaderboard')}
          className={`px-4 py-2 font-medium transition ${
            selectedTab === 'leaderboard'
              ? 'text-red-600 border-b-2 border-red-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Leaderboard
        </button>
        <button
          onClick={() => setSelectedTab('achievements')}
          className={`px-4 py-2 font-medium transition ${
            selectedTab === 'achievements'
              ? 'text-red-600 border-b-2 border-red-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Achievements
        </button>
        <button
          onClick={() => setSelectedTab('stats')}
          className={`px-4 py-2 font-medium transition ${
            selectedTab === 'stats'
              ? 'text-red-600 border-b-2 border-red-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Statistics
        </button>
      </div>

      {/* Leaderboard Tab */}
      {selectedTab === 'leaderboard' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Top Donors This Month</h4>
            <button className="text-sm text-red-600 hover:text-red-700 font-medium">
              View All
            </button>
          </div>

          {topDonors.map((donor, index) => (
            <div
              key={donor.id}
              className={`flex items-center justify-between p-4 rounded-lg transition ${
                index < 3
                  ? 'bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow">
                  {getRankIcon(index + 1)}
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-bold text-gray-900">{donor.name}</p>
                    {getLevelBadge(donor.level)}
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <span className="font-medium text-red-600">{donor.bloodType}</span>
                    <span>•</span>
                    <span>{donor.donations} donations</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Zap className="w-4 h-4 text-orange-500" />
                      <span>{donor.streak} month streak</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    {donor.badges.map((badge, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-red-600">{donor.points}</p>
                <p className="text-xs text-gray-500">points</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Achievements Tab */}
      {selectedTab === 'achievements' && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                >
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${getAchievementColor(
                      achievement.color
                    )}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h5 className="font-bold text-gray-900 mb-1">{achievement.name}</h5>
                  <p className="text-xs text-gray-600 mb-2">{achievement.description}</p>
                  <p className="text-xs font-medium text-gray-500">
                    {achievement.unlocked} donors unlocked
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="flex items-start space-x-3">
              <Trophy className="w-6 h-6 text-purple-600 mt-1" />
              <div>
                <h5 className="font-bold text-purple-900 mb-1">Create Custom Badges</h5>
                <p className="text-sm text-purple-700">
                  Design special achievements for your hospital's donors and boost engagement.
                </p>
                <button className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition">
                  Create Badge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Tab */}
      {selectedTab === 'stats' && (
        <div className="space-y-6">
          {/* Overall Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Active Donors</span>
              </div>
              <p className="text-3xl font-bold text-blue-900">1,248</p>
              <p className="text-xs text-blue-600 mt-1">↑ 12% from last month</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Engagement</span>
              </div>
              <p className="text-3xl font-bold text-green-900">87%</p>
              <p className="text-xs text-green-600 mt-1">↑ 5% from last month</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Award className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-900">Badges Earned</span>
              </div>
              <p className="text-3xl font-bold text-yellow-900">3,456</p>
              <p className="text-xs text-yellow-600 mt-1">This month</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Avg Streak</span>
              </div>
              <p className="text-3xl font-bold text-purple-900">8.2</p>
              <p className="text-xs text-purple-600 mt-1">months</p>
            </div>
          </div>

          {/* Level Distribution */}
          <div>
            <h5 className="font-semibold text-gray-900 mb-3">Donor Level Distribution</h5>
            <div className="space-y-3">
              {[
                { level: 'Platinum', count: 45, percentage: 3.6, color: 'gray' },
                { level: 'Gold', count: 156, percentage: 12.5, color: 'yellow' },
                { level: 'Silver', count: 432, percentage: 34.6, color: 'gray' },
                { level: 'Bronze', count: 615, percentage: 49.3, color: 'orange' },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.level}</span>
                    <span className="text-sm text-gray-600">
                      {item.count} donors ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-${item.color}-500 h-2 rounded-full transition-all`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Badges */}
          <div>
            <h5 className="font-semibold text-gray-900 mb-3">Most Popular Achievements</h5>
            <div className="space-y-2">
              {achievements.slice(0, 4).map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${getAchievementColor(
                          achievement.color
                        )}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{achievement.name}</p>
                        <p className="text-xs text-gray-600">{achievement.unlocked} unlocked</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        {((achievement.unlocked / 1248) * 100).toFixed(1)}%
                      </p>
                      <p className="text-xs text-gray-500">of donors</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorRecognition;
