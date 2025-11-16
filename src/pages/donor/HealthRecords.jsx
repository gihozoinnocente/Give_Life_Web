import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Activity, AlertCircle, Calendar, Download, Droplet, FileText, Heart, Thermometer, User, Weight } from 'lucide-react';
import donorService from '../../services/donorService';
import { useToast } from '../../components/ToastProvider.jsx';

function HealthRecords() {
  const toast = useToast();
  const { user } = useSelector((state) => state.auth);

  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadingFormat, setDownloadingFormat] = useState(null);

  const loadRecords = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await donorService.getHospitalHealthRecords();
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
    if (!user?.id) return;
    loadRecords();
  }, [user?.id]);

  const latestRecord = useMemo(() => {
    if (!records.length) return null;
    const sorted = [...records].sort((a, b) => {
      const aDate = a.lastVisit || a.createdAt || a.updatedAt || a.date;
      const bDate = b.lastVisit || b.createdAt || b.updatedAt || b.date;
      if (!aDate && !bDate) return 0;
      if (!aDate) return 1;
      if (!bDate) return -1;
      return new Date(bDate) - new Date(aDate);
    });
    return sorted[0];
  }, [records]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'stable':
        return 'bg-green-100 text-green-700';
      case 'attention':
      case 'needs_attention':
        return 'bg-yellow-100 text-yellow-700';
      case 'critical':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleDownloadRecord = async (record, format = 'word') => {
    if (!record) return;
    const recordId = record.id || record._id || 'record';
    try {
      setDownloadingId(recordId);
      setDownloadingFormat(format);

      const dateValue = record.lastVisit || record.createdAt || record.updatedAt || record.date;
      const hospitalName = record.hospitalName || record.hospital || record.hospital_name || 'Hospital';
      const bloodType = record.bloodType || record.blood_group || record.bloodGroup || 'N/A';

      const title = 'Health Record Summary';
      const lines = [
        `<h2 style="text-align:center;">${title}</h2>`,
        `<p><strong>Hospital:</strong> ${hospitalName}</p>`,
        `<p><strong>Date:</strong> ${dateValue ? new Date(dateValue).toLocaleString() : 'N/A'}</p>`,
        `<p><strong>Status:</strong> ${(record.status || 'Unknown').toString().replace(/_/g, ' ')}</p>`,
        `<p><strong>Blood Type:</strong> ${bloodType}</p>`,
        `<p><strong>Age:</strong> ${record.age ?? 'N/A'}</p>`,
        `<p><strong>Weight:</strong> ${record.weight ? `${record.weight} kg` : 'N/A'}</p>`,
        `<p><strong>Height:</strong> ${record.height ? `${record.height} cm` : 'N/A'}</p>`,
        `<p><strong>Temperature:</strong> ${record.temperature ? `${record.temperature} °C` : 'N/A'}</p>`,
        `<p><strong>Blood Pressure:</strong> ${record.bloodPressure || 'N/A'}</p>`,
        `<p><strong>Heart Rate:</strong> ${record.heartRate ? `${record.heartRate} bpm` : 'N/A'}</p>`,
        `<p><strong>Hemoglobin:</strong> ${record.hemoglobin ? `${record.hemoglobin} g/dL` : 'N/A'}</p>`,
        `<p><strong>Allergies:</strong> ${record.allergies || 'None recorded'}</p>`,
        `<p><strong>Current Medications:</strong> ${record.medications || 'None recorded'}</p>`,
        `<p><strong>Chronic Conditions:</strong> ${record.chronicConditions || 'None recorded'}</p>`,
        `<p><strong>Hospital Notes:</strong> ${record.hospitalNotes || record.notes || 'No additional notes'}</p>`,
      ];

      const html = `<!DOCTYPE html><html><head><meta charset="utf-8" /><title>${title}</title></head><body>${lines.join('')}</body></html>`;

      const safeHospital = hospitalName.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
      const timestamp = dateValue ? new Date(dateValue).toISOString().split('T')[0] : 'record';

      if (format === 'pdf') {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
          throw new Error('Popup blocked. Please allow popups to download PDF.');
        }
        printWindow.document.open();
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        // Let the browser handle "Save as PDF" via print dialog
        printWindow.print();
        try {
          toast.success('Use the print dialog to save as PDF');
        } catch (_) {}
      } else {
        const blob = new Blob([html], { type: 'application/msword;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `health-record-${safeHospital}-${timestamp}.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        try {
          toast.success('Health record downloaded as Word');
        } catch (_) {}
      }
    } catch (err) {
      const message = typeof err === 'string' ? err : err?.message || 'Failed to download health record';
      setError(message);
      try {
        toast.error(message);
      } catch (_) {}
    } finally {
      setDownloadingId(null);
      setDownloadingFormat(null);
    }
  };

  const displayName = latestRecord?.patientName || latestRecord?.donorName || latestRecord?.name || user?.fullName || user?.name || 'Donor';
  const latestDate = latestRecord?.lastVisit || latestRecord?.createdAt || latestRecord?.updatedAt || latestRecord?.date;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Health Records</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Review your latest health check and history from hospitals where you donated.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-white border-l-4 border-red-400 rounded-xl shadow-sm p-4 text-sm flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <p className="text-gray-900 font-medium">There was a problem loading your health records.</p>
            <p className="text-gray-600 mt-1">{error}</p>
          </div>
        </div>
      )}

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
            <p className="text-sm text-gray-600">Latest Status</p>
            <p className="mt-1">
              {latestRecord ? (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(latestRecord.status)}`}>
                  {(latestRecord.status || 'Unknown').toString().replace(/_/g, ' ')}
                </span>
              ) : (
                <span className="text-sm text-gray-500">No record yet</span>
              )}
            </p>
          </div>
          <Activity className="w-10 h-10 text-green-500" />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Last Checkup</p>
            <p className="text-sm font-medium text-gray-900 mt-1">
              {latestDate ? new Date(latestDate).toLocaleString() : 'Not available'}
            </p>
          </div>
          <Calendar className="w-10 h-10 text-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        {loading && !records.length ? (
          <div className="py-10 text-center text-gray-600 text-sm">Loading your latest health record...</div>
        ) : !latestRecord ? (
          <div className="py-10 text-center text-gray-600 text-sm flex flex-col items-center space-y-3">
            <AlertCircle className="w-10 h-10 text-gray-400" />
            <p>You do not have any health records yet. Once a hospital records your checkup, it will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-semibold text-lg">
                  {displayName
                    .split(' ')
                    .map((s) => s[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Latest Record For</p>
                  <p className="text-lg font-semibold text-gray-900 flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-1" />
                    {displayName}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                  {latestDate ? new Date(latestDate).toLocaleString() : 'Date not available'}
                </div>
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(latestRecord.status)}`}>
                    {(latestRecord.status || 'Unknown').toString().replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 font-medium">Blood Type</p>
                <p className="mt-2 text-sm font-semibold text-gray-900 inline-flex items-center">
                  <Droplet className="w-4 h-4 text-red-500 mr-1" />
                  {latestRecord.bloodType || latestRecord.blood_group || latestRecord.bloodGroup || 'N/A'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 font-medium">Weight</p>
                <p className="mt-2 text-sm font-semibold text-gray-900 inline-flex items-center">
                  <Weight className="w-4 h-4 text-purple-500 mr-1" />
                  {latestRecord.weight ? `${latestRecord.weight} kg` : 'N/A'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 font-medium">Heart & Blood Pressure</p>
                <p className="mt-2 text-sm font-semibold text-gray-900 inline-flex items-center">
                  <Heart className="w-4 h-4 text-red-500 mr-1" />
                  {latestRecord.bloodPressure || 'N/A'}
                </p>
                <p className="mt-1 text-xs text-gray-600">Heart rate: {latestRecord.heartRate ? `${latestRecord.heartRate} bpm` : 'N/A'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 font-medium">Temperature</p>
                  <div className="inline-flex items-center text-sm font-semibold text-gray-900">
                    <Thermometer className="w-4 h-4 text-orange-500 mr-1" />
                    {latestRecord.temperature ? `${latestRecord.temperature} °C` : 'N/A'}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 font-medium">Hemoglobin</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {latestRecord.hemoglobin ? `${latestRecord.hemoglobin} g/dL` : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Hospital Notes</p>
                  <p className="text-sm text-gray-900 bg-white rounded-lg p-3 min-h-[40px] border border-gray-100">
                    {latestRecord.hospitalNotes || latestRecord.notes || 'No additional notes recorded.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Allergies</p>
                <p className="text-sm text-gray-900 bg-gray-50 rounded-lg p-3 min-h-[40px]">
                  {latestRecord.allergies || 'None recorded'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Current Medications</p>
                <p className="text-sm text-gray-900 bg-gray-50 rounded-lg p-3 min-h-[40px]">
                  {latestRecord.medications || 'None recorded'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Chronic Conditions</p>
                <p className="text-sm text-gray-900 bg-gray-50 rounded-lg p-3 min-h-[40px]">
                  {latestRecord.chronicConditions || 'None recorded'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading && records.length > 0 ? (
          <div className="p-6 text-sm text-gray-600">Refreshing health records...</div>
        ) : !records.length ? (
          <div className="p-12 text-center text-gray-600 text-sm flex flex-col items-center space-y-3">
            <AlertCircle className="w-10 h-10 text-gray-400" />
            <p>Your health history table will appear here once hospitals record your checkups.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Hospital</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Blood Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {records.map((record) => {
                  const id = record.id || record._id || `${record.lastVisit || record.date || ''}-${record.hospitalName || record.hospital || ''}`;
                  const dateValue = record.lastVisit || record.createdAt || record.updatedAt || record.date;
                  const hospitalName = record.hospitalName || record.hospital || record.hospital_name || 'Hospital';
                  const bloodType = record.bloodType || record.blood_group || record.bloodGroup || 'N/A';
                  const status = (record.status || 'Unknown').toString().replace(/_/g, ' ');
                  return (
                    <tr key={id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800 flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{dateValue ? new Date(dateValue).toLocaleString() : 'N/A'}</span>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{hospitalName}</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-red-50 text-red-700">
                          <Droplet className="w-3 h-3 mr-1" />
                          {bloodType}
                        </span>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(record.status)}`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            type="button"
                            onClick={() => setSelectedRecord(record)}
                            className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadRecord(record, 'word')}
                            disabled={downloadingId === id && downloadingFormat === 'word'}
                            className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-white text-gray-800 text-xs font-semibold shadow-sm border border-gray-200 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            <FileText className="w-3 h-3 mr-1" />
                            {downloadingId === id && downloadingFormat === 'word' ? 'Word...' : 'Word'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadRecord(record, 'pdf')}
                            disabled={downloadingId === id && downloadingFormat === 'pdf'}
                            className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-white text-gray-800 text-xs font-semibold shadow-sm border border-gray-200 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            {downloadingId === id && downloadingFormat === 'pdf' ? 'PDF...' : 'PDF'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-400/10 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Health Record Details</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedRecord.hospitalName || selectedRecord.hospital || selectedRecord.hospital_name || 'Hospital'}
                </p>
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
                  {selectedRecord.bloodType || selectedRecord.blood_group || selectedRecord.bloodGroup || 'N/A'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 font-medium">Last Visit</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {selectedRecord.lastVisit
                    ? new Date(selectedRecord.lastVisit).toLocaleString()
                    : selectedRecord.date
                    ? new Date(selectedRecord.date).toLocaleString()
                    : 'N/A'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 font-medium">Status</p>
                <p className="text-sm font-semibold text-gray-900 mt-1 capitalize">{(selectedRecord.status || 'Unknown').toString().replace(/_/g, ' ')}</p>
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
                  {selectedRecord.hospitalNotes || selectedRecord.notes || 'No additional notes'}
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
