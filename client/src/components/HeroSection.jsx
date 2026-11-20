import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  HeartHandshake, 
  TrendingUp, 
  Clock, 
  MapPin, 
  CheckCircle2,
  PackageCheck,
  Zap
} from 'lucide-react';

export default function HeroSection({ onOpenAuth }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-[#F8FAF8] to-[#F8FAF8] pt-12 pb-20 sm:pt-16 sm:pb-28">
      {/* Decorative ambient background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-40 blur-3xl">
        <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-emerald-200/60"></div>
        <div className="absolute top-20 right-1/4 w-80 h-80 rounded-full bg-lime-100/70"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Mission Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-semibold shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-ping" />
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>AI-Driven Redistribution Engine Active Nationwide</span>
          </div>
        </div>

        {/* Hero Title & Mission Tagline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
            Rescue surplus food. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600">
              Redistribute hope.
            </span> <br />
            Reduce waste with AI.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            FoodRescue AI intelligently bridges commercial food surplus with verified community shelters, food banks, and kitchens using multi-factor expiry prediction and routing.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenAuth('register', 'provider')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 shadow-lg shadow-emerald-700/25 transition-all text-base cursor-pointer"
            >
              <PackageCheck className="w-5 h-5 text-emerald-200" />
              <span>List Surplus Food</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/available-food"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-emerald-900 bg-white hover:bg-emerald-50 border border-emerald-200/90 shadow-sm transition text-base"
            >
              <HeartHandshake className="w-5 h-5 text-emerald-700" />
              <span>Browse Available Food</span>
            </Link>
          </div>

          {/* Social Proof Mini Bar */}
          <div className="mt-12 pt-8 border-t border-slate-200/70 flex flex-wrap items-center justify-center gap-y-4 gap-x-8 text-xs sm:text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zero-cost donation matching</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Verified NGO credentials</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Strict expiry urgency prioritization</span>
            </div>
          </div>
        </div>

        {/* Live Interactive Matching Visual Preview */}
        <div className="mt-14 max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
          <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="ml-2 font-mono text-slate-400">Live AI Redistribution Dispatcher</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Real-time Matching Engine Online
            </div>
          </div>

          <div className="p-6 sm:p-8 bg-gradient-to-b from-white to-slate-50/50 grid md:grid-cols-3 gap-6">
            
            {/* Step 1 Preview Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">1. Surplus Detected</span>
                <span className="text-xs font-mono text-slate-400">12:30 PM</span>
              </div>
              <h4 className="font-bold text-slate-900 text-base">Grand Banquet Hall</h4>
              <p className="text-xs text-slate-500 mt-1">120 Cooked Meals (Rice, Dal, Veg Curry)</p>
              <div className="mt-4 flex items-center justify-between text-xs font-semibold">
                <span className="text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md flex items-center gap-1">
                  <Clock className="w-3 h-3 text-rose-600" /> Expires in 3.5 hrs
                </span>
                <span className="text-slate-600">Urgency: Critical</span>
              </div>
            </div>

            {/* Step 2 AI Match Preview Card */}
            <div className="bg-emerald-900 text-white p-5 rounded-2xl shadow-md border border-emerald-800 relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-800/80 px-2.5 py-1 rounded-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> 2. AI Matching
                </span>
                <span className="text-xs font-mono font-bold text-emerald-300">96% Score</span>
              </div>
              <h4 className="font-bold text-white text-base">Optimal Recipient Found</h4>
              <p className="text-xs text-emerald-200/80 mt-1">Hope Street Community Shelter</p>
              <div className="mt-4 text-xs space-y-1.5 text-emerald-100/90 font-medium">
                <p>📍 Distance: 2.8 km away (8 min drive)</p>
                <p>👥 Capacity: 150 individuals in need</p>
                <p>⚡ Reason: Immediate dispatch needed</p>
              </div>
            </div>

            {/* Step 3 Dispatch Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md">3. Logistics Dispatch</span>
                <span className="text-xs font-semibold text-emerald-600">En Route</span>
              </div>
              <h4 className="font-bold text-slate-900 text-base">Volunteer Driver #18</h4>
              <p className="text-xs text-slate-500 mt-1">Van equipped with insulated thermal crates</p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Estimated Delivery:</span>
                <span className="font-bold text-emerald-700">1:15 PM (Success)</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
