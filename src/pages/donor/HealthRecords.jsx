import React, { useState } from 'react';
import { FileText, Heart, Activity, Droplet, TrendingUp, Calendar, AlertCircle, CheckCircle, Download, Plus, Edit, Eye, Thermometer, Weight, Ruler, Clock } from 'lucide-react';

function HealthRecords() {
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Health profile data
  const healthProfile = {
    bloodType: 'O+',
    weight: 70, // kg
    height: 175, // cm
    lastCheckup: '2025-09-15',
    eligibilityStatus: 'Eligible',
    nextEligibleDate: '2025-12-15',
    allergies: ['Penicillin'],
    medications: ['None'],
    chronicConditions: ['None']
  };

  // Vital signs history
  const vitalSigns = [
    {
      id: 1,
      date: '2025-09-15',
      bloodPressure: '120/80',
      heartRate: 72,
      temperature: 36.6,
      hemoglobin: 14.5,
      weight: 70,
      status: 'normal'
    },
    {
      id: 2,
      date: '2025-06-20',
      bloodPressure: '118/78',
      heartRate: 70,
      temperature: 36.5,
      hemoglobin: 14.8,
      weight: 69,
      status: 'normal'
    },
    {
      id: 3,
      date: '2025-03-10',
      bloodPressure: '122/82',
      heartRate: 75,
      temperature: 36.7,
      hemoglobin: 14.2,
      weight: 71,
      status: 'normal'
    }
  ];

  // Medical history
  const medicalHistory = [
    {
      id: 1,
      date: '2025-09-15',
      type: 'Pre-Donation Screening',
      hospital: 'King Faisal Hospital',
      doctor: 'Dr. Sarah Johnson',
      notes: 'All vitals normal. Cleared for donation.',
      documents: ['screening_report.pdf']
    },
    {
      id: 2,
      date: '2025-06-20',
      type: 'Annual Health Checkup',
      hospital: 'Kigali Central Hospital',
      doctor: 'Dr. Michael Chen',
      notes: 'Complete blood count normal. Good health status.',
      documents: ['checkup_report.pdf', 'lab_results.pdf']
    },
    {
      id: 3,
      date: '2025-03-10',
      type: 'Pre-Donation Screening',
      hospital: 'King Faisal Hospital',
      doctor: 'Dr. Sarah Johnson',
      notes: 'Hemoglobin slightly low. Advised iron supplements.',
      documents: ['screening_report.pdf']
    }
  ];

  // Donation-related health metrics
  const donationMetrics = {
    totalDonations: 12,
    averageHemoglobin: 14.5,
    averageRecoveryTime: 2, // days
    lastDonation: '2025-09-15',
    nextEligibleDate: '2025-12-15'
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const isEligible = new Date(healthProfile.nextEligibleDate) <= new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Records</h1>
          <p className="text-gray-600 mt-1">Track your health status and donation eligibility</p>
        </div>
        <button 
          onClick={() => setShowAddRecordModal(true)}
          className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Add Record</span>
        </button>
      </div>

      {/* Eligibility Status Card */}
      <div className={`rounded-xl shadow-lg p-6 ${
        isEligible 
          ? 'bg-gradient-to-br from-green-600 to-green-800' 
          : 'bg-gradient-to-br from-orange-600 to-orange-800'
      } text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              {isEligible ? (
                <CheckCircle className="w-8 h-8" />
              ) : (
                <Clock className="w-8 h-8" />
              )}
              <h2 className="text-2xl font-bold">
                {isEligible ? 'Eligible to Donate' : 'Not Yet Eligible'}
              </h2>
            </div>
            <p className="text-sm opacity-90 mb-4">
              {isEligible 
                ? 'You are currently eligible to donate blood. Book an appointment now!' 
                : `You can donate again on ${new Date(healthProfile.nextEligibleDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}`
              }
            </p>
            {isEligible && (
              <button className="bg-white text-green-700 px-6 py-2 rounded-lg font-semibold hover:bg-green-50 transition">
                Book Appointment
              </button>
            )}
          </div>
          <Heart className="hidden md:block w-24 h-24 opacity-20" />
        </div>
      </div>

      {/* Health Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Blood Type</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{healthProfile.bloodType}</p>
            </div>
            <Droplet className="w-12 h-12 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Weight</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{healthProfile.weight}</p>
              <p className="text-xs text-gray-500 mt-1">kg</p>
            </div>
            <Weight className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Height</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{healthProfile.height}</p>
              <p className="text-xs text-gray-500 mt-1">cm</p>
            </div>
            <Ruler className="w-12 h-12 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Hemoglobin</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{donationMetrics.averageHemoglobin}</p>
              <p className="text-xs text-gray-500 mt-1">g/dL</p>
            </div>
            <Activity className="w-12 h-12 text-green-600" />
          </div>
        </div>
      </div>

      {/* Latest Vital Signs */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Latest Vital Signs</h2>
          <span className="text-sm text-gray-500">
            {new Date(vitalSigns[0].date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Blood Pressure</p>
            <p className="text-xl font-bold text-gray-900">{vitalSigns[0].bloodPressure}</p>
            <p className="text-xs text-gray-500">mmHg</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Heart Rate</p>
            <p className="text-xl font-bold text-gray-900">{vitalSigns[0].heartRate}</p>
            <p className="text-xs text-gray-500">bpm</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Thermometer className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Temperature</p>
            <p className="text-xl font-bold text-gray-900">{vitalSigns[0].temperature}</p>
            <p className="text-xs text-gray-500">°C</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Droplet className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Hemoglobin</p>
            <p className="text-xl font-bold text-gray-900">{vitalSigns[0].hemoglobin}</p>
            <p className="text-xs text-gray-500">g/dL</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Weight className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Weight</p>
            <p className="text-xl font-bold text-gray-900">{vitalSigns[0].weight}</p>
            <p className="text-xs text-gray-500">kg</p>
          </div>
        </div>
      </div>

      {/* Health Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <span>Allergies</span>
          </h3>
          <ul className="space-y-2">
            {healthProfile.allergies.map((allergy, index) => (
              <li key={index} className="flex items-center space-x-2 text-gray-700">
                <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                <span>{allergy}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Current Medications</span>
          </h3>
          <ul className="space-y-2">
            {healthProfile.medications.map((medication, index) => (
              <li key={index} className="flex items-center space-x-2 text-gray-700">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>{medication}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Heart className="w-5 h-5 text-red-600" />
            <span>Chronic Conditions</span>
          </h3>
          <ul className="space-y-2">
            {healthProfile.chronicConditions.map((condition, index) => (
              <li key={index} className="flex items-center space-x-2 text-gray-700">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <span>{condition}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Medical History */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Medical History</h2>
        <div className="space-y-4">
          {medicalHistory.map((record) => (
            <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-900">{record.type}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(record.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Hospital:</span> {record.hospital}
                    </div>
                    <div>
                      <span className="font-semibold">Doctor:</span> {record.doctor}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Notes:</span> {record.notes}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {record.documents.map((doc, index) => (
                    <button
                      key={index}
                      className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100 transition"
                    >
                      <Download className="w-4 h-4" />
                      <span>{doc}</span>
                    </button>
                  ))}
                </div>
                <button className="text-gray-600 hover:text-gray-800 p-2 hover:bg-gray-100 rounded-lg transition">
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vital Signs History */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Vital Signs History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Blood Pressure</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Heart Rate</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Temperature</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Hemoglobin</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Weight</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vitalSigns.map((vital) => (
                <tr key={vital.id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {new Date(vital.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">{vital.bloodPressure} mmHg</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{vital.heartRate} bpm</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{vital.temperature} °C</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{vital.hemoglobin} g/dL</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{vital.weight} kg</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(vital.status)}`}>
                      {vital.status.charAt(0).toUpperCase() + vital.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Health Tips */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2 flex items-center space-x-2">
              <TrendingUp className="w-8 h-8" />
              <span>Health Tips for Donors</span>
            </h3>
            <ul className="space-y-2 text-blue-100">
              <li>• Stay hydrated - drink plenty of water before and after donation</li>
              <li>• Eat iron-rich foods to maintain healthy hemoglobin levels</li>
              <li>• Get adequate rest before your donation appointment</li>
              <li>• Avoid heavy exercise for 24 hours after donation</li>
            </ul>
          </div>
          <Heart className="hidden md:block w-24 h-24 text-blue-300 opacity-50" />
        </div>
      </div>
    </div>
  );
}

export default HealthRecords;
