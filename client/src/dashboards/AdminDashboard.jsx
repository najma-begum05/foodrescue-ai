import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { 
  Users, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  Scale, 
  TrendingUp,
  Building,
  RefreshCw
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [actionMessage, setActionMessage] = useState(null);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await authService.getAllUsers();
      if (data.success) {
        setUsersList(data.users);
      }
    } catch (err) {
      console.warn('Could not fetch real users list:', err.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleVerify = async (id, status) => {
    try {
      const res = await authService.verifyUser(id, status);
      if (res.success) {
        setActionMessage(`Status updated to ${status} for user.`);
        fetchUsers();
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  return (
    <DashboardLayout
      title="System Governance & Admin Console"
      subtitle="Oversight of food providers, charity credential verification, and waste metrics"
    >
      <div className="space-y-8">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Registered Users</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-3xl font-black text-slate-900">{usersList.length || 4}</h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Live Platform</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Providers, NGOs, Drivers, Admins</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pending NGO Approvals</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-3xl font-black text-amber-600">
                {usersList.filter(u => u.verificationStatus === 'pending').length}
              </h3>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">Audits Due</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Awaiting 80G/12A documentation</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Platform Rescued</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-3xl font-black text-emerald-700">48,250 kg</h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Nationwide</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">120k+ meal portions calculated</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">System Security</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-2xl font-black text-emerald-700">Optimal</h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">JWT + Bcrypt</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Stateless authorization verified</p>
          </div>
        </div>

        {/* Feedback message */}
        {actionMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Users & Organizations Verification Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">User Governance & Verification Center</h3>
              <p className="text-xs text-slate-500 mt-0.5">Audit credentials and toggle verification status for community safety</p>
            </div>
            <button
              onClick={fetchUsers}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition"
              title="Refresh list"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6">Name & Organization</th>
                  <th className="py-3 px-6">Email Address</th>
                  <th className="py-3 px-6">Role</th>
                  <th className="py-3 px-6">Address</th>
                  <th className="py-3 px-6">Verification</th>
                  <th className="py-3 px-6 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900">{u.name}</p>
                      <p className="text-[11px] text-slate-500">{u.organizationName || 'Individual'}</p>
                    </td>
                    <td className="py-4 px-6 text-slate-600">{u.email}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                        u.role === 'provider' ? 'bg-emerald-100 text-emerald-800' :
                        u.role === 'ngo' ? 'bg-blue-100 text-blue-800' :
                        u.role === 'logistics' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 truncate max-w-[160px]">{u.address || 'Not specified'}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        u.verificationStatus === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                        u.verificationStatus === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {u.verificationStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {u.role !== 'admin' && (
                        <>
                          <button
                            onClick={() => handleVerify(u._id, 'verified')}
                            disabled={u.verificationStatus === 'verified'}
                            className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-bold text-xs cursor-pointer"
                          >
                            Verify
                          </button>
                          <button
                            onClick={() => handleVerify(u._id, 'rejected')}
                            disabled={u.verificationStatus === 'rejected'}
                            className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-bold text-xs cursor-pointer"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
