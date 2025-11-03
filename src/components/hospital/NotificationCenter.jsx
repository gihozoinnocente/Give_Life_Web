import React, { useState, useEffect } from 'react';
import { Bell, Send, Phone, Mail, Users, X, Check } from 'lucide-react';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [notificationForm, setNotificationForm] = useState({
    type: 'push',
    bloodType: '',
    urgency: 'normal',
    message: '',
    recipients: 'all',
  });
  const [sending, setSending] = useState(false);

  // Mock notification history
  const notificationHistory = [
    {
      id: 1,
      type: 'push',
      bloodType: 'O+',
      message: 'Urgent: Need O+ blood donors',
      recipients: 45,
      sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'delivered',
    },
    {
      id: 2,
      type: 'sms',
      bloodType: 'AB-',
      message: 'Critical shortage of AB- blood',
      recipients: 12,
      sentAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      status: 'delivered',
    },
    {
      id: 3,
      type: 'push',
      bloodType: 'A+',
      message: 'Blood donation drive tomorrow',
      recipients: 120,
      sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'delivered',
    },
  ];

  const handleSendNotification = async (e) => {
    e.preventDefault();
    setSending(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Sending notification:', notificationForm);
      setSending(false);
      setShowModal(false);
      setNotificationForm({
        type: 'push',
        bloodType: '',
        urgency: 'normal',
        message: '',
        recipients: 'all',
      });
      // Show success message
      alert('Notification sent successfully!');
    }, 1500);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'push':
        return <Bell className="w-5 h-5" />;
      case 'sms':
        return <Phone className="w-5 h-5" />;
      case 'email':
        return <Mail className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getTypeBadge = (type) => {
    const styles = {
      push: 'bg-blue-100 text-blue-800',
      sms: 'bg-green-100 text-green-800',
      email: 'bg-purple-100 text-purple-800',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[type]}`}>
        {type.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Notification Center</h3>
          <p className="text-sm text-gray-600 mt-1">Send alerts to donors in real-time</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          <Send className="w-4 h-4" />
          <span>Send Notification</span>
        </button>
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Push</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">1,245</p>
          <p className="text-xs text-blue-600">This month</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Phone className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">SMS</span>
          </div>
          <p className="text-2xl font-bold text-green-900">856</p>
          <p className="text-xs text-green-600">This month</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Mail className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Email</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">432</p>
          <p className="text-xs text-purple-600">This month</p>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900 text-sm">Recent Notifications</h4>
        {notificationHistory.map((notification) => (
          <div
            key={notification.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                {getTypeIcon(notification.type)}
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  {getTypeBadge(notification.type)}
                  <span className="text-xs font-medium text-red-600">{notification.bloodType}</span>
                </div>
                <p className="text-sm text-gray-900 font-medium">{notification.message}</p>
                <p className="text-xs text-gray-500">
                  {notification.recipients} recipients • {new Date(notification.sentAt).toLocaleString()}
                </p>
              </div>
            </div>
            <Check className="w-5 h-5 text-green-600" />
          </div>
        ))}
      </div>

      {/* Send Notification Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Send Notification</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSendNotification} className="space-y-4">
                {/* Notification Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notification Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['push', 'sms', 'email'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setNotificationForm({ ...notificationForm, type })}
                        className={`p-3 rounded-lg border-2 transition ${
                          notificationForm.type === type
                            ? 'border-red-600 bg-red-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          {getTypeIcon(type)}
                          <span className="text-xs font-medium mt-1 capitalize">{type}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Blood Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Type (Optional)
                  </label>
                  <select
                    value={notificationForm.bloodType}
                    onChange={(e) =>
                      setNotificationForm({ ...notificationForm, bloodType: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">All Blood Types</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                {/* Urgency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Urgency</label>
                  <select
                    value={notificationForm.urgency}
                    onChange={(e) =>
                      setNotificationForm({ ...notificationForm, urgency: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High Priority</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={notificationForm.message}
                    onChange={(e) =>
                      setNotificationForm({ ...notificationForm, message: e.target.value })
                    }
                    rows={4}
                    placeholder="Enter your message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {notificationForm.message.length}/160 characters
                  </p>
                </div>

                {/* Recipients */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipients
                  </label>
                  <select
                    value={notificationForm.recipients}
                    onChange={(e) =>
                      setNotificationForm({ ...notificationForm, recipients: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="all">All Eligible Donors</option>
                    <option value="nearby">Nearby Donors Only</option>
                    <option value="frequent">Frequent Donors</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? 'Sending...' : 'Send Notification'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
