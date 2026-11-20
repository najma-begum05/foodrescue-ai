import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  MapPin, 
  Mail, 
  Phone, 
  ExternalLink,
  Leaf,
  Clock
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Top Footer Banner */}
      <div className="border-b border-slate-800/80 bg-emerald-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-center md:text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0">
              <Leaf className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <p className="text-white font-bold text-base">United Against Food Insecurity & Waste</p>
              <p className="text-slate-400 text-xs">Connecting commercial kitchens and farms with shelters across the nation.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 text-xs font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>Real-Time Matching Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        
        {/* Brand Summary */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md">
              <Sparkles className="w-5 h-5 text-emerald-200" />
            </div>
            <span className="font-extrabold text-2xl text-white tracking-tight">FoodRescue <span className="text-emerald-400">AI</span></span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            "Rescue surplus food. Redistribute hope. Reduce waste with AI."
            A real-world, scalable software ecosystem streamlining food redistribution through intelligent matching, urgency classification, and optimized logistics.
          </p>
          <div className="pt-2 flex flex-col space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>support@foodrescueai.org</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Surplus Dispatch Desk: +91 1800-FOOD-AI</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Platform</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/" className="hover:text-emerald-400 transition">Home</Link></li>
            <li><Link to="/about" className="hover:text-emerald-400 transition">About the Mission</Link></li>
            <li><Link to="/how-it-works" className="hover:text-emerald-400 transition">How It Works</Link></li>
            <li><Link to="/available-food" className="hover:text-emerald-400 transition">Available Food</Link></li>
            <li><Link to="/impact" className="hover:text-emerald-400 transition">Impact & Metrics</Link></li>
          </ul>
        </div>

        {/* Stakeholder Groups */}
        <div>
          <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Stakeholders</h4>
          <ul className="space-y-2.5 text-sm">
            <li><span className="hover:text-emerald-400 transition cursor-pointer">Restaurants & Hotels</span></li>
            <li><span className="hover:text-emerald-400 transition cursor-pointer">Supermarkets & Bakeries</span></li>
            <li><span className="hover:text-emerald-400 transition cursor-pointer">Hostels & Colleges</span></li>
            <li><span className="hover:text-emerald-400 transition cursor-pointer">NGOs & Shelters</span></li>
            <li><span className="hover:text-emerald-400 transition cursor-pointer">Logistics Partners</span></li>
          </ul>
        </div>

        {/* Responsible Safety Notice */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Safety & Policy</h4>
          <div className="bg-slate-800/80 border border-slate-700/60 p-3.5 rounded-xl text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Food Safety Disclaimer</span>
            </div>
            <p className="leading-relaxed">
              FoodRescue AI prioritizes food based on expiry urgency and storage data. Actual edible safety must strictly comply with local food safety regulations and human inspection at handover.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} FoodRescue AI Platform. Built for Academic & Social Impact.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Open Food Safety Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
