import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';
import { getHospitalInventory } from '../../services/inventoryService';
import AdminInventoryChart from '../../components/admin/AdminInventoryChart.jsx';

function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [inventoryAgg, setInventoryAgg] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    (async () => {
      try {
        const list = await adminService.listHospitals();
        const agg = await aggregateInventory(list);
        setInventoryAgg(agg);
      } catch (e) {
        setError(e.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated, user, navigate]);

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
            } catch { }
        }
        return BLOOD_TYPES.map(bt => ({ bloodType: bt, units: totals[bt] }));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                </div>

                {/* Charts */}
                <div className="mb-6">
                    {error ? (
                      <div className="text-red-600 text-sm">{error}</div>
                    ) : loading ? (
                      <div>Loading...</div>
                    ) : (
                      <AdminInventoryChart data={inventoryAgg} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
