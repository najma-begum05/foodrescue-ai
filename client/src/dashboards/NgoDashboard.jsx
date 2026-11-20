import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { requestService } from '../services/api';
import { 
  HeartHandshake, 
  Search, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  RefreshCw,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NgoDashboard() {
  const { user } = useAuth();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const data = await requestService.getOutgoingRequests();
      if (data.success) {
        setClaims(data.requests);
      }
    } catch (err) {
      console.warn('Outgoing claims fetch notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleConfirmReceipt = async (id) => {
    try {
      const res = await requestService.confirmReceipt(id);
      if (res.success) {
        setStatusMessage('Food collection receipt confirmed! Donation cycle completed successfully.');
        fetchClaims();
        setTimeout(() => setStatusMessage(null), 4000);
      }
    } catch (err) {
      alert('Error confirming receipt: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCancelRequest = async (id) => {
    if (!window.confirm('Cancel this donation request? Reserved food inventory will be released back to the donor.')) return;
    try {
      const res = await requestService.cancelRequest(id);
      if (res.success) {
        setStatusMessage('Claim cancelled. Reserved stock released back to donor.');
        fetchClaims();
        setTimeout(() => setStatusMessage(null), 4000);
      }
    } catch (err) {
      alert('Error cancelling request: ' + (err.response?.data?.message || err.message));
    }
  };

  // Metrics
  const activeClaimsCount = claims.filter(c => c.status === 'pending' || c.status === 'accepted' || c.status === 'pickup_scheduled').length;
  const completedClaimsCount = claims.filter(c => c.status === 'completed').length;
  const totalMealsClaimed = claims.reduce((acc, curr) => acc + (Number(curr.quantityRequested) || 0), 0);

  return (
    <DashboardLayout
      title={`NGO Portal: ${user?.organizationName || 'Charity Shelter'}`}
      subtitle={`Welcome, ${user?.name} • Food Discovery & Claim Dispatch Hub`}
    >
      <div className="space-y-8">
        
        {/* Status Toast */}
        {statusMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 rounded-xl flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{statusMessage}</span>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Portions Claimed</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-3xl font-black text-blue-700">{totalMealsClaimed.toLocaleString()}</h3>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">Portions</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Allocated to your community residents</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Claims</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-3xl font-black text-emerald-700">{activeClaimsCount}</h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">In Progress</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Reserved inventory awaiting pickup</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Completed Collections</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-3xl font-black text-slate-900">{completedClaimsCount}</h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">100% Handover</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Verified food delivery receipts</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">NGO Verification</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-2xl font-black text-emerald-700">Verified</h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">80G / 12A</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Authorized collection partner</p>
          </div>
        </div>

        {/* AI Recommendations Highlight */}
        <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800 text-emerald-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" /> High Urgency Redistribution Alert
              </div>
              <h3 className="text-2xl font-black">Cooked Surplus Meals Available Nearby</h3>
              <p className="text-xs sm:text-sm text-emerald-200/90 max-w-xl leading-relaxed">
                Banquet facilities have reported surplus meals expiring in under 4 hours. Multi-recipient inventory locks ensure you can claim exact portions needed.
              </p>
            </div>
            <Link
              to="/available-food"
              className="shrink-0 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Available Food Directory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Active Claims Tracking Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Your Food Donation Claims & Status</h3>
              <p className="text-xs text-slate-500 mt-0.5">Track status from provider approval to collection and verified receipt</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchClaims}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition"
                title="Refresh claims"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-700' : ''}`} />
              </button>
              <Link 
                to="/available-food" 
                className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
              >
                Browse Food Board &rarr;
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6">Food Item</th>
                  <th className="py-3 px-6">Donor Facility</th>
                  <th className="py-3 px-6">Portions Claimed</th>
                  <th className="py-3 px-6">Collection Schedule</th>
                  <th className="py-3 px-6">Workflow Status</th>
                  <th className="py-3 px-6 text-right">Receipt Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {claims.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No claims placed yet. Visit the <Link to="/available-food" className="text-emerald-700 font-bold underline">Available Food Board</Link> to claim surplus.
                    </td>
                  </tr>
                ) : (
                  claims.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 px-6 font-bold text-slate-900">{c.listingName}</td>
                      <td className="py-4 px-6 text-slate-600 font-semibold">{c.providerName}</td>
                      <td className="py-4 px-6 text-slate-900 font-bold">
                        {c.quantityRequested} {c.unit}
                      </td>
                      <td className="py-4 px-6 text-slate-500">{c.pickupSchedule}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          c.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                          c.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                          c.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        {c.status === 'accepted' ? (
                          <button 
                            onClick={() => handleConfirmReceipt(c._id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                          >
                            Confirm Food Receipt
                          </button>
                        ) : c.status === 'pending' ? (
                          <button
                            onClick={() => handleCancelRequest(c._id)}
                            className="px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-semibold cursor-pointer"
                          >
                            Cancel Claim
                          </button>
                        ) : c.status === 'completed' ? (
                          <span className="text-emerald-600 font-bold flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Receipt Verified
                          </span>
                        ) : (
                          <span className="text-slate-400 font-semibold text-[11px] uppercase">{c.status}</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
