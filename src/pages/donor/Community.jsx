import React, { useState } from 'react';
import { Users, MessageSquare, Heart, Award, TrendingUp, Calendar, MapPin, Share2, ThumbsUp, MessageCircle, Send, Search, Filter, UserPlus, Bell } from 'lucide-react';

function Community() {
  const [activeTab, setActiveTab] = useState('feed');
  const [newPost, setNewPost] = useState('');

  // Community stats
  const communityStats = {
    totalMembers: 2547,
    activeDonors: 1823,
    totalDonations: 15234,
    livesImpacted: 45702
  };

  // Community feed posts
  const posts = [
    {
      id: 1,
      author: {
        name: 'Sarah Johnson',
        avatar: 'SJ',
        bloodType: 'O+',
        donations: 15,
        level: 'Gold Donor'
      },
      content: 'Just completed my 15th donation today! Feeling grateful to be able to help save lives. Every drop counts! 💉❤️',
      timestamp: '2 hours ago',
      likes: 45,
      comments: 12,
      image: null,
      type: 'milestone'
    },
    {
      id: 2,
      author: {
        name: 'Michael Chen',
        avatar: 'MC',
        bloodType: 'A+',
        donations: 8,
        level: 'Silver Donor'
      },
      content: 'Looking for O- donors! King Faisal Hospital has an urgent need. Please consider donating if you\'re eligible. 🆘',
      timestamp: '5 hours ago',
      likes: 89,
      comments: 23,
      image: null,
      type: 'urgent'
    },
    {
      id: 3,
      author: {
        name: 'Emma Williams',
        avatar: 'EW',
        bloodType: 'B+',
        donations: 22,
        level: 'Platinum Donor'
      },
      content: 'Celebrating World Blood Donor Day with my fellow heroes! Thank you all for making a difference. 🌍❤️',
      timestamp: '1 day ago',
      likes: 156,
      comments: 34,
      image: null,
      type: 'celebration'
    },
    {
      id: 4,
      author: {
        name: 'David Brown',
        avatar: 'DB',
        bloodType: 'AB+',
        donations: 5,
        level: 'Bronze Donor'
      },
      content: 'First time donor here! The experience was amazing and the staff at Rwanda Military Hospital were so supportive. Can\'t wait for my next donation! 💪',
      timestamp: '2 days ago',
      likes: 67,
      comments: 18,
      image: null,
      type: 'story'
    }
  ];

  // Upcoming events
  const events = [
    {
      id: 1,
      title: 'Blood Drive at University of Rwanda',
      date: '2025-10-28',
      time: '09:00 AM - 04:00 PM',
      location: 'UR Campus, Kigali',
      attendees: 45,
      organizer: 'Rwanda Blood Bank'
    },
    {
      id: 2,
      title: 'Donor Appreciation Day',
      date: '2025-11-05',
      time: '02:00 PM - 06:00 PM',
      location: 'King Faisal Hospital',
      attendees: 78,
      organizer: 'King Faisal Hospital'
    },
    {
      id: 3,
      title: 'World Blood Donor Day Celebration',
      date: '2025-11-14',
      time: '10:00 AM - 05:00 PM',
      location: 'Kigali Convention Center',
      attendees: 234,
      organizer: 'Ministry of Health'
    }
  ];

  // Top donors leaderboard
  const topDonors = [
    { rank: 1, name: 'John Smith', donations: 45, bloodType: 'O+', points: 4500 },
    { rank: 2, name: 'Emma Williams', donations: 38, bloodType: 'B+', points: 3800 },
    { rank: 3, name: 'Michael Chen', donations: 32, bloodType: 'A+', points: 3200 },
    { rank: 4, name: 'Sarah Johnson', donations: 28, bloodType: 'O-', points: 2800 },
    { rank: 5, name: 'David Brown', donations: 25, bloodType: 'AB+', points: 2500 }
  ];

  const getPostTypeColor = (type) => {
    switch (type) {
      case 'milestone':
        return 'border-l-4 border-l-yellow-500';
      case 'urgent':
        return 'border-l-4 border-l-red-500';
      case 'celebration':
        return 'border-l-4 border-l-purple-500';
      case 'story':
        return 'border-l-4 border-l-blue-500';
      default:
        return 'border-l-4 border-l-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community</h1>
          <p className="text-gray-600 mt-1">Connect with fellow donors and share your journey</p>
        </div>
        <button className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition shadow-lg">
          <UserPlus className="w-5 h-5" />
          <span>Invite Friends</span>
        </button>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Members</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{communityStats.totalMembers.toLocaleString()}</p>
            </div>
            <Users className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Donors</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{communityStats.activeDonors.toLocaleString()}</p>
            </div>
            <Heart className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Donations</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{communityStats.totalDonations.toLocaleString()}</p>
            </div>
            <Award className="w-12 h-12 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Lives Impacted</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{communityStats.livesImpacted.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'feed'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Feed</span>
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'events'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Events</span>
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'leaderboard'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Leaderboard</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'feed' && (
            <>
              {/* Create Post */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    D
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="Share your donation story or encourage others..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                      rows="3"
                    ></textarea>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                          <Heart className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                          <Calendar className="w-5 h-5" />
                        </button>
                      </div>
                      <button className="flex items-center space-x-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">
                        <Send className="w-4 h-4" />
                        <span>Post</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Posts Feed */}
              {posts.map((post) => (
                <div key={post.id} className={`bg-white rounded-xl shadow-sm p-6 ${getPostTypeColor(post.type)}`}>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {post.author.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900">{post.author.name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                              {post.author.bloodType}
                            </span>
                            <span>•</span>
                            <span>{post.author.level}</span>
                            <span>•</span>
                            <span>{post.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{post.content}</p>
                      <div className="flex items-center space-x-6 text-gray-600">
                        <button className="flex items-center space-x-2 hover:text-red-600 transition">
                          <ThumbsUp className="w-5 h-5" />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-blue-600 transition">
                          <MessageCircle className="w-5 h-5" />
                          <span>{post.comments}</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-green-600 transition">
                          <Share2 className="w-5 h-5" />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === 'events' && (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(event.date).toLocaleDateString('en-US', { 
                            weekday: 'long',
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{event.attendees} attending</span>
                        </div>
                      </div>
                    </div>
                    <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-semibold">
                      Join Event
                    </button>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600">
                      Organized by <span className="font-semibold text-gray-900">{event.organizer}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                <h2 className="text-2xl font-bold flex items-center space-x-2">
                  <Award className="w-8 h-8" />
                  <span>Top Donors This Month</span>
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {topDonors.map((donor) => (
                    <div
                      key={donor.rank}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        donor.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                          donor.rank === 1 ? 'bg-yellow-400 text-white' :
                          donor.rank === 2 ? 'bg-gray-400 text-white' :
                          donor.rank === 3 ? 'bg-orange-400 text-white' :
                          'bg-gray-300 text-gray-700'
                        }`}>
                          {donor.rank}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{donor.name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                              {donor.bloodType}
                            </span>
                            <span>•</span>
                            <span>{donor.donations} donations</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{donor.points}</p>
                        <p className="text-xs text-gray-600">points</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events Widget */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Upcoming Events</span>
            </h3>
            <div className="space-y-3">
              {events.slice(0, 2).map((event) => (
                <div key={event.id} className="border-l-4 border-l-blue-500 pl-3">
                  <p className="font-semibold text-gray-900 text-sm">{event.title}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-blue-600 hover:text-blue-800 font-semibold text-sm">
              View All Events →
            </button>
          </div>

          {/* Suggested Connections */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span>Suggested Connections</span>
            </h3>
            <div className="space-y-3">
              {topDonors.slice(0, 3).map((donor) => (
                <div key={donor.rank} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {donor.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{donor.name}</p>
                      <p className="text-xs text-gray-600">{donor.donations} donations</p>
                    </div>
                  </div>
                  <button className="text-red-600 hover:text-red-800 text-sm font-semibold">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Community Guidelines */}
          <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl shadow-xl p-6 text-white">
            <h3 className="text-lg font-bold mb-3">Community Guidelines</h3>
            <ul className="space-y-2 text-sm text-red-100">
              <li>• Be respectful and supportive</li>
              <li>• Share authentic experiences</li>
              <li>• Protect privacy and confidentiality</li>
              <li>• Report inappropriate content</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Community;
