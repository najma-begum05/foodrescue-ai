import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { 
  Truck, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Clock, 
  Phone, 
  ShieldCheck,
  TrendingUp,
  Package
} from 'lucide-react';

export default function LogisticsDashboard() {
  const { user } = useAuth();

  // Mock shipments assigned to this driver
  const [shipments, setShipments] = useState([
    {
      id: 'ship-801',
      foodName: 'Fresh Cooked Banquet Meals (120 meals)',
      pickupLocation: 'Royal Palace Convention, Banjara Hills',
      pickupContact: '+91 98765 43210 (Manager Rajesh)',
      deliveryLocation: 'Hope Haven Shelter, Lakdikapul',
      deliveryContact: '+91 98480 12345 (Sister Teresa)',
      distanceKm: 3.2,
      estMinutes: 12,
      urgency: 'CRITICAL',
      status: 'Pickup Scheduled' // 'Pickup Scheduled', 'Picked Up', 'Delivered'
    },
    {
      id: 'ship-802',
      foodName: 'Artisan Sourdough Breads (45 loaves)',
      pickupLocation: 'Boulangerie Bakery, Jubilee Hills',
      pickupContact: '+91 91234 56789',
      deliveryLocation: 'St. Jude Youth Center, Madhapur',
      distanceKm: 4.5,
      estMinutes: 18,
      urgency: 'URGENT',
      status: 'Delivered'
    }
  ]);

  const updateShipmentStatus = (id, newStatus) => {
    setShipments(shipments.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  return (
    <DashboardLayout
      title={`Logistics Desk: ${user?.name}`}
      subtitle={`Fleet & Transport Operations • ${user?.organizationName}`}
    >
      <div className="space-y-8">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Assigned Dispatches</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-3xl font-black text-slate-900">{shipments.filter(s => s.status !== 'Delivered').length}</h3>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">Pending</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Pickups needing collection today</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Completed Runs</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-3xl font-black text-emerald-700">142</h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">100% Safe</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Zero transit temperature failures</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Distance Rescued</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-3xl font-black text-blue-700">680 km</h3>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">Optimized</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Average transit: 14 mins</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Vehicle Compliance</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-2xl font-black text-emerald-700">Insulated</h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Thermal</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Crates & food-grade covers active</p>
          </div>
        </div>

        {/* Assigned Shipments List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Assigned Food Transit Dispatches</h3>
            <span className="text-xs text-slate-500">Interactive Map Tracking activates in Phase 8</span>
          </div>

          <div className="space-y-4">
            {shipments.map((ship) => (
              <div 
                key={ship.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                      {ship.id}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                      ship.urgency === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ship.urgency} Urgency
                    </span>
                    <span className="text-xs text-slate-400">&bull; Est. Transit: {ship.distanceKm} km ({ship.estMinutes} mins)</span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900">{ship.foodName}</h4>

                  {/* Route Steps */}
                  <div className="grid md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-bold text-emerald-800 uppercase text-[10px] block mb-1">1. Pickup Origin</span>
                      <p className="font-semibold text-slate-800 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{ship.pickupLocation}</span>
                      </p>
                      <p className="text-slate-500 mt-1 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {ship.pickupContact}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-bold text-blue-800 uppercase text-[10px] block mb-1">2. Delivery Destination</span>
                      <p className="font-semibold text-slate-800 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{ship.deliveryLocation}</span>
                      </p>
                      <p className="text-slate-500 mt-1 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {ship.deliveryContact}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Toggle Buttons */}
                <div className="shrink-0 flex flex-col items-end gap-3">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Status</span>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-0.5 ${
                      ship.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                      ship.status === 'Picked Up' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ship.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {ship.status === 'Pickup Scheduled' && (
                      <button
                        onClick={() => updateShipmentStatus(ship.id, 'Picked Up')}
                        className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                      >
                        Mark as Picked Up
                      </button>
                    )}
                    {ship.status === 'Picked Up' && (
                      <button
                        onClick={() => updateShipmentStatus(ship.id, 'Delivered')}
                        className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                      >
                        Confirm Delivery
                      </button>
                    )}
                    {ship.status === 'Delivered' && (
                      <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Transit Completed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
