import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Droplet, Plus, Minus, AlertCircle, TrendingUp, Download, RefreshCw } from 'lucide-react';
import * as inventoryService from '../../services/inventoryService';

function BloodInventory() {
  const { user } = useSelector((state) => state.auth);
  const hospitalId = user?.id;
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateStatus = (units, criticalLevel) => {
    if (units < criticalLevel) return 'critical';
    if (units < criticalLevel * 1.5) return 'low';
    return 'good';
  };

  const fetchInventory = async () => {
    if (!hospitalId) return;
    try {
      setLoading(true);
      setError('');
      const data = await inventoryService.getHospitalInventory(hospitalId);
      const mapped = (data || []).map((row) => ({
        bloodType: row.blood_type,
        units: row.units_available,
        criticalLevel: row.critical_level ?? 15,
        status: calculateStatus(row.units_available, row.critical_level ?? 15),
        trend: 'stable',
        percentage: 0,
      }));
      // Ensure all blood types exist even if zero
      const BLOOD_TYPES = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];
      const byType = Object.fromEntries(mapped.map(m => [m.bloodType, m]));
      const completed = BLOOD_TYPES.map(bt => byType[bt] || ({
        bloodType: bt,
        units: 0,
        criticalLevel: 15,
        status: calculateStatus(0, 15),
        trend: 'stable',
        percentage: 0,
      }));
      setInventory(completed);
    } catch (e) {
      setError(e.message || 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hospitalId]);

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
        <div className="flex items-center space-x-2">
          <button onClick={fetchInventory} disabled={loading} className="flex items-center space-x-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition shadow-sm disabled:opacity-50">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition shadow-lg">
            <Download className="w-5 h-5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">{error}</div>
      )}
      {loading && (
        <div className="text-sm text-gray-600">Loading inventory...</div>
      )}

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

          </div>
        ))}
      </div>
    </div>
  );
}

export default BloodInventory;
