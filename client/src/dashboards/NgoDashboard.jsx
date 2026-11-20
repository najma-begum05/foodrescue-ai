import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
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
  PackageCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SAMPLE_FOOD_LISTINGS } from '../components/LiveFoodShowcase';

export default function NgoDashboard() {
  const { user } = useAuth();

  // Mock list of active claims placed by this NGO
  const [claims] = useState([
    {
      id: 'claim-301',
      foodName: 'Fresh Cooked Banquet Meals (Biryani & Salads)',
      provider: 'Royal Palace Convention Center',
      quantity: '80 meals',
      urgency: 'CRITICAL',
      status: 'Pickup Scheduled',
      pickupWindow: 'Today by 2:30 PM'
    },
    {
      id: 'claim-302',
      foodName: 'Fortified Whole Milk Cartons',
      provider: 'FreshDairy Superstore',
      quantity: '40 litres',
      urgency: 'URGENT',
      status: 'Delivered',
      pickupWindow: 'Completed at 11:15 AM'
    }
  ]);

  return (
    <DashboardLayout
      title={`NGO Portal: ${user?.organizationName || 'Charity Shelter'}`}
      subtitle={`Welcome, ${user?.name} • Food Discovery & Claim Dispatch Hub`}
    >
      <div className="space-y-8">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Meals Rescued</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-3xl font-black text-blue-700">4,820</h3>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">All-time</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Distributed to community residents</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Claims</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-3xl font-black text-emerald-700">{claims.filter(c => c.status !== 'Delivered').length}</h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">In Transit</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Collections scheduled today</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Nearby Surplus Alerts</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-3xl font-black text-rose-600">3</h3>
              <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">&lt; 5 km</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Urgent perishable items nearby</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Verified Status</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-2xl font-black text-emerald-700">Active</h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">80G / 12A</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Full collection privileges enabled</p>
          </div>
        </div>

        {/* AI Recommendations Highlight */}
        <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800 text-emerald-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" /> High Compatibility Match (98% AI Score)
              </div>
              <h3 className="text-2xl font-black">120 Cooked Meals Available 2.8 km Away</h3>
              <p className="text-xs sm:text-sm text-emerald-200/90 max-w-xl leading-relaxed">
                Royal Palace Convention Center listed banquet surplus expiring in 3.5 hours. Recommended because it fits your shelter capacity and avoids long transit.
              </p>
            </div>
            <Link
              to="/available-food"
              className="shrink-0 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg transition flex items-center gap-2"
            >
              <span>Review & Claim</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Active Claims Tracking Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Your Active Food Claims</h3>
              <p className="text-xs text-slate-500 mt-0.5">Status of donations claimed by your organization</p>
            </div>
            <Link to="/available-food" className="text-xs font-bold text-emerald-700 hover:text-emerald-800">
              Browse More Food &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6">Food Item</th>
                  <th className="py-3 px-6">Donor Facility</th>
                  <th className="py-3 px-6">Portions</th>
                  <th className="py-3 px-6">Pickup Schedule</th>
                  <th className="py-3 px-6">Tracking Status</th>
                  <th className="py-3 px-6 text-right">Confirmation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {claims.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6 font-bold text-slate-900">{c.foodName}</td>
                    <td className="py-4 px-6 text-slate-600 font-semibold">{c.provider}</td>
                    <td className="py-4 px-6 text-slate-900 font-bold">{c.quantity}</td>
                    <td className="py-4 px-6 text-slate-500">{c.pickupWindow}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        c.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {c.status === 'Delivered' ? (
                        <span className="text-emerald-600 font-bold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Received
                        </span>
                      ) : (
                        <button 
                          onClick={() => alert('Delivery confirmation activates in Phase 5 (Donation Request Management)!')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-bold text-xs"
                        >
                          Confirm Receipt
                        </button>
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
