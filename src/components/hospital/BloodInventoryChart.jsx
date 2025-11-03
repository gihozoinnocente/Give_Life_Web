import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BloodInventoryChart = ({ data }) => {
  const bloodData = data || [
    { bloodType: 'A+', units: 45, critical: 20 },
    { bloodType: 'A-', units: 12, critical: 10 },
    { bloodType: 'B+', units: 38, critical: 20 },
    { bloodType: 'B-', units: 8, critical: 10 },
    { bloodType: 'O+', units: 52, critical: 25 },
    { bloodType: 'O-', units: 15, critical: 15 },
    { bloodType: 'AB+', units: 22, critical: 15 },
    { bloodType: 'AB-', units: 6, critical: 10 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">Blood Inventory Status</h3>
        <p className="text-sm text-gray-600 mt-1">Current units available by blood type</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={bloodData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="bloodType" stroke="#6b7280" />
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
          <Bar dataKey="units" fill="#dc2626" name="Available Units" radius={[8, 8, 0, 0]} />
          <Bar dataKey="critical" fill="#fbbf24" name="Critical Level" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BloodInventoryChart;
