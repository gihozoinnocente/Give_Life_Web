import React, { useState } from 'react';
import { Droplet, Plus, Minus, AlertCircle, TrendingUp, Download } from 'lucide-react';

function BloodInventory() {
  const [inventory, setInventory] = useState([
    { bloodType: 'A+', units: 45, criticalLevel: 20, status: 'good', trend: 'up', percentage: 5 },
    { bloodType: 'A-', units: 12, criticalLevel: 15, status: 'low', trend: 'down', percentage: 8 },
    { bloodType: 'B+', units: 38, criticalLevel: 20, status: 'good', trend: 'up', percentage: 3 },
    { bloodType: 'B-', units: 8, criticalLevel: 15, status: 'critical', trend: 'down', percentage: 12 },
    { bloodType: 'AB+', units: 22, criticalLevel: 15, status: 'good', trend: 'stable', percentage: 0 },
    { bloodType: 'AB-', units: 6, criticalLevel: 10, status: 'low', trend: 'down', percentage: 5 },
    { bloodType: 'O+', units: 52, criticalLevel: 25, status: 'good', trend: 'up', percentage: 7 },
    { bloodType: 'O-', units: 14, criticalLevel: 20, status: 'low', trend: 'down', percentage: 10 }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'low':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingUp className="w-4 h-4 text-red-600 transform rotate-180" />;
    return <div className="w-4 h-4" />;
  };

  const totalUnits = inventory.reduce((sum, item) => sum + item.units, 0);
  const criticalItems = inventory.filter(item => item.status === 'critical').length;
  const lowItems = inventory.filter(item => item.status === 'low').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blood Inventory</h1>
          <p className="text-gray-600 mt-1">Manage and monitor blood stock levels</p>
        </div>
        <button className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition shadow-lg">
          <Download className="w-5 h-5" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Units</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalUnits}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Droplet className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Low Stock</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{lowItems}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Critical</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{criticalItems}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {inventory.map((item) => (
          <div
            key={item.bloodType}
            className={`bg-white rounded-xl shadow-sm p-6 border-2 ${
              item.status === 'critical' ? 'border-red-300' : 
              item.status === 'low' ? 'border-yellow-300' : 
              'border-transparent'
            }`}
          >
            {/* Blood Type Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <Droplet className="w-6 h-6 text-white" fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{item.bloodType}</h3>
                  <p className="text-xs text-gray-500">Blood Type</p>
                </div>
              </div>
            </div>

            {/* Units Display */}
            <div className="mb-4">
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-bold text-gray-900">{item.units}</span>
                <span className="text-gray-600">units</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                {getTrendIcon(item.trend)}
                <span className={`text-sm ${
                  item.trend === 'up' ? 'text-green-600' : 
                  item.trend === 'down' ? 'text-red-600' : 
                  'text-gray-600'
                }`}>
                  {item.percentage > 0 ? `${item.percentage}%` : 'Stable'}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Critical: {item.criticalLevel}</span>
                <span>{Math.round((item.units / (item.criticalLevel * 2)) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    item.status === 'critical' ? 'bg-red-600' :
                    item.status === 'low' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((item.units / (item.criticalLevel * 2)) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Status Badge */}
            <div className={`px-3 py-1 rounded-full text-xs font-semibold text-center border ${getStatusColor(item.status)}`}>
              {item.status.toUpperCase()}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 mt-4">
              <button className="flex-1 flex items-center justify-center space-x-1 bg-green-50 text-green-700 px-3 py-2 rounded-lg hover:bg-green-100 transition text-sm font-medium">
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-1 bg-red-50 text-red-700 px-3 py-2 rounded-lg hover:bg-red-100 transition text-sm font-medium">
                <Minus className="w-4 h-4" />
                <span>Use</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Transactions</h2>
        <div className="space-y-3">
          {[
            { type: 'addition', bloodType: 'O+', units: 5, time: '2 hours ago', donor: 'John Doe' },
            { type: 'usage', bloodType: 'A+', units: 3, time: '4 hours ago', patient: 'Emergency Case #1234' },
            { type: 'addition', bloodType: 'B-', units: 2, time: '6 hours ago', donor: 'Jane Smith' },
            { type: 'usage', bloodType: 'O-', units: 4, time: '8 hours ago', patient: 'Surgery Case #5678' }
          ].map((transaction, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  transaction.type === 'addition' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {transaction.type === 'addition' ? (
                    <Plus className="w-5 h-5 text-green-600" />
                  ) : (
                    <Minus className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {transaction.type === 'addition' ? 'Added' : 'Used'} {transaction.units} units of {transaction.bloodType}
                  </p>
                  <p className="text-sm text-gray-600">
                    {transaction.donor || transaction.patient} • {transaction.time}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                transaction.type === 'addition' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {transaction.type === 'addition' ? '+' : '-'}{transaction.units}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BloodInventory;
