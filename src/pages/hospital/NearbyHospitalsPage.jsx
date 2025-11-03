import React, { useState } from 'react';
import { MapPin, Phone, Navigation, Search, Filter, Hospital, Droplet, Users, TrendingUp, MessageSquare, Share2 } from 'lucide-react';

function NearbyHospitalsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistance, setSelectedDistance] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Sample nearby hospitals data
  const nearbyHospitals = [
    {
      id: 1,
      name: 'King Faisal Hospital',
      type: 'Referral Hospital',
      address: 'KN 4 Ave, Kigali',
      phone: '+250 788 123 456',
      distance: 2.3,
      bloodInventory: {
        'O+': 45,
        'A+': 32,
        'B+': 28,
        'AB+': 15,
        'O-': 12,
        'A-': 8,
        'B-': 6,
        'AB-': 4
      },
      stats: {
        totalDonors: 856,
        monthlyDonations: 234,
        fulfillmentRate: 96
      },
      status: 'active',
      partnership: true
    },
    {
      id: 2,
      name: 'Rwanda Military Hospital',
      type: 'Military Hospital',
      address: 'KG 7 Ave, Kigali',
      phone: '+250 788 234 567',
      distance: 3.8,
      bloodInventory: {
        'O+': 38,
        'A+': 28,
        'B+': 22,
        'AB+': 12,
        'O-': 10,
        'A-': 7,
        'B-': 5,
        'AB-': 3
      },
      stats: {
        totalDonors: 645,
        monthlyDonations: 189,
        fulfillmentRate: 94
      },
      status: 'active',
      partnership: true
    },
    {
      id: 3,
      name: 'University Teaching Hospital',
      type: 'Teaching Hospital',
      address: 'KK 15 Ave, Kigali',
      phone: '+250 788 345 678',
      distance: 5.2,
      bloodInventory: {
        'O+': 52,
        'A+': 35,
        'B+': 30,
        'AB+': 18,
        'O-': 14,
        'A-': 9,
        'B-': 7,
        'AB-': 5
      },
      stats: {
        totalDonors: 1024,
        monthlyDonations: 312,
        fulfillmentRate: 97
      },
      status: 'active',
      partnership: false
    },
    {
      id: 4,
      name: 'Kibagabaga District Hospital',
      type: 'District Hospital',
      address: 'KG 201 St, Kigali',
      phone: '+250 788 456 789',
      distance: 7.5,
      bloodInventory: {
        'O+': 28,
        'A+': 22,
        'B+': 18,
        'AB+': 10,
        'O-': 8,
        'A-': 5,
        'B-': 4,
        'AB-': 2
      },
      stats: {
        totalDonors: 423,
        monthlyDonations: 145,
        fulfillmentRate: 92
      },
      status: 'active',
      partnership: true
    },
    {
      id: 5,
      name: 'Kigali Central Hospital',
      type: 'Referral Hospital',
      address: 'KN 5 Ave, Kigali',
      phone: '+250 788 567 890',
      distance: 8.9,
      bloodInventory: {
        'O+': 42,
        'A+': 30,
        'B+': 25,
        'AB+': 14,
        'O-': 11,
        'A-': 8,
        'B-': 6,
        'AB-': 4
      },
      stats: {
        totalDonors: 734,
        monthlyDonations: 198,
        fulfillmentRate: 95
      },
      status: 'active',
      partnership: false
    },
    {
      id: 6,
      name: 'Muhima District Hospital',
      type: 'District Hospital',
      address: 'KG 9 Ave, Kigali',
      phone: '+250 788 678 901',
      distance: 10.2,
      bloodInventory: {
        'O+': 35,
        'A+': 25,
        'B+': 20,
        'AB+': 12,
        'O-': 9,
        'A-': 6,
        'B-': 5,
        'AB-': 3
      },
      stats: {
        totalDonors: 512,
        monthlyDonations: 167,
        fulfillmentRate: 93
      },
      status: 'active',
      partnership: true
    }
  ];

  const filteredHospitals = nearbyHospitals.filter(hospital => {
    if (searchTerm && !hospital.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (selectedDistance !== 'all') {
      const maxDistance = parseInt(selectedDistance);
      if (hospital.distance > maxDistance) return false;
    }
    if (selectedType !== 'all' && hospital.type !== selectedType) return false;
    return true;
  });

  const getTotalBloodUnits = (inventory) => {
    return Object.values(inventory).reduce((sum, units) => sum + units, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nearby Hospitals</h1>
          <p className="text-gray-600 mt-1">Connect and collaborate with hospitals in your network</p>
        </div>
        <button className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition shadow-lg">
          <Hospital className="w-5 h-5" />
          <span>Request Partnership</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Hospitals</p>
              <p className="text-2xl font-bold text-gray-900">{nearbyHospitals.length}</p>
            </div>
            <Hospital className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Partners</p>
              <p className="text-2xl font-bold text-green-600">
                {nearbyHospitals.filter(h => h.partnership).length}
              </p>
            </div>
            <Users className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Within 5km</p>
              <p className="text-2xl font-bold text-purple-600">
                {nearbyHospitals.filter(h => h.distance <= 5).length}
              </p>
            </div>
            <MapPin className="w-10 h-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Response</p>
              <p className="text-2xl font-bold text-orange-600">94.5%</p>
            </div>
            <TrendingUp className="w-10 h-10 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search hospitals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Distance Filter */}
          <select
            value={selectedDistance}
            onChange={(e) => setSelectedDistance(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Distances</option>
            <option value="5">Within 5 km</option>
            <option value="10">Within 10 km</option>
            <option value="20">Within 20 km</option>
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Types</option>
            <option value="Referral Hospital">Referral Hospital</option>
            <option value="District Hospital">District Hospital</option>
            <option value="Teaching Hospital">Teaching Hospital</option>
            <option value="Military Hospital">Military Hospital</option>
          </select>
        </div>
      </div>

      {/* Hospitals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredHospitals.map((hospital) => (
          <div
            key={hospital.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-6 border border-gray-200"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  {hospital.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">{hospital.name}</h3>
                    {hospital.partnership && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-semibold">
                        Partner
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{hospital.type}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                {hospital.distance} km
              </span>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>{hospital.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{hospital.phone}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-xs text-gray-500">Total Units</p>
                <p className="text-lg font-bold text-gray-900">{getTotalBloodUnits(hospital.bloodInventory)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Donors</p>
                <p className="text-lg font-bold text-gray-900">{hospital.stats.totalDonors}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Response</p>
                <p className="text-lg font-bold text-green-600">{hospital.stats.fulfillmentRate}%</p>
              </div>
            </div>

            {/* Blood Inventory Preview */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Blood Inventory</p>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(hospital.bloodInventory).slice(0, 4).map(([type, units]) => (
                  <div key={type} className="text-center p-2 bg-red-50 rounded">
                    <p className="text-xs font-semibold text-red-700">{type}</p>
                    <p className="text-sm font-bold text-gray-900">{units}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button className="flex-1 flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
                <Navigation className="w-4 h-4" />
                <span>Directions</span>
              </button>
              <button className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
                <MessageSquare className="w-4 h-4" />
                <span>Contact</span>
              </button>
              <button className="flex items-center justify-center bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredHospitals.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Hospital className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Hospitals Found</h3>
          <p className="text-gray-600 mb-6">No hospitals match your current filters</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedDistance('all');
              setSelectedType('all');
            }}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Network Map Placeholder */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Hospital Network Map</h3>
            <p className="text-purple-100 mb-4">
              View all hospitals on an interactive map with real-time inventory
            </p>
            <button className="bg-white text-purple-700 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition">
              Open Map View
            </button>
          </div>
          <MapPin className="hidden md:block w-24 h-24 text-purple-300 opacity-50" />
        </div>
      </div>
    </div>
  );
}

export default NearbyHospitalsPage;
