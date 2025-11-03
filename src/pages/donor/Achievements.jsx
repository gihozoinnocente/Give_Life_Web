import React, { useState } from 'react';
import { Award, Trophy, Star, Medal, Crown, TrendingUp, Gift, Calendar, Droplet, Users, Zap, Target, Lock, CheckCircle } from 'lucide-react';

function Achievements() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // User stats
  const userStats = {
    totalDonations: 12,
    totalPoints: 1200,
    currentLevel: 3,
    nextLevelPoints: 1500,
    rank: 'Gold Donor',
    livesImpacted: 36,
    streak: 6,
    badges: 8
  };

  // Achievement categories
  const categories = [
    { id: 'all', name: 'All Achievements', icon: Award },
    { id: 'donations', name: 'Donations', icon: Droplet },
    { id: 'milestones', name: 'Milestones', icon: Target },
    { id: 'community', name: 'Community', icon: Users },
    { id: 'special', name: 'Special', icon: Star }
  ];

  // Achievements data
  const achievements = [
    {
      id: 1,
      title: 'First Drop',
      description: 'Complete your first blood donation',
      category: 'donations',
      icon: Droplet,
      points: 100,
      unlocked: true,
      unlockedDate: '2024-01-15',
      progress: 100,
      color: 'red'
    },
    {
      id: 2,
      title: 'Regular Hero',
      description: 'Donate blood 5 times',
      category: 'donations',
      icon: Award,
      points: 250,
      unlocked: true,
      unlockedDate: '2024-06-20',
      progress: 100,
      color: 'blue'
    },
    {
      id: 3,
      title: 'Life Saver',
      description: 'Donate blood 10 times',
      category: 'donations',
      icon: Trophy,
      points: 500,
      unlocked: true,
      unlockedDate: '2025-03-10',
      progress: 100,
      color: 'yellow'
    },
    {
      id: 4,
      title: 'Super Donor',
      description: 'Donate blood 25 times',
      category: 'donations',
      icon: Crown,
      points: 1000,
      unlocked: false,
      progress: 48,
      color: 'purple'
    },
    {
      id: 5,
      title: 'Century Club',
      description: 'Donate blood 100 times',
      category: 'milestones',
      icon: Medal,
      points: 5000,
      unlocked: false,
      progress: 12,
      color: 'gold'
    },
    {
      id: 6,
      title: 'Early Bird',
      description: 'Donate before 9 AM',
      category: 'special',
      icon: Calendar,
      points: 50,
      unlocked: true,
      unlockedDate: '2024-08-05',
      progress: 100,
      color: 'green'
    },
    {
      id: 7,
      title: 'Streak Master',
      description: 'Maintain a 6-month donation streak',
      category: 'milestones',
      icon: Zap,
      points: 300,
      unlocked: true,
      unlockedDate: '2025-09-15',
      progress: 100,
      color: 'orange'
    },
    {
      id: 8,
      title: 'Community Champion',
      description: 'Refer 5 new donors',
      category: 'community',
      icon: Users,
      points: 400,
      unlocked: false,
      progress: 60,
      color: 'pink'
    },
    {
      id: 9,
      title: 'Ambassador',
      description: 'Refer 10 new donors',
      category: 'community',
      icon: Star,
      points: 800,
      unlocked: false,
      progress: 30,
      color: 'indigo'
    },
    {
      id: 10,
      title: 'Holiday Hero',
      description: 'Donate during a holiday season',
      category: 'special',
      icon: Gift,
      points: 150,
      unlocked: true,
      unlockedDate: '2024-12-25',
      progress: 100,
      color: 'red'
    }
  ];

  // Levels
  const levels = [
    { level: 1, name: 'Bronze Donor', minPoints: 0, color: 'from-orange-400 to-orange-600' },
    { level: 2, name: 'Silver Donor', minPoints: 500, color: 'from-gray-400 to-gray-600' },
    { level: 3, name: 'Gold Donor', minPoints: 1000, color: 'from-yellow-400 to-yellow-600' },
    { level: 4, name: 'Platinum Donor', minPoints: 2000, color: 'from-blue-400 to-blue-600' },
    { level: 5, name: 'Diamond Donor', minPoints: 5000, color: 'from-purple-400 to-purple-600' }
  ];

  const filteredAchievements = achievements.filter(achievement => 
    selectedCategory === 'all' || achievement.category === selectedCategory
  );

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const totalPoints = unlockedAchievements.reduce((sum, a) => sum + a.points, 0);
  const progressToNextLevel = ((userStats.totalPoints - levels[userStats.currentLevel - 1].minPoints) / 
    (levels[userStats.currentLevel]?.minPoints - levels[userStats.currentLevel - 1].minPoints)) * 100;

  const getColorClasses = (color) => {
    const colors = {
      red: 'from-red-500 to-red-600',
      blue: 'from-blue-500 to-blue-600',
      yellow: 'from-yellow-500 to-yellow-600',
      purple: 'from-purple-500 to-purple-600',
      gold: 'from-yellow-400 to-yellow-600',
      green: 'from-green-500 to-green-600',
      orange: 'from-orange-500 to-orange-600',
      pink: 'from-pink-500 to-pink-600',
      indigo: 'from-indigo-500 to-indigo-600'
    };
    return colors[color] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Achievements</h1>
          <p className="text-gray-600 mt-1">Track your progress and unlock rewards</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-3 rounded-xl shadow-lg">
            <div className="flex items-center space-x-2">
              <Trophy className="w-6 h-6" />
              <div>
                <p className="text-xs font-medium opacity-90">Total Points</p>
                <p className="text-2xl font-bold">{userStats.totalPoints}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Level Progress Card */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-purple-200 mb-1">Current Level</p>
            <h2 className="text-3xl font-bold">{levels[userStats.currentLevel - 1].name}</h2>
            <p className="text-purple-200 mt-2">Level {userStats.currentLevel} of {levels.length}</p>
          </div>
          <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Crown className="w-12 h-12" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress to {levels[userStats.currentLevel]?.name || 'Max Level'}</span>
            <span className="font-bold">{userStats.totalPoints} / {levels[userStats.currentLevel]?.minPoints || 'MAX'}</span>
          </div>
          <div className="w-full h-4 bg-purple-400 bg-opacity-30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${progressToNextLevel}%` }}
            ></div>
          </div>
        </div>

        {/* Level Milestones */}
        <div className="mt-6 grid grid-cols-5 gap-2">
          {levels.map((level, index) => (
            <div key={level.level} className="text-center">
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                index < userStats.currentLevel 
                  ? 'bg-white text-purple-600' 
                  : 'bg-purple-400 bg-opacity-30 text-purple-200'
              }`}>
                {index < userStats.currentLevel ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <Lock className="w-6 h-6" />
                )}
              </div>
              <p className="text-xs">{level.level}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Badges Earned</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{unlockedAchievements.length}/{achievements.length}</p>
            </div>
            <Award className="w-12 h-12 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Streak</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{userStats.streak}</p>
              <p className="text-xs text-gray-500 mt-1">months</p>
            </div>
            <Zap className="w-12 h-12 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Lives Impacted</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{userStats.livesImpacted}</p>
            </div>
            <Droplet className="w-12 h-12 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rank</p>
              <p className="text-lg font-bold text-purple-600 mt-2">{userStats.rank}</p>
            </div>
            <Trophy className="w-12 h-12 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition ${
                  selectedCategory === category.id
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement) => {
          const Icon = achievement.icon;
          return (
            <div
              key={achievement.id}
              className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 ${
                achievement.unlocked 
                  ? 'hover:shadow-xl hover:scale-105' 
                  : 'opacity-75'
              }`}
            >
              {/* Achievement Header */}
              <div className={`bg-gradient-to-r ${getColorClasses(achievement.color)} p-6 text-white relative`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-1">{achievement.title}</h3>
                    <p className="text-sm opacity-90">{achievement.description}</p>
                  </div>
                  {achievement.unlocked && (
                    <CheckCircle className="w-6 h-6 flex-shrink-0" />
                  )}
                  {!achievement.unlocked && (
                    <Lock className="w-6 h-6 flex-shrink-0 opacity-50" />
                  )}
                </div>
              </div>

              {/* Achievement Body */}
              <div className="p-6">
                {achievement.unlocked ? (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-green-600 flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>Unlocked</span>
                      </span>
                      <span className="text-sm font-bold text-gray-900">+{achievement.points} pts</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Earned on {new Date(achievement.unlockedDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-600">Progress</span>
                      <span className="text-sm font-bold text-gray-900">{achievement.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                      <div 
                        className={`h-full bg-gradient-to-r ${getColorClasses(achievement.color)} transition-all duration-500`}
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">
                      Reward: <span className="font-bold text-gray-900">+{achievement.points} points</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Rewards Section */}
      <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2 flex items-center space-x-2">
              <Gift className="w-8 h-8" />
              <span>Rewards Available</span>
            </h3>
            <p className="text-green-100 mb-4">
              Redeem your points for exclusive rewards and benefits
            </p>
            <button className="bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition">
              View Rewards Store
            </button>
          </div>
          <Trophy className="hidden md:block w-24 h-24 text-green-300 opacity-50" />
        </div>
      </div>
    </div>
  );
}

export default Achievements;
