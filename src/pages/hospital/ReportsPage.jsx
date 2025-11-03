import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, Search, Eye, Printer, Share2, TrendingUp, Users, Droplet, Activity } from 'lucide-react';

function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Available reports
  const reports = [
    {
      id: 1,
      title: 'Monthly Donation Summary',
      category: 'donations',
      description: 'Complete overview of all donations received this month',
      period: 'October 2025',
      generatedDate: '2025-10-21',
      size: '2.4 MB',
      pages: 15,
      format: 'PDF',
      icon: Droplet,
      color: 'red',
      stats: {
        totalDonations: 156,
        totalUnits: 428,
        newDonors: 23
      }
    },
    {
      id: 2,
      title: 'Blood Inventory Report',
      category: 'inventory',
      description: 'Current stock levels and usage patterns for all blood types',
      period: 'October 2025',
      generatedDate: '2025-10-21',
      size: '1.8 MB',
      pages: 8,
      format: 'PDF',
      icon: Activity,
      color: 'blue',
      stats: {
        totalUnits: 197,
        lowStock: 3,
        critical: 1
      }
    },
    {
      id: 3,
      title: 'Donor Demographics Report',
      category: 'donors',
      description: 'Detailed analysis of donor demographics and trends',
      period: 'Q3 2025',
      generatedDate: '2025-10-15',
      size: '3.2 MB',
      pages: 22,
      format: 'PDF',
      icon: Users,
      color: 'green',
      stats: {
        totalDonors: 1248,
        activeDonors: 856,
        newRegistrations: 89
      }
    },
    {
      id: 4,
      title: 'Request Fulfillment Report',
      category: 'requests',
      description: 'Analysis of blood request processing and fulfillment rates',
      period: 'October 2025',
      generatedDate: '2025-10-20',
      size: '1.5 MB',
      pages: 10,
      format: 'PDF',
      icon: TrendingUp,
      color: 'purple',
      stats: {
        totalRequests: 156,
        fulfilled: 147,
        fulfillmentRate: '94.3%'
      }
    },
    {
      id: 5,
      title: 'Annual Blood Donation Report',
      category: 'donations',
      description: 'Comprehensive yearly report of all donation activities',
      period: '2024',
      generatedDate: '2025-01-05',
      size: '8.7 MB',
      pages: 45,
      format: 'PDF',
      icon: FileText,
      color: 'orange',
      stats: {
        totalDonations: 1842,
        totalUnits: 5126,
        livesSaved: 15378
      }
    },
    {
      id: 6,
      title: 'Emergency Response Report',
      category: 'requests',
      description: 'Critical and urgent blood request handling analysis',
      period: 'October 2025',
      generatedDate: '2025-10-21',
      size: '1.2 MB',
      pages: 6,
      format: 'PDF',
      icon: Activity,
      color: 'red',
      stats: {
        urgentRequests: 23,
        responseTime: '2.4h',
        successRate: '96.2%'
      }
    }
  ];

  const categories = [
    { value: 'all', label: 'All Reports', count: reports.length },
    { value: 'donations', label: 'Donations', count: reports.filter(r => r.category === 'donations').length },
    { value: 'inventory', label: 'Inventory', count: reports.filter(r => r.category === 'inventory').length },
    { value: 'donors', label: 'Donors', count: reports.filter(r => r.category === 'donors').length },
    { value: 'requests', label: 'Requests', count: reports.filter(r => r.category === 'requests').length }
  ];

  const filteredReports = reports.filter(report => {
    if (selectedCategory !== 'all' && report.category !== selectedCategory) return false;
    return true;
  });

  const getColorClasses = (color) => {
    const colors = {
      red: 'bg-red-100 text-red-600',
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Generate and download comprehensive reports</p>
        </div>
        <button className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition shadow-lg">
          <FileText className="w-5 h-5" />
          <span>Generate New Report</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
            </div>
            <FileText className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">4</p>
            </div>
            <Calendar className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Downloads</p>
              <p className="text-2xl font-bold text-gray-900">128</p>
            </div>
            <Download className="w-10 h-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Size</p>
              <p className="text-2xl font-bold text-gray-900">18.8 MB</p>
            </div>
            <Activity className="w-10 h-10 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCategory === category.value
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredReports.map((report) => {
          const Icon = report.icon;
          return (
            <div
              key={report.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-6 border border-gray-200"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${getColorClasses(report.color)}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{report.title}</h3>
                    <p className="text-sm text-gray-600">{report.description}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                {Object.entries(report.stats).map(([key, value], index) => (
                  <div key={index} className="text-center">
                    <p className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <p className="text-lg font-bold text-gray-900">{value}</p>
                  </div>
                ))}
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                <div>
                  <p className="text-xs text-gray-500">Period</p>
                  <p className="font-semibold">{report.period}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Generated</p>
                  <p className="font-semibold">{new Date(report.generatedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Format</p>
                  <p className="font-semibold">{report.format}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Size</p>
                  <p className="font-semibold">{report.size} ({report.pages} pages)</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button className="flex-1 flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
                <button className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button className="flex items-center justify-center bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition">
                  <Printer className="w-4 h-4" />
                </button>
                <button className="flex items-center justify-center bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredReports.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reports Found</h3>
          <p className="text-gray-600 mb-6">No reports match your current filters</p>
          <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">
            Generate New Report
          </button>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Scheduled Reports</h3>
            <p className="text-blue-100 mb-4">
              Automatically generate and email reports on a schedule
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                <p className="text-sm text-blue-100">Daily Summary</p>
                <p className="font-bold">Active</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                <p className="text-sm text-blue-100">Weekly Report</p>
                <p className="font-bold">Active</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                <p className="text-sm text-blue-100">Monthly Report</p>
                <p className="font-bold">Active</p>
              </div>
            </div>
          </div>
          <button className="hidden md:block bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
            Manage Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;
