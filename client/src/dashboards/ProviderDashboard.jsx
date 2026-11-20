import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { 
  Package, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  ArrowUpRight,
  ShieldCheck,
  MapPin,
  Sparkles
} from 'lucide-react';
import { SAMPLE_FOOD_LISTINGS } from '../components/LiveFoodShowcase';

export default function ProviderDashboard() {
  const { user } = useAuth();

  // Mock list of incoming donation requests received by this provider
  const [requests, setRequests] = useState([
    {
      id: 'req-101',
      listingName: 'Fresh Cooked Banquet Meals (Biryani & Salads)',
      ngoName: 'Hope Haven Community Kitchen',
      quantityRequested: '80 meals',
      urgency: 'CRITICAL',
      requestTime: '15 mins ago',
      status: 'pending' // 'pending', 'accepted', 'rejected'
    },
    {
      id: 'req-102',
      listingName: 'Campus Dining Evening Dinner Surplus',
      ngoName: 'Sunshine Youth Shelter',
      quantityRequested: '50 meals',
      urgency: 'URGENT',
      requestTime: '1 hour ago',
      status: 'accepted'
    }
  ]);

  const handleAction = (id, newStatus) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  return (
    <DashboardLayout 
      title={`Welcome back, ${user?.name}`} 
      subtitle={`Food Surplus Management Desk • ${user?.organizationName}`}
    >
      <div className="space-y-8">
        
        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Listings</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-3xl font-black text-slate-900">4</h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Live Online</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Available for nearby NGO claims</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pending Requests</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-3xl font-black text-amber-600">
                {requests.filter(r => r.status === 'pending').length}
              </h3>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">Action Needed</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Charity claims awaiting confirmation</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Food Donated</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-3xl font-black text-emerald-700">1,420 kg</h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">+18% this mo.</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Diverted from municipal disposal</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Meals Created</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-3xl font-black text-blue-700">3,550+</h3>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">Est. Portions</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Served across 8 local shelters</p>
          </div>
        </div>

        {/* Quick Action & New Listing CTA */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Phase 4 Management Engine
            </div>
            <h3 className="text-2xl font-black">Got Unsold Surplus Food Today?</h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
              List it in under 60 seconds with strict expiration windows and dietary tags. The AI matching algorithm will alert nearby verified charities immediately.
            </p>
          </div>
          <button 
            onClick={() => alert('New Surplus Listing Modal activates in Phase 4 (Food Listing Management Module)!')}
            className="shrink-0 px-6 py-3.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 font-extrabold text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-5 h-5 text-emerald-700" />
            <span>Add Surplus Listing</span>
          </button>
        </div>

        {/* Incoming Donation Claims Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Incoming Donation Requests</h3>
              <p className="text-xs text-slate-500 mt-0.5">Review and approve claims submitted by verified charity partners</p>
            </div>
            <span className="text-xs font-semibold text-slate-400">Real-time Claims</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6">Food Item</th>
                  <th className="py-3 px-6">Requesting NGO</th>
                  <th className="py-3 px-6">Quantity</th>
                  <th className="py-3 px-6">Urgency</th>
                  <th className="py-3 px-6">Request Time</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6 font-bold text-slate-900">{r.listingName}</td>
                    <td className="py-4 px-6 text-slate-600 font-semibold">{r.ngoName}</td>
                    <td className="py-4 px-6 text-slate-900 font-bold">{r.quantityRequested}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        r.urgency === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {r.urgency}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-400">{r.requestTime}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        r.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                        r.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {r.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleAction(r.id, 'accepted')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleAction(r.id, 'rejected')}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
                          >
                            Decline
                          </button>
                        </>
                      ) : (
                        <span className="text-slate-400 font-semibold text-[11px]">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Current Active Listings Preview */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Your Active Surplus Listings</h3>
            <span className="text-xs text-slate-500">Live on platform directory</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_FOOD_LISTINGS.slice(0, 3).map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-emerald-700">{item.category}</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-semibold text-[10px]">Active</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{item.foodName}</h4>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>Quantity: <strong>{item.quantity} {item.unit}</strong></span>
                  <span className="text-rose-600 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {item.expiryHoursLeft}h left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
