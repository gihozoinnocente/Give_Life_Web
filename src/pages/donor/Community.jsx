import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Users, MessageSquare, Heart, Award, TrendingUp, Calendar, MapPin, Share2, ThumbsUp, MessageCircle, Send, Search, Filter, UserPlus, Bell } from 'lucide-react';
import notificationService from '../../services/notificationService';
import donorService from '../../services/donorService';
import communityService from '../../services/communityService';

function Community() {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('feed');
  const [newPost, setNewPost] = useState('');
  const [feed, setFeed] = useState([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [feedError, setFeedError] = useState('');
  const [donStats, setDonStats] = useState({ totalDonations: 0, lives: 0 });
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState('');

  // Community stats
  const communityStats = {
    totalMembers: 2547,
    activeDonors: 1823,
    totalDonations: 15234,
    livesImpacted: 45702
  };

  // Fetch real-time community feed from notifications and donor stats
  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      try {
        setFeedLoading(true);
        setFeedError('');
        // Notifications as feed items
        const notifs = await notificationService.getUserNotifications(user.id);
        const mapped = (notifs || []).map((n) => ({
          id: n.id,
          author: {
            name: n.data?.hospitalName || 'Hospital',
            avatar: (n.data?.hospitalName || 'HN').split(' ').map(s => s[0]).join('').slice(0,2).toUpperCase(),
            bloodType: n.data?.bloodType || '—',
            donations: undefined,
            level: (n.data?.urgency || 'normal').toUpperCase()
          },
          content: n.message || n.title,
          timestamp: new Date(n.createdAt).toLocaleString(),
          likes: 0,
          comments: 0,
          image: null,
          type: (n.data?.urgency === 'critical' || n.data?.urgency === 'urgent') ? 'urgent' : 'story'
        }));
        setFeed(mapped);

        // Donor stats from donation history
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const res = await fetch(`${API_URL}/api/donations/donor/${user.id}`);
        const json = await res.json();
        if (json.status === 'success') {
          const rows = Array.isArray(json.data) ? json.data : [];
          const units = rows.reduce((s, r) => s + (Number(r.units)||0), 0);
          setDonStats({ totalDonations: rows.length, lives: units * 3 });
        }
      } catch (e) {
        setFeedError(e.message || 'Failed to load community feed');
      } finally {
        setFeedLoading(false);
      }
    };
    load();
  }, [user?.id]);

  // Events live data
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState('');
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setEventsLoading(true);
        setEventsError('');
        const data = await communityService.getEvents({ upcoming: true });
        setEvents(Array.isArray(data) ? data : []);
      } catch (e) {
        setEventsError(e?.message || 'Failed to load events');
      } finally {
        setEventsLoading(false);
      }
    };
    loadEvents();
  }, []);

  // Leaderboard live data
  const [topDonors, setTopDonors] = useState([]);
  const [leaderLoading, setLeaderLoading] = useState(false);
  const [leaderError, setLeaderError] = useState('');
  useEffect(() => {
    const loadBoard = async () => {
      try {
        setLeaderLoading(true);
        setLeaderError('');
        const data = await communityService.getLeaderboard({ limit: 10 });
        setTopDonors(Array.isArray(data) ? data : []);
      } catch (e) {
        setLeaderError(e?.message || 'Failed to load leaderboard');
      } finally {
        setLeaderLoading(false);
      }
    };
    loadBoard();
  }, []);

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
              <p className="text-3xl font-bold text-red-600 mt-2">{donStats.totalDonations.toLocaleString()}</p>
            </div>
            <Award className="w-12 h-12 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Lives Impacted</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{donStats.lives.toLocaleString()}</p>
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
                      <button
                        disabled={posting || !newPost.trim()}
                        onClick={async () => {
                          if (!newPost.trim() || !user?.id) return;
                          try {
                            setPosting(true);
                            setPostError('');
                            const created = await communityService.createPost({
                              authorId: user.id,
                              content: newPost.trim(),
                              type: 'story',
                            });
                            // Prepend to feed
                            setFeed([
                              {
                                id: created.id,
                                author: {
                                  name: created.author_name || (user.name || user.email || 'You'),
                                  avatar: (created.author_name || user.name || 'YN').split(' ').map(s => s[0]).join('').slice(0,2).toUpperCase(),
                                  bloodType: created.author_blood_type || '—',
                                  donations: undefined,
                                  level: 'POST'
                                },
                                content: created.content,
                                timestamp: new Date(created.created_at || Date.now()).toLocaleString(),
                                likes: 0,
                                comments: 0,
                                image: null,
                                type: created.type || 'story'
                              },
                              ...feed,
                            ]);
                            setNewPost('');
                          } catch (e) {
                            setPostError(e?.message || 'Failed to create post');
                          } finally {
                            setPosting(false);
                          }
                        }}
                        className="flex items-center space-x-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                        <span>{posting ? 'Posting...' : 'Post'}</span>
                      </button>
                    </div>
                    {postError && (
                      <div className="mt-2 text-sm text-red-600">{postError}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Posts Feed (real-time via notifications) */}
              {feedError && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">{feedError}</div>
              )}
              {feedLoading && (
                <div className="text-sm text-gray-600">Loading feed...</div>
              )}
              {feed.map((post) => (
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
              {eventsError && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">{eventsError}</div>
              )}
              {eventsLoading && (
                <div className="text-sm text-gray-600">Loading events...</div>
              )}
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
                {leaderError && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">{leaderError}</div>
                )}
                {leaderLoading && (
                  <div className="text-sm text-gray-600">Loading leaderboard...</div>
                )}
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
                              {donor.blood_type || donor.bloodType}
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
