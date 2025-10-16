import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Phone, RefreshCw, AlertTriangle } from 'lucide-react';
import Navbar from '../components/Navbar';
import donorService from '../services/donorService';
import hospitalService from '../services/hospitalService';

function FindBlood() {
  const [activeTab, setActiveTab] = useState('donors');
  const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [donors, setDonors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Fetch donors and hospitals on component mount
  useEffect(() => {
    fetchDonors();
    fetchHospitals();
  }, []);

  const fetchDonors = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await donorService.getAllDonors();
      setDonors(response.data || []);
    } catch (err) {
      setError('Failed to load donors');
      console.error('Error fetching donors:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHospitals = async () => {
    try {
      const response = await hospitalService.getAllHospitals();
      setHospitals(response.data || []);
    } catch (err) {
      console.error('Error fetching hospitals:', err);
    }
  };

  const handleRefresh = () => {
    if (activeTab === 'donors') {
      fetchDonors();
    } else {
      fetchHospitals();
    }
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
                  disabled={isLoading}
                >
                  <span>{isLoading ? 'Loading...' : 'Refresh'}</span>
                  <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              {isLoading ? (
                <div className="text-center py-8 text-gray-500">Loading donors...</div>
              ) : donors.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No donors found</div>
              ) : (
                <ul className="space-y-4">
                  {donors.map((donor, index) => (
                    <li key={donor.id || index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition">
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-black rounded-full mr-4"></span>
                        <div>
                          <div className="font-medium text-gray-900">
                            {donor.firstName} {donor.lastName}
                          </div>
                          <div className="text-sm text-gray-600">{donor.phoneNumber}</div>
                          <div className="text-xs text-gray-500">
                            {donor.district}, {donor.state}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                          {donor.bloodGroup}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">Age: {donor.age}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

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
            <div className="flex justify-end mb-4">
              <button
                onClick={handleRefresh}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition"
                disabled={isLoading}
              >
                <span>{isLoading ? 'Loading...' : 'Refresh'}</span>
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {hospitals.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No hospitals found</div>
            ) : (
              <ul className="space-y-4">
                {hospitals.map((hospital, index) => (
                  <li key={hospital.id || index} className="p-4 hover:bg-gray-50 rounded-lg transition border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{hospital.hospitalName}</h3>
                        <p className="text-sm text-gray-600 mt-1">{hospital.address}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Head: {hospital.headOfHospital}
                        </p>
                      </div>
                      <div className="text-right">
                        <a 
                          href={`tel:${hospital.phoneNumber}`}
                          className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                          <Phone className="w-4 h-4" />
                          <span>{hospital.phoneNumber}</span>
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FindBlood;
