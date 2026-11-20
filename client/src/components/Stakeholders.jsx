import React, { useState } from 'react';
import { 
  Building, 
  Utensils, 
  Store, 
  GraduationCap, 
  HeartHandshake, 
  Home, 
  Soup, 
  Truck, 
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function Stakeholders({ onOpenAuth }) {
  const [activeTab, setActiveTab] = useState('providers');

  const categories = [
    { id: 'providers', label: '1. Food Providers' },
    { id: 'recipients', label: '2. NGOs & Recipients' },
    { id: 'logistics', label: '3. Logistics Partners' },
    { id: 'admin', label: '4. Administrators' }
  ];

  return (
    <section className="py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Platform Stakeholders
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            Designed for Every Link in the Food Supply Chain
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            Whether you are producing surplus food, distributing meals to the hungry, or coordinating logistics, FoodRescue AI gives you tailored tools.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer ${
                activeTab === cat.id
                  ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xs">
          
          {/* TAB 1: Food Providers */}
          {activeTab === 'providers' && (
            <div className="grid md:grid-cols-2 gap-8 items-center animate-in fade-in duration-300">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full">
                  Commercial & Institutional Donors
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-3 mb-4">
                  Turn Waste Into Purpose with Zero Friction
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Restaurants, wedding caterers, supermarkets, hotels, bakeries, hostels, and farms can post surplus inventory in under a minute with photo uploads and strict expiry windows.
                </p>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Multi-category support:</strong> Cooked banquets, fresh bakery loaves, dairy, produce, and packaged goods.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>AI-assisted urgency ratings:</strong> Automated warnings prioritize perishable items before quality drops.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Impact & ESG reports:</strong> Download verifiable CSR and carbon-reduction certificates for audits.</span>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => onOpenAuth('register', 'provider')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition cursor-pointer"
                  >
                    <span>Register as Food Provider</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sub-stakeholders pills */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
                  <Utensils className="w-7 h-7 text-emerald-600" />
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">Restaurants</h5>
                    <p className="text-[11px] text-slate-500">Buffet & kitchen prep</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
                  <Store className="w-7 h-7 text-emerald-600" />
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">Supermarkets</h5>
                    <p className="text-[11px] text-slate-500">Produce & dairy stock</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
                  <Building className="w-7 h-7 text-emerald-600" />
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">Hotels & Banquets</h5>
                    <p className="text-[11px] text-slate-500">Catered surplus events</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
                  <GraduationCap className="w-7 h-7 text-emerald-600" />
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">College Hostels</h5>
                    <p className="text-[11px] text-slate-500">Mess halls & dining rooms</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NGOs & Recipients */}
          {activeTab === 'recipients' && (
            <div className="grid md:grid-cols-2 gap-8 items-center animate-in fade-in duration-300">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-800 bg-blue-100/70 px-3 py-1 rounded-full">
                  Verified Charities & Food Banks
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-3 mb-4">
                  Discover Clean, Nutritious Food for People in Need
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Community kitchens, orphanages, day shelters, and relief orgs can configure dietary requirements, maximum intake capacity, and receiving schedules to receive instant AI alerts.
                </p>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Geographic proximity sorting:</strong> Find surplus listings within 1 to 15 kilometers to minimize transport delay.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Inventory reservation lock:</strong> Prevents multiple organizations from overbooking the same listing.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Direct communication desk:</strong> Chat or schedule pickup seamlessly with donor kitchen supervisors.</span>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => onOpenAuth('register', 'ngo')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition cursor-pointer"
                  >
                    <span>Register as Verified NGO</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
                  <Soup className="w-7 h-7 text-blue-600" />
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">Community Kitchens</h5>
                    <p className="text-[11px] text-slate-500">Hot daily meals</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
                  <HeartHandshake className="w-7 h-7 text-blue-600" />
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">Food Banks</h5>
                    <p className="text-[11px] text-slate-500">Packaged redistribution</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
                  <Home className="w-7 h-7 text-blue-600" />
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">Shelters & Homes</h5>
                    <p className="text-[11px] text-slate-500">Night shelters & seniors</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
                  <ShieldCheck className="w-7 h-7 text-blue-600" />
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">Disaster Relief</h5>
                    <p className="text-[11px] text-slate-500">Emergency response</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Logistics Partners */}
          {activeTab === 'logistics' && (
            <div className="grid md:grid-cols-2 gap-8 items-center animate-in fade-in duration-300">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full">
                  Fleet & Volunteer Drivers
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-3 mb-4">
                  Optimized Transit Routes for Swift Food Rescue
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Perishable food cannot afford traffic delays. Logistics partners receive optimized map routes with clear collection and delivery stops, contact info, and status updates.
                </p>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Leaflet & OpenStreetMap routing:</strong> Turn-by-turn guidance connecting pickup locations to recipient shelters.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Live status pipeline:</strong> Update state from Assigned → Picked Up → Delivered with one tap.</span>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => onOpenAuth('register', 'logistics')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm shadow-md transition cursor-pointer"
                  >
                    <span>Join as Logistics Partner</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">Volunteer Drivers & Commercial Fleets</h5>
                    <p className="text-xs text-slate-500">Cars, e-bikes, delivery vans, refrigerated trucks</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-2 text-slate-600">
                  <p className="font-semibold text-slate-800">Standard Transport Safety Rules:</p>
                  <p>• Cooked food must be carried in sanitized, covered thermal insulated crates.</p>
                  <p>• Max transit duration strictly monitored to avoid temperature abuse.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Administrators */}
          {activeTab === 'admin' && (
            <div className="grid md:grid-cols-2 gap-8 items-center animate-in fade-in duration-300">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-rose-800 bg-rose-100/70 px-3 py-1 rounded-full">
                  System Governance & Auditing
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-3 mb-4">
                  Full Transparency, Verification, and Safety Compliance
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Platform administrators verify NGO registration certificates, audit active food listings, resolve disputes, and analyze city-wide food rescue KPIs.
                </p>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <span><strong>Verification workflow:</strong> Review tax-exempt NGO 80G/12A/501(c)(3) documentation before approving.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <span><strong>Audit trails & dispute management:</strong> Track canceled pickups and flag suspicious reports.</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">Admin Control Center</h5>
                    <p className="text-xs text-slate-500">Real-time system health and compliance oversight</p>
                  </div>
                </div>
                <div className="p-3.5 bg-rose-50/70 border border-rose-200/80 rounded-xl text-xs text-rose-900">
                  Ensures only legitimate, vetted organizations have access to sensitive supplier pickup locations.
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
