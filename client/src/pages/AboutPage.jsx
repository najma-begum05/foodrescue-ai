import React from 'react';
import { 
  Heart, 
  ShieldCheck, 
  Globe, 
  Cpu, 
  Leaf, 
  CheckCircle2, 
  ArrowRight,
  TrendingDown,
  Sparkles,
  Users
} from 'lucide-react';

export default function AboutPage({ onOpenAuth }) {
  return (
    <div className="py-16 bg-[#F8FAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            About FoodRescue AI
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mt-3">
            Ending Food Waste with Artificial Intelligence
          </h1>
          <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
            Every day, tons of fresh, wholesome food is discarded simply because suppliers lack an instant, reliable, and legally sound bridge to nearby shelters. We built FoodRescue AI to fix the broken logistics of surplus redistribution.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-5">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Our Core Mission</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              "Rescue surplus food. Redistribute hope. Reduce waste with AI." 
              We empower food businesses to donate unsold edible stock effortlessly, reducing landfill methane emissions and directly sustaining vulnerable populations.
            </p>
            <div className="space-y-2 text-xs text-slate-600">
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                Zero friction 60-second surplus listing
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                Data-driven expiry prioritization
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mb-5">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Alignment with UN SDGs</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              FoodRescue AI aligns directly with the United Nations Sustainable Development Goals:
            </p>
            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2">
                <span className="font-bold text-amber-800">SDG 2: Zero Hunger</span> &bull; Redirecting edible calories to shelters
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2">
                <span className="font-bold text-emerald-800">SDG 12: Responsible Consumption</span> &bull; Halving per capita food waste
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-2">
                <span className="font-bold text-blue-800">SDG 13: Climate Action</span> &bull; Preventing landfill methane gas emissions
              </div>
            </div>
          </div>
        </div>

        {/* Technical Architecture Overview */}
        <div className="bg-slate-900 text-white p-8 sm:p-12 rounded-3xl mb-16">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Engineering Standard</span>
            <h2 className="text-3xl font-black mt-2 mb-4">Built as a Scalable, Modern Full-Stack System</h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Unlike static mockups or basic CRUD demos, FoodRescue AI is engineered with modular decoupled layers: React 18 SPA on Vite, Node.js REST API with JWT authorization, MongoDB document storage with geospatial indexing, and an analytical Python scoring pipeline.
            </p>
            <button
              onClick={() => onOpenAuth('register')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition"
            >
              <span>Get Involved Today</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Responsible Food Safety Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start gap-4">
          <ShieldCheck className="w-8 h-8 text-amber-700 shrink-0 mt-1" />
          <div className="text-xs sm:text-sm text-amber-950">
            <h4 className="font-bold text-base text-amber-900 mb-1">Strict Food Safety Protocol</h4>
            <p className="leading-relaxed">
              FoodRescue AI provides algorithmic prioritization and expiry tracking based on data submitted by food providers. The platform does not independently guarantee microbiological food safety; actual consumption safety requires adhering to national food hygiene regulations, proper thermal storage, and mandatory visual/olfactory human inspection upon pickup and delivery.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
