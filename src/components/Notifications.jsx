import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Bell, X, AlertCircle, Clock, MapPin, Phone } from 'lucide-react';
import { fetchNotifications, markNotificationAsRead, deleteNotification } from '../features/notifications/notificationSlice';

function Notifications({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { notifications, isLoading } = useSelector((state) => state.notifications);

  useEffect(() => {
    if (isOpen && user) {
      console.log('Fetching notifications for user:', user.id);
      dispatch(fetchNotifications(user.id));
    }
  }, [isOpen, user, dispatch]);

  useEffect(() => {
    console.log('Notifications updated:', notifications);
  }, [notifications]);

  const handleMarkAsRead = (notificationId) => {
    dispatch(markNotificationAsRead(notificationId));
  };

  const handleDelete = (notificationId) => {
    dispatch(deleteNotification(notificationId));
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'urgent':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getUrgencyLabel = (urgency) => {
    switch (urgency) {
      case 'critical':
        return 'CRITICAL';
      case 'urgent':
        return 'URGENT';
      default:
        return 'NORMAL';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Transparent Backdrop - Click to close */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Notification Panel */}
      <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 overflow-hidden flex flex-col border-l border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 to-pink-700 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Notifications</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
              <Bell className="w-16 h-16 mb-4" />
              <p className="text-center">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {notification.data?.urgency && (
                        <div className={`px-2 py-1 rounded text-xs font-bold ${getUrgencyColor(notification.data.urgency)}`}>
                          {getUrgencyLabel(notification.data.urgency)}
                        </div>
                      )}
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification.id);
                      }}
                      className="p-1 hover:bg-gray-200 rounded transition"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  <h3 className="font-bold text-gray-900 mb-2">
                    {notification.title}
                  </h3>

                  <p className="text-sm text-gray-700 mb-3">
                    {notification.message}
                  </p>

                  {notification.data && (
                    <div className="space-y-2 text-sm text-gray-600 mb-3 bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <span className="font-medium">{notification.data.hospitalName}</span>
                      </div>
                      
                      {notification.data.location && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{notification.data.location}</span>
                        </div>
                      )}

                      {notification.data.contactPhone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <a href={`tel:${notification.data.contactPhone}`} className="text-blue-600 hover:underline">
                            {notification.data.contactPhone}
                          </a>
                        </div>
                      )}

                      {notification.data.contactPerson && (
                        <p className="text-xs text-gray-500">
                          Contact: {notification.data.contactPerson}
                        </p>
                      )}

                      {notification.data.patientCondition && (
                        <p className="text-sm text-gray-600 italic border-l-2 border-gray-300 pl-2">
                          "{notification.data.patientCondition}"
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(notification.createdAt).toLocaleString()}</span>
                    </div>
                    {notification.data?.expiryDate && (
                      <span className="text-red-500">
                        Expires: {new Date(notification.data.expiryDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {notification.data?.contactPhone && (
                    <a 
                      href={`tel:${notification.data.contactPhone}`}
                      className="block w-full bg-red-700 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-800 transition text-center"
                    >
                      Call Hospital
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Notifications;
