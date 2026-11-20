import React from 'react';
import { 
  ClipboardList, 
  Cpu, 
  Truck, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Provider Lists Surplus',
      subtitle: 'Fast 60-Second Form',
      description: 'Restaurants, hotels, or supermarkets input food category, quantity, harvest/cooking time, strict expiry, and pickup coordinates.',
      icon: ClipboardList,
      color: 'bg-emerald-600'
    },
    {
      number: '02',
      title: 'AI Matches & Prioritizes',
      subtitle: 'Multi-Criteria Algorithm',
      description: 'The AI scoring engine calculates geographic distance, remaining shelf-life urgency, dietary suitability, and NGO capacity to recommend optimal recipients.',
      icon: Cpu,
      color: 'bg-emerald-800'
    },
    {
      number: '03',
      title: 'Scheduled Dispatch',
      subtitle: 'Logistics Coordination',
      description: 'Once accepted, an optimal collection window is scheduled with verified logistics drivers or NGO collection teams equipped for safe transit.',
      icon: Truck,
      color: 'bg-blue-600'
    },
    {
      number: '04',
      title: 'Verified Handover',
      subtitle: 'Transparent Receipt',
      description: 'The receiving charity inspects food condition, confirms physical collection via digital verification, and updates real-time impact logs.',
      icon: CheckCircle2,
      color: 'bg-teal-700'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#F8FAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Step-by-Step Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            How FoodRescue AI Works
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            A frictionless 4-step pipeline designed to eliminate delays when redistributing perishable food surplus.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.number} 
                className="relative bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-1 transition duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-slate-200">{step.number}</span>
                    <div className={`w-12 h-12 rounded-xl ${step.color} text-white flex items-center justify-center shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">{step.subtitle}</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2.5">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-700">
                  <span>Step {idx + 1} of 4</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
