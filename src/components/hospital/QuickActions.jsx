import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Users, FileText, Settings, Calendar, MapPin } from 'lucide-react';

const QuickActions = ({ asNavbar = false }) => {
  const actions = [
    {
      title: 'Request Blood',
      description: 'Create new blood request',
      icon: Bell,
      color: 'red',
      link: '/hospital/requests',
    },
    {
      title: 'Find Donors',
      description: 'Search available donors',
      icon: Users,
      color: 'blue',
      link: '/hospital/donors',
    },
    {
      title: 'View Reports',
      description: 'Access analytics & reports',
      icon: FileText,
      color: 'green',
      link: '/hospital/reports',
    },
    {
      title: 'Schedule Drive',
      description: 'Organize donation event',
      icon: Calendar,
      color: 'purple',
      link: '/hospital/appointments',
    },
    {
      title: 'Settings',
      description: 'Manage hospital profile',
      icon: Settings,
      color: 'gray',
      link: '/edit-profile',
    },
  ];

  const colorClasses = {
    red: 'bg-red-50 text-red-600 hover:bg-red-100',
    blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    green: 'bg-green-50 text-green-600 hover:bg-green-100',
    purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
    gray: 'bg-gray-50 text-gray-600 hover:bg-gray-100',
  };

  if (asNavbar) {
    return (
      <nav className="w-full bg-white/90 backdrop-blur border border-gray-200 rounded-xl shadow-sm">
        <ul className="flex items-stretch overflow-x-auto no-scrollbar divide-x divide-gray-200">
          {actions.map((action, index) => (
            <li key={index} className="min-w-[140px]">
              <Link
                to={action.link}
                className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition"
              >
                <action.icon className="w-5 h-5" />
                <span className="text-sm font-medium whitespace-nowrap">{action.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
        <p className="text-sm text-gray-600 mt-1">Frequently used features</p>
      </div>

      <div className="flex flex-col gap-3">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className={`flex items-center gap-4 p-4 rounded-lg transition-all ${colorClasses[action.color]} group`}
          >
            <action.icon className="w-8 h-8 group-hover:scale-110 transition-transform flex-shrink-0" />
            <div className="flex flex-col">
              <h4 className="font-semibold text-sm mb-1">{action.title}</h4>
              <p className="text-xs opacity-80">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
