import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Plus, FileText, User, Calendar, Activity, Droplet, AlertCircle, Eye, Thermometer, Weight, Heart } from 'lucide-react';
import hospitalService from '../../services/hospitalService';
import { useToast } from '../../components/ToastProvider.jsx';

function HealthRecords() {
  const toast = useToast();
  const { user } = useSelector((state) => state.auth);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [donors, setDonors] = useState([]);
  const [donorsLoading, setDonorsLoading] = useState(false);
  const [donorsError, setDonorsError] = useState('');
  const [form, setForm] = useState({
    donorId: '',
    age: '',
    bloodType: '',
    status: 'stable',
    lastVisit: '',
    weight: '',
    height: '',
    temperature: '',
    bloodPressure: '',
    heartRate: '',
    hemoglobin: '',
    allergies: '',
    medications: '',
    chronicConditions: '',
    hospitalNotes: ''
  });

  const loadRecords = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError('');
      const res = await hospitalService.getHealthRecords(user.id);
      const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      setRecords(list);
    } catch (err) {
      const message = typeof err === 'string' ? err : err?.message || 'Failed to load health records';
      setError(message);
      try {
        toast.error(message);
      } catch (_) {}
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [user?.id]);

  // Load donors for dropdown when modal is opened
  useEffect(() => {
    const loadDonors = async () => {
      if (!user?.id || !isAddOpen) return;
      try {
        setDonorsLoading(true);
        setDonorsError('');
        const res = await hospitalService.getHospitalDonors(user.id);
        const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        setDonors(list);
      } catch (err) {
        const message = typeof err === 'string' ? err : err?.message || 'Failed to load donors';
        setDonorsError(message);
        try {
          toast.error(message);
        } catch (_) {}
      } finally {
        setDonorsLoading(false);
      }
    };

    loadDonors();
  }, [user?.id, isAddOpen]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'stable':
        return 'bg-green-100 text-green-700';
      case 'attention':
        return 'bg-yellow-100 text-yellow-700';
      case 'critical':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Records</h1>
          <p className="text-gray-600 mt-1">
            Manage and review all patient health records registered to this hospital.
          </p>
        </div>
        <div>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold shadow-sm hover:bg-red-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Health Record
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-white border-l-4 border-red-400 rounded-xl shadow-sm p-4 text-sm flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <p className="text-gray-900 font-medium">There was a problem loading health records.</p>
            <p className="text-gray-600 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Records</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{records.length}</p>
          </div>
          <FileText className="w-10 h-10 text-red-500" />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Stable Patients</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{records.filter(r => r.status === 'stable').length}</p>
          </div>
          <Activity className="w-10 h-10 text-green-500" />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Need Attention</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{records.filter(r => r.status !== 'stable').length}</p>
          </div>
          <AlertCircle className="w-10 h-10 text-yellow-500" />
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-600">Loading health records...</div>
        ) : records.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No health records found for this hospital.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Donor Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Blood Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Visit</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{record.patientName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-red-50 text-red-700">
                        <Droplet className="w-3 h-3 mr-1" />
                        {record.bloodType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>
                        {record.lastVisit
                          ? new Date(record.lastVisit).toLocaleString()
                          : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(record.status)}`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedRecord(record)}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Record Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-400/10 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add Health Record</h2>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Close
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!user?.id) return;
                try {
                  setLoading(true);
                  const selectedDonor = donors.find((d) => d.id === form.donorId);
                  let donorDisplayName;
                  if (selectedDonor) {
                    const firstName = selectedDonor.firstName || selectedDonor.first_name || '';
                    const lastName = selectedDonor.lastName || selectedDonor.last_name || '';
                    donorDisplayName = `${firstName} ${lastName}`.trim() || selectedDonor.email || 'Unknown donor';
                  }
                  const payload = {
                    donorId: form.donorId,
                    patientName: donorDisplayName || undefined,
                    age: form.age ? Number(form.age) : undefined,
                    bloodType: form.bloodType || undefined,
                    status: form.status || 'stable',
                    lastVisit: form.lastVisit || undefined,
                    weight: form.weight ? Number(form.weight) : undefined,
                    height: form.height ? Number(form.height) : undefined,
                    temperature: form.temperature ? Number(form.temperature) : undefined,
                    bloodPressure: form.bloodPressure || undefined,
                    heartRate: form.heartRate ? Number(form.heartRate) : undefined,
                    hemoglobin: form.hemoglobin ? Number(form.hemoglobin) : undefined,
                    allergies: form.allergies || undefined,
                    medications: form.medications || undefined,
                    chronicConditions: form.chronicConditions || undefined,
                    hospitalNotes: form.hospitalNotes || undefined
                  };
                  await hospitalService.addHealthRecord(user.id, payload);
                  try {
                    toast.success('Health record added successfully');
                  } catch (_) {}
                  setIsAddOpen(false);
                  setForm({
                    donorId: '',
                    age: '',
                    bloodType: '',
                    status: 'stable',
                    lastVisit: '',
                    weight: '',
                    height: '',
                    temperature: '',
                    bloodPressure: '',
                    heartRate: '',
                    hemoglobin: '',
                    allergies: '',
                    medications: '',
                    chronicConditions: '',
                    hospitalNotes: ''
                  });
                  await loadRecords();
                } catch (err) {
                  const message = typeof err === 'string' ? err : err?.message || 'Failed to add health record';
                  try {
                    toast.error(message);
                  } catch (_) {}
                } finally {
                  setLoading(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Donor</label>
                <select
                  required
                  value={form.donorId}
                  onChange={(e) => setForm((f) => ({ ...f, donorId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm bg-white"
                  disabled={donorsLoading}
                >
                  <option value="" disabled>
                    {donorsLoading ? 'Loading donors...' : 'Choose a donor'}
                  </option>
                  {donors.map((donor) => {
                    const firstName = donor.firstName || donor.first_name || '';
                    const lastName = donor.lastName || donor.last_name || '';
                    const name = `${firstName} ${lastName}`.trim() || donor.email || 'Unknown donor';
                    const bloodGroup = donor.bloodGroup || donor.blood_group || '';
                    return (
                      <option key={donor.id} value={donor.id}>
                        {name}{bloodGroup ? ` (${bloodGroup})` : ''}
                      </option>
                    );
                  })}
                </select>
                {donorsError && (
                  <p className="mt-1 text-xs text-red-600">{donorsError}</p>
                )}
              </div>
              <div className="grid grid-cols-1 md-grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    min="0"
                    value={form.age}
                    onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                  <input
                    type="text"
                    value={form.bloodType}
                    onChange={(e) => setForm((f) => ({ ...f, bloodType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                    placeholder="e.g. O+"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  >
                    <option value="stable">Stable</option>
                    <option value="attention">Needs Attention</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Visit</label>
                <input
                  type="datetime-local"
                  value={form.lastVisit}
                  onChange={(e) => setForm((f) => ({ ...f, lastVisit: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.weight}
                    onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.height}
                    onChange={(e) => setForm((f) => ({ ...f, height: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.temperature}
                    onChange={(e) => setForm((f) => ({ ...f, temperature: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure</label>
                  <input
                    type="text"
                    value={form.bloodPressure}
                    onChange={(e) => setForm((f) => ({ ...f, bloodPressure: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                    placeholder="e.g. 120/80"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.heartRate}
                    onChange={(e) => setForm((f) => ({ ...f, heartRate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hemoglobin (g/dL)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.hemoglobin}
                    onChange={(e) => setForm((f) => ({ ...f, hemoglobin: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                <textarea
                  rows={2}
                  value={form.allergies}
                  onChange={(e) => setForm((f) => ({ ...f, allergies: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  placeholder="List any known allergies..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
                <textarea
                  rows={2}
                  value={form.medications}
                  onChange={(e) => setForm((f) => ({ ...f, medications: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  placeholder="List current medications..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chronic Conditions</label>
                <textarea
                  rows={2}
                  value={form.chronicConditions}
                  onChange={(e) => setForm((f) => ({ ...f, chronicConditions: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  placeholder="Describe any chronic conditions..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Notes</label>
                <textarea
                  rows={3}
                  value={form.hospitalNotes}
                  onChange={(e) => setForm((f) => ({ ...f, hospitalNotes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  placeholder="Add any relevant notes about the donor's health and eligibility..."
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold shadow-sm hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-400/10 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Health Record Details</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedRecord.patientName}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 font-medium">Blood Type</p>
                <p className="text-sm font-semibold text-gray-900 flex items-center mt-1">
                  <Droplet className="w-4 h-4 text-red-500 mr-1" />
                  {selectedRecord.bloodType || 'N/A'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 font-medium">Last Visit</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {selectedRecord.lastVisit
                    ? new Date(selectedRecord.lastVisit).toLocaleString()
                    : 'N/A'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 font-medium">Status</p>
                <p className="text-sm font-semibold text-gray-900 mt-1 capitalize">{selectedRecord.status}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 font-medium">Age</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{selectedRecord.age || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 font-medium">Weight</p>
                <p className="text-sm font-semibold text-gray-900 mt-1 flex items-center">
                  <Weight className="w-4 h-4 text-purple-500 mr-1" />
                  {selectedRecord.weight || 'N/A'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 font-medium">Blood Pressure</p>
                <p className="text-sm font-semibold text-gray-900 mt-1 flex items-center">
                  <Heart className="w-4 h-4 text-red-500 mr-1" />
                  {selectedRecord.bloodPressure || 'N/A'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 font-medium">Heart Rate</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{selectedRecord.heartRate || 'N/A'} bpm</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 font-medium">Temperature</p>
                <p className="text-sm font-semibold text-gray-900 mt-1 flex items-center">
                  <Thermometer className="w-4 h-4 text-orange-500 mr-1" />
                  {selectedRecord.temperature || 'N/A'} °C
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 font-medium">Hemoglobin</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{selectedRecord.hemoglobin || 'N/A'} g/dL</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Allergies</p>
                <p className="text-sm text-gray-900 bg-gray-50 rounded-lg p-3 min-h-[40px]">
                  {selectedRecord.allergies || 'None recorded'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Current Medications</p>
                <p className="text-sm text-gray-900 bg-gray-50 rounded-lg p-3 min-h-[40px]">
                  {selectedRecord.medications || 'None recorded'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Chronic Conditions</p>
                <p className="text-sm text-gray-900 bg-gray-50 rounded-lg p-3 min-h-[40px]">
                  {selectedRecord.chronicConditions || 'None recorded'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Hospital Notes</p>
                <p className="text-sm text-gray-900 bg-gray-50 rounded-lg p-3 min-h-[40px]">
                  {selectedRecord.hospitalNotes || 'No additional notes'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HealthRecords;
