import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Phone, RefreshCw, AlertTriangle } from 'lucide-react';
import Navbar from '../components/Navbar';

function FindBlood() {
  const [activeTab, setActiveTab] = useState('donors');
  const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setRegisterDropdownOpen(false);
      }
    };

    if (registerDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [registerDropdownOpen]);

  // Sample donor data
  const donors = [
    { name: 'ABC', contact: 'XXXXXXXXXX' },
    { name: 'DEF', contact: 'XXXXXXXXXX' },
    { name: 'GHI', contact: 'XXXXXXXXXX' },
    { name: 'LMN', contact: 'XXXXXXXXXX' },
    { name: 'XYZ', contact: 'XXXXXXXXXX' }
  ];

  const handleRefresh = () => {
    console.log('Refreshing list...');
    // Add refresh logic here
  };

  const handleAutoCall = () => {
    console.log('Auto-calling donors...');
    alert('Auto-call feature initiated');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Buttons */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-full bg-gray-200 p-1">
            <button
              onClick={() => setActiveTab('donors')}
              className={`px-8 py-3 rounded-full font-medium transition ${
                activeTab === 'donors'
                  ? 'bg-black text-white'
                  : 'bg-transparent text-gray-700 hover:text-gray-900'
              }`}
            >
              Blood Donors
            </button>
            <button
              onClick={() => setActiveTab('hospitals')}
              className={`px-8 py-3 rounded-full font-medium transition ${
                activeTab === 'hospitals'
                  ? 'bg-black text-white'
                  : 'bg-transparent text-gray-700 hover:text-gray-900'
              }`}
            >
              Hospitals
            </button>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'donors' && (
          <div className="space-y-6">
            {/* Info Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-gray-600 mb-2">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                  </p>
                  <p className="text-gray-600">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                  </p>
                </div>
                <div className="ml-6">
                  <button
                    onClick={handleAutoCall}
                    className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
                  >
                    <span>Auto-Call</span>
                    <Phone className="w-5 h-5" />
                  </button>
                  <p className="text-xs text-yellow-600 mt-2 flex items-center">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                    Use in case of emergency
                  </p>
                </div>
              </div>
            </div>

            {/* Donors List */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleRefresh}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition"
                >
                  <span>Refresh</span>
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>

              <ul className="space-y-4">
                {donors.map((donor, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-black rounded-full mr-4"></span>
                    <div>
                      <div className="font-medium text-gray-900">{donor.name}</div>
                      <div className="text-gray-600">{donor.contact}</div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <details className="cursor-pointer">
                  <summary className="flex items-center text-gray-700 hover:text-gray-900">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    <span>Call Main Coordinator If The Above Contacts Are Not Available</span>
                    <ChevronDown className="w-5 h-5 ml-auto" />
                  </summary>
                  <div className="mt-4 pl-7 text-gray-600">
                    <p>Main Coordinator Contact: +250 XXX XXX XXX</p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hospitals' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Hospital listings will be displayed here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FindBlood;
