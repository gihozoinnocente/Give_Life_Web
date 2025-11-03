import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RequestsChart = ({ data }) => {
  const requestData = data || [
    { month: 'Jan', requests: 45, fulfilled: 42 },
    { month: 'Feb', requests: 52, fulfilled: 48 },
    { month: 'Mar', requests: 48, fulfilled: 45 },
    { month: 'Apr', requests: 61, fulfilled: 58 },
    { month: 'May', requests: 55, fulfilled: 52 },
    { month: 'Jun', requests: 67, fulfilled: 63 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">Blood Request Trends</h3>
        <p className="text-sm text-gray-600 mt-1">Monthly requests vs fulfilled donations</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={requestData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="requests" 
            stroke="#3b82f6" 
            strokeWidth={3}
            name="Total Requests"
            dot={{ fill: '#3b82f6', r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="fulfilled" 
            stroke="#10b981" 
            strokeWidth={3}
            name="Fulfilled"
            dot={{ fill: '#10b981', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RequestsChart;
