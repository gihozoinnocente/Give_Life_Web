import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';
import { getHospitalInventory } from '../../services/inventoryService';
import { useToast } from '../../components/ToastProvider.jsx';
import AdminInventoryChart from '../../components/admin/AdminInventoryChart.jsx';
import Modal from '../../components/common/Modal.jsx';

function Hospitals() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    email: '',
    password: '',
    hospitalName: '',
    address: '',
    headOfHospital: '',
    phoneNumber: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [inventoryAgg, setInventoryAgg] = useState([]);
  const toast = useToast();

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    (async () => {
      try {
        const list = await adminService.listHospitals();
        setHospitals(list);
        // Aggregate inventory by blood type across all hospitals
        const agg = await aggregateInventory(list);
        setInventoryAgg(agg);
      } catch (e) {
        setError(e.message || 'Failed to load hospitals');
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await adminService.createHospital(form);
      setSuccess('Hospital registered successfully');
      toast.success('Hospital registered successfully');
      setForm({ email: '', password: '', hospitalName: '', address: '', headOfHospital: '', phoneNumber: '' });
      const list = await adminService.listHospitals();
      setHospitals(list);
      const agg = await aggregateInventory(list);
      setInventoryAgg(agg);
      setShowModal(false);
    } catch (e) {
      const msg = e.response?.data?.message || e.message || 'Failed to register hospital';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Aggregate helper
  const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const aggregateInventory = async (list) => {
    const totals = Object.fromEntries(BLOOD_TYPES.map(bt => [bt, 0]));
    for (const h of list) {
      try {
        const inv = await getHospitalInventory(h.id);
        // inv expected: array of { blood_type, units_available }
        (inv || []).forEach(row => {
          const bt = row.blood_type || row.bloodType;
          const units = Number(row.units_available ?? row.units ?? 0);
          if (BLOOD_TYPES.includes(bt)) totals[bt] += units;
        });
      } catch {}
    }
    return BLOOD_TYPES.map(bt => ({ bloodType: bt, units: totals[bt] }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button onClick={() => setShowModal(true)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
            Add Hospital
          </button>
        </div>



        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Hospitals</h2>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left p-2 border-b">Name</th>
                      <th className="text-left p-2 border-b">Email</th>
                      <th className="text-left p-2 border-b">Phone</th>
                      <th className="text-left p-2 border-b">Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hospitals.map((h) => (
                      <tr key={h.id} className="odd:bg-gray-50">
                        <td className="p-2 border-b">{h.hospitalName}</td>
                        <td className="p-2 border-b">{h.email}</td>
                        <td className="p-2 border-b">{h.phoneNumber}</td>
                        <td className="p-2 border-b">{h.address}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>

        {/* Add Hospital Modal */}
        <Modal open={showModal} onClose={() => setShowModal(false)} title="Register Hospital">
          {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
          {success && <div className="mb-3 text-green-600 text-sm">{success}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email (login)</label>
              <input name="email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hospital Name</label>
              <input name="hospitalName" value={form.hospitalName} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input name="address" value={form.address} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Head Of Hospital</label>
              <input name="headOfHospital" value={form.headOfHospital} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded border">
                Cancel
              </button>
              <button disabled={submitting} className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50">
                {submitting ? 'Registering...' : 'Register Hospital'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}

export default Hospitals;
