import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Award, Trophy, Star, Medal, Crown, TrendingUp, Gift, Calendar, Droplet, Users, Zap, Target, Lock, CheckCircle } from 'lucide-react';
import badgeService from '../../services/badgeService';
import { useToast } from '../../components/ToastProvider.jsx';

function Achievements() {
  const { user } = useSelector((state) => state.auth);
  const toast = useToast();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [earned, setEarned] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const displayName = user?.name || user?.email || 'Donor';

  // Build a shareable SVG certificate string for a badge
  const buildBadgeSVG = (badge) => {
    const title = badge.title || 'Badge';
    const dateStr = new Date(badge.unlockedDate || badge.earnedAt || new Date()).toLocaleDateString();
    const width = 1000; // px
    const height = 600; // px
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7f1d1d"/>
      <stop offset="100%" stop-color="#dc2626"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#00000055"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <g filter="url(#shadow)">
    <rect x="80" y="80" rx="24" ry="24" width="${width-160}" height="${height-160}" fill="#ffffff" opacity="0.95"/>
  </g>
  <g>
    <text x="50%" y="200" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="56" font-weight="800" fill="#111827">${title}</text>
    <text x="50%" y="260" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="22" fill="#6b7280">Awarded to</text>
    <text x="50%" y="320" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="40" font-weight="700" fill="#111827">${displayName}</text>
    <text x="50%" y="380" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="18" fill="#6b7280">on ${dateStr}</text>
    <g transform="translate(${width/2 - 60}, 410)">
      <circle cx="60" cy="60" r="60" fill="#dc2626"/>
      <path d="M60 20 L80 55 L40 55 Z" fill="#ffffff"/>
    </g>
    <text x="50%" y="520" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="16" fill="#9ca3af">Give Life Blood Donation</text>
  </g>
</svg>`;
  };

  // Convert SVG string to PNG and trigger download
  const downloadBadge = async (badge, format = 'png') => {
    try {
      const svgString = buildBadgeSVG(badge);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      if (format === 'svg') {
        const a = document.createElement('a');
        a.href = svgUrl;
        a.download = `${(badge.title || 'badge').toLowerCase().replace(/\s+/g, '-')}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(svgUrl);
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      const canvas = document.createElement('canvas');
      const width = 1000; const height = 600;
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d');

      await new Promise((resolve, reject) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0, width, height);
          URL.revokeObjectURL(svgUrl);
          resolve();
        };
        img.onerror = reject;
        img.src = svgUrl;
      });

      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `${(badge.title || 'badge').toLowerCase().replace(/\s+/g, '-')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error('Badge download failed:', e);
      try {
        toast.error('Failed to download badge.');
      } catch (_) {}
    }
  };

  const userStats = {
    totalDonations: 0,
    totalPoints: 0,
    currentLevel: 1,
    nextLevelPoints: 500,
    rank: 'Donor',
    livesImpacted: 0,
    streak: 0,
    badges: earned.length
  };

  useEffect(() => {
    const fetchBadges = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        setError('');
        const data = await badgeService.getDonorBadges(user.id);
        setEarned(Array.isArray(data.earned) ? data.earned : []);
        setInProgress(Array.isArray(data.inProgress) ? data.inProgress : []);
      } catch (e) {
        setError(e?.message || 'Failed to load achievements');
      } finally {
        setLoading(false);
      }
    };
    fetchBadges();
  }, [user?.id]);

  // Achievement categories
  const categories = [
    { id: 'all', name: 'All Achievements', icon: Award },
    { id: 'donations', name: 'Donations', icon: Droplet },
    { id: 'milestones', name: 'Milestones', icon: Target },
    { id: 'community', name: 'Community', icon: Users },
    { id: 'special', name: 'Special', icon: Star }
  ];

  // Combine earned and in-progress into a unified array for the grid based on selectedCategory filters
  const achievements = [
    ...earned.map((b, idx) => ({
      id: `e-${idx}`,
      title: b.title,
      description: b.description,
      category: 'donations',
      icon: Award,
      unlocked: true,
      unlockedDate: b.earnedAt || new Date().toISOString(),
      progress: 100,
      color: 'red'
    })),
    ...inProgress.map((p, idx) => ({
      id: `p-${idx}`,
      title: p.title,
      description: p.description,
      category: 'donations',
      icon: Target,
      unlocked: false,
      progress: p.percent,
      color: 'blue'
    }))
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
  const totalPoints = unlockedAchievements.length * 100; // placeholder points per badge
  const progressToNextLevel = levels[userStats.currentLevel]
    ? ((userStats.totalPoints - levels[userStats.currentLevel - 1].minPoints) / 
      (levels[userStats.currentLevel].minPoints - levels[userStats.currentLevel - 1].minPoints)) * 100
    : 100;

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
      {error && (
        <div className="p-4 rounded-xl bg-white border-l-4 border-red-400 shadow-sm text-sm flex items-start space-x-3">
          <Calendar className="w-4 h-4 text-red-500 mt-0.5" />
          <div>
            <p className="text-gray-900 font-medium">We couldn't load your achievements.</p>
            <p className="text-gray-600 mt-1">{error}</p>
          </div>
        </div>
      )}
      {loading && (
        <div className="text-sm text-gray-600">Loading achievements...</div>
      )}
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
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => downloadBadge(achievement, 'png')}
                          className="px-3 py-1.5 bg-red-600 text-white rounded-md text-xs font-semibold hover:bg-red-700 transition"
                        >
                          Download PNG
                        </button>
                        <button
                          type="button"
                          onClick={() => downloadBadge(achievement, 'svg')}
                          className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-md text-xs font-semibold hover:bg-gray-200 transition"
                        >
                          SVG
                        </button>
                      </div>
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
