import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function AdminInventoryChart({ data }) {
  const chartData = (data && data.length)
    ? data
    : [
        { bloodType: 'A+', units: 0 },
        { bloodType: 'A-', units: 0 },
        { bloodType: 'B+', units: 0 },
        { bloodType: 'B-', units: 0 },
        { bloodType: 'O+', units: 0 },
        { bloodType: 'O-', units: 0 },
        { bloodType: 'AB+', units: 0 },
        { bloodType: 'AB-', units: 0 },
      ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">System-wide Blood Inventory</h3>
        <p className="text-sm text-gray-600 mt-1">Aggregated units across all hospitals by blood type</p>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData}>
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
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AdminInventoryChart;
