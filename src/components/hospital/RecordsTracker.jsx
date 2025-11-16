import React, { useState } from 'react';
import { FileText, Download, Search, TrendingUp, Users, Droplet } from 'lucide-react';
import { format } from 'date-fns';

const RecordsTracker = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const donationRecords = [
    {
      id: 'DN-2025-001',
      donorName: 'John Smith',
      bloodType: 'O+',
      units: 1,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'completed',
      testResults: 'Passed',
    },
    {
      id: 'DN-2025-002',
      donorName: 'Sarah Johnson',
      bloodType: 'A+',
      units: 1,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: 'completed',
      testResults: 'Passed',
    },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      processing: 'bg-yellow-100 text-yellow-800',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{status}</span>;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Donation Records Tracker</h3>
          <p className="text-sm text-gray-600 mt-1">Complete donation history</p>
        </div>
        <button className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <FileText className="w-5 h-5 text-blue-600 mb-2" />
          <p className="text-2xl font-bold text-blue-900">2,456</p>
          <p className="text-xs text-blue-600">Total Records</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <Droplet className="w-5 h-5 text-green-600 mb-2" />
          <p className="text-2xl font-bold text-green-900">156</p>
          <p className="text-xs text-green-600">This Month</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <Users className="w-5 h-5 text-yellow-600 mb-2" />
          <p className="text-2xl font-bold text-yellow-900">1,248</p>
          <p className="text-xs text-yellow-600">Unique Donors</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <TrendingUp className="w-5 h-5 text-purple-600 mb-2" />
          <p className="text-2xl font-bold text-purple-900">98.5%</p>
          <p className="text-xs text-purple-600">Success Rate</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-4 py-2 border rounded-lg">
          <option value="all">All Types</option>
          <option value="O+">O+</option>
          <option value="A+">A+</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 text-sm font-semibold">ID</th>
              <th className="text-left py-3 px-4 text-sm font-semibold">Donor</th>
              <th className="text-left py-3 px-4 text-sm font-semibold">Blood Type</th>
              <th className="text-left py-3 px-4 text-sm font-semibold">Date</th>
              <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {donationRecords.map((record) => (
              <tr key={record.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-sm">{record.id}</td>
                <td className="py-3 px-4 text-sm">{record.donorName}</td>
                <td className="py-3 px-4"><span className="bg-red-100 text-red-700 px-2 py-1 rounded font-bold text-sm">{record.bloodType}</span></td>
                <td className="py-3 px-4 text-sm">{format(record.date, 'MMM dd, yyyy')}</td>
                <td className="py-3 px-4">{getStatusBadge(record.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecordsTracker;
