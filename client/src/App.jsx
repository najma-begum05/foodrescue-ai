import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Server, 
  Layers, 
  Cpu, 
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  TrendingUp,
  MapPin
} from 'lucide-react';

export default function App() {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [backendData, setBackendData] = useState(null);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setBackendStatus('connected');
        setBackendData(data);
      })
      .catch(err => {
        setBackendStatus('offline');
        console.warn('Backend server not reachable yet:', err.message);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-slate-800 flex flex-col font-sans">
      {/* Top Banner */}
      <header className="border-b border-emerald-100 bg-white shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-bold shadow-md">
              <Sparkles className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <span className="font-extrabold text-xl text-emerald-900 tracking-tight">FoodRescue AI</span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Phase 1 Active
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-slate-500">Backend API:</span>
            {backendStatus === 'connected' ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                <span className="w-2 h-2 mr-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                Connected (Port 5000)
              </span>
            ) : backendStatus === 'checking' ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                <span className="w-2 h-2 mr-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                Testing connection...
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                <span className="w-2 h-2 mr-1.5 bg-slate-400 rounded-full"></span>
                Server Standby (Run `npm run dev` in /server)
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Hero Welcome */}
      <main className="max-w-6xl mx-auto px-4 py-12 flex-1">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Intelligent Food Surplus Management & Redistribution Platform
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Rescue surplus food. <br />
            <span className="text-emerald-700">Redistribute hope.</span> Reduce waste with AI.
          </h1>
          <p className="mt-4 text-slate-600 text-lg leading-relaxed">
            Phase 1 is initialized! The full-stack scaffold connects modern React (Vite + Tailwind), an Express REST API backend, and an intelligent Python AI engine.
          </p>
        </div>

        {/* Phase 1 Verification Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Frontend */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">1. Client Tier (React 18)</h3>
            <p className="text-sm text-slate-600 mt-1 mb-4">
              Vite dev server, responsive Tailwind CSS styling, Lucide icons, and Axios proxying.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Verified & Serving on Port 5173
            </div>
          </div>

          {/* Card 2: Backend */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 mb-4">
              <Server className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">2. Server Tier (Express)</h3>
            <p className="text-sm text-slate-600 mt-1 mb-4">
              REST API server, CORS configuration, environment validation, and MongoDB Mongoose layer.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">
              {backendStatus === 'connected' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  Live API: {backendData?.service}
                </>
              ) : (
                <>
                  <Server className="w-4 h-4 text-blue-600" />
                  Ready on Port 5000 (/api/health)
                </>
              )}
            </div>
          </div>

          {/* Card 3: AI Engine */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700 mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">3. AI Engine (Python)</h3>
            <p className="text-sm text-slate-600 mt-1 mb-4">
              Multi-criteria matching engine (0-100 score), expiry urgency classifier, and surplus forecasting.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              Scaffolded in /ai directory
            </div>
          </div>
        </div>

        {/* 4 User Roles Overview */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            Designed For 4 Key Stakeholders
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Role A</span>
              <h4 className="font-semibold text-slate-900 mt-1">Food Providers</h4>
              <p className="text-xs text-slate-500 mt-1">Restaurants, supermarkets, caterers listing food surplus with urgency & expiry.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-800">Role B</span>
              <h4 className="font-semibold text-slate-900 mt-1">NGOs & Food Banks</h4>
              <p className="text-xs text-slate-500 mt-1">Shelters & charities browsing listings, matching needs, and requesting donations.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Role C</span>
              <h4 className="font-semibold text-slate-900 mt-1">Logistics Partners</h4>
              <p className="text-xs text-slate-500 mt-1">Volunteer & commercial drivers managing pickups, map routes, and delivery proof.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-800">Role D</span>
              <h4 className="font-semibold text-slate-900 mt-1">Administrators</h4>
              <p className="text-xs text-slate-500 mt-1">Verifying organizations, monitoring platform metrics, audits, and waste metrics.</p>
            </div>
          </div>
        </div>

        {/* Phase Roadmap Indicator */}
        <div className="bg-emerald-950 text-white rounded-2xl p-8 relative overflow-hidden shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Next Milestone</span>
              <h3 className="text-2xl font-bold mt-1">Phase 2: Professional Landing Page & UI System</h3>
              <p className="text-emerald-200/80 text-sm mt-1 max-w-xl">
                We will build the mission-driven landing page with interactive navigation, impact stats, live surplus showcases, how-it-works flows, and FAQ.
              </p>
            </div>
            <div className="shrink-0">
              <div className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold text-sm transition flex items-center gap-2 shadow-lg">
                Phase 1 Active <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        FoodRescue AI – Final Year Engineering Project &bull; Built with React, Express, MongoDB & Python AI
      </footer>
    </div>
  );
}
