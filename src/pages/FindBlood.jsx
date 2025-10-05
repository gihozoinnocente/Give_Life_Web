import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Phone, RefreshCw, AlertTriangle } from 'lucide-react';

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
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-600 hover:text-gray-900 transition">
                Home
              </Link>
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition">
                About Us
              </a>
              <Link to="/find-blood" className="text-gray-900 font-medium border-b-2 border-gray-900 pb-1">
                Find Blood
              </Link>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setRegisterDropdownOpen(!registerDropdownOpen)}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition"
                >
                  Register Now
                  <ChevronDown className="ml-1 w-4 h-4" />
                </button>
                {registerDropdownOpen && (
                  <div className="absolute top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                    <Link 
                      to="/register-donor" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      onClick={() => setRegisterDropdownOpen(false)}
                    >
                      Register as Donor
                    </Link>
                    <Link 
                      to="/register-hospital" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      onClick={() => setRegisterDropdownOpen(false)}
                    >
                      Register as Hospital
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="hidden md:block">
              <button className="px-6 py-2 border-2 border-gray-900 text-gray-900 rounded hover:bg-gray-900 hover:text-white transition">
                Log In
              </button>
            </div>
          </div>
        </nav>
      </header>

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
