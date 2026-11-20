import React from 'react';
import { 
  TrendingUp, 
  Scale, 
  Utensils, 
  CloudRain, 
  Users, 
  Building2,
  Info
} from 'lucide-react';

export default function ImpactStats() {
  const stats = [
    {
      id: 1,
      label: 'Food Rescued',
      value: '48,250 kg',
      change: '+14% this month',
      icon: Scale,
      color: 'emerald',
      description: 'Diverted from municipal landfills'
    },
    {
      id: 2,
      label: 'Meals Provided',
      value: '120,600+',
      change: 'Calculated at 2.5 meals / kg',
      icon: Utensils,
      color: 'blue',
      description: 'Distributed to verified shelters'
    },
    {
      id: 3,
      label: 'CO₂e Prevented',
      value: '120,625 kg',
      change: '2.5 kg CO₂e saved / kg food',
      icon: CloudRain,
      color: 'teal',
      description: 'Greenhouse emissions avoided'
    },
    {
      id: 4,
      label: 'Community Partners',
      value: '340+',
      change: 'Active NGOs & Providers',
      icon: Building2,
      color: 'purple',
      description: 'Growing across 12 urban clusters'
    }
  ];

  return (
    <section className="py-16 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Real Impact Metrics
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-3">
            Quantifiable Environmental & Social Impact
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Every listing diverted from landfill directly reduces greenhouse gases and fills plates in vulnerable communities.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="bg-slate-50/70 border border-slate-200 rounded-2xl p-6 hover:border-emerald-300 hover:shadow-md transition duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-700 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</h3>
                <p className="font-semibold text-sm text-slate-700 mt-1">{stat.label}</p>
                <p className="text-xs text-slate-500 mt-2">{stat.description}</p>
              </div>
            );
          })}
        </div>

        {/* Transparent Formula Disclaimer (as required by Module 11) */}
        <div className="mt-8 bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-4 flex items-start gap-3 text-xs text-emerald-950">
          <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-bold">Transparent Calculation Standard:</span> Estimated meals and emission metrics use standard FAO benchmarks where <span className="font-semibold">1 kg of rescued surplus food ≈ 2.5 nutritious meal portions</span> and prevents approximately <span className="font-semibold">2.5 kg of CO₂ equivalent landfill methane emissions</span>. These figures reflect estimated environmental savings rather than exact clinical measurements.
          </p>
        </div>

      </div>
    </section>
  );
}
