import React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const RecentRequests = ({ requests }) => {
  const mockRequests = requests || [
    {
      id: 1,
      bloodType: 'O+',
      units: 3,
      urgency: 'critical',
      status: 'pending',
      requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      patientName: 'John Doe',
    },
    {
      id: 2,
      bloodType: 'A-',
      units: 2,
      urgency: 'high',
      status: 'fulfilled',
      requestedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      patientName: 'Jane Smith',
    },
    {
      id: 3,
      bloodType: 'B+',
      units: 1,
      urgency: 'medium',
      status: 'pending',
      requestedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      patientName: 'Mike Johnson',
    },
    {
      id: 4,
      bloodType: 'AB+',
      units: 2,
      urgency: 'low',
      status: 'cancelled',
      requestedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      patientName: 'Sarah Williams',
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'fulfilled':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      fulfilled: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getUrgencyBadge = (urgency) => {
    const styles = {
      critical: 'bg-red-600 text-white',
      high: 'bg-orange-500 text-white',
      medium: 'bg-yellow-500 text-white',
      low: 'bg-blue-500 text-white',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[urgency]}`}>
        {urgency.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Recent Blood Requests</h3>
          <p className="text-sm text-gray-600 mt-1">Latest requests from your hospital</p>
        </div>
        <Link to="/hospital/requests" className="text-sm font-medium text-red-600 hover:text-red-700">
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {mockRequests.map((request) => (
          <div
            key={request.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-700 font-bold text-lg">{request.bloodType}</span>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <p className="font-semibold text-gray-900">{request.patientName}</p>
                  {getUrgencyBadge(request.urgency)}
                </div>
                <p className="text-sm text-gray-600">
                  {request.units} {request.units === 1 ? 'unit' : 'units'} • {formatDistanceToNow(request.requestedAt, { addSuffix: true })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusIcon(request.status)}
              {getStatusBadge(request.status)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentRequests;
