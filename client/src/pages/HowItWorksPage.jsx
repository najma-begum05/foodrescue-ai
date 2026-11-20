import React from 'react';
import HowItWorks from '../components/HowItWorks';
import FAQ from '../components/FAQ';
import { 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Cpu, 
  Truck, 
  ShieldCheck,
  PackageCheck
} from 'lucide-react';

export default function HowItWorksPage({ onOpenAuth }) {
  return (
    <div className="py-12 bg-[#F8FAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Redistribution Architecture
          </span>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mt-3">
            The Complete Food Redistribution Workflow
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Learn how surplus food travels securely from commercial kitchens and grocery store shelves to community tables in 4 coordinated phases.
          </p>
        </div>

        {/* Detailed How-It-Works Visuals */}
        <HowItWorks />

        {/* Detailed Breakdown for Providers & NGOs */}
        <div className="mt-16 grid md:grid-cols-2 gap-8 mb-16">
          
          {/* Provider side */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">For Food Providers</span>
            <h3 className="text-xl font-bold text-slate-900 mt-1 mb-4">How Donating Works</h3>
            <ol className="space-y-4 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">1</span>
                <span><strong>List in under 60 seconds:</strong> Enter food type, quantity, strict expiration window, and storage condition (chilled, hot, dry).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">2</span>
                <span><strong>Receive automated AI matches:</strong> Nearby vetted charities receive instantaneous notifications.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">3</span>
                <span><strong>Accept requests:</strong> Confirm the pickup slot that suits your kitchen schedule.</span>
              </li>
            </ol>
          </div>

          {/* NGO side */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">For NGOs & Food Banks</span>
            <h3 className="text-xl font-bold text-slate-900 mt-1 mb-4">How Claiming Works</h3>
            <ol className="space-y-4 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0">1</span>
                <span><strong>Browse real-time listings:</strong> Filter by distance, category, and urgency level.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0">2</span>
                <span><strong>Submit donation request:</strong> Request exact portions required, avoiding over-claiming.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0">3</span>
                <span><strong>Verify & confirm receipt:</strong> Digitally verify food receipt to keep community metrics transparent.</span>
              </li>
            </ol>
          </div>

        </div>

        {/* FAQs */}
        <FAQ />

      </div>
    </div>
  );
}
