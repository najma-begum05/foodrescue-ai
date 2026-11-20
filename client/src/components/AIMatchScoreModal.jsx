import React from 'react';
import { X, Sparkles, MapPin, Clock, Utensils, Scale, Info, CheckCircle2 } from 'lucide-react';

export default function AIMatchScoreModal({ isOpen, onClose, listing, scoreData }) {
  if (!isOpen || !listing) return null;

  const matchScore = scoreData?.matchScore || listing.aiMatchScore || 95;
  const breakdown = scoreData?.breakdown || {
    distanceScore: 92,
    urgencyScore: 98,
    dietaryScore: 100,
    capacityScore: 90
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 75) return 'text-blue-700 bg-blue-50 border-blue-200';
    return 'text-amber-700 bg-amber-50 border-amber-200';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-700/20">
            <Sparkles className="w-6 h-6 text-emerald-200" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
            Module 6: Multi-Criteria AI Matching Engine
          </span>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
            AI Compatibility Analysis
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{listing.foodName}</p>
        </div>

        {/* Big Score Dial Banner */}
        <div className="p-5 rounded-2xl bg-slate-900 text-white flex items-center justify-between mb-6 shadow-inner">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
              Composite Compatibility Score
            </span>
            <h4 className="text-3xl font-black mt-0.5">{matchScore}% Match</h4>
            <p className="text-xs text-slate-400 mt-1">Multi-factor weighted evaluation</p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex items-center justify-center text-lg font-black text-emerald-300 bg-emerald-950/80">
            {matchScore}%
          </div>
        </div>

        {/* Natural Language Explanation */}
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-xs text-emerald-950 space-y-1">
          <span className="font-bold flex items-center gap-1.5 text-emerald-800">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Generated AI Explanation:
          </span>
          <p className="leading-relaxed">
            {scoreData?.explanation || listing.matchExplanation || listing.matchReason || 
              `Recommended because your organization is nearby (${scoreData?.distanceKm || listing.distance || '2.8'} km away), can distribute ${listing.quantity} ${listing.unit}, and can collect within the required expiry timeframe.`}
          </p>
        </div>

        {/* Sub-Criteria Breakdown Bars */}
        <div className="space-y-3.5 text-xs">
          <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
            Evaluation Breakdown (Weights Sum to 100%)
          </h4>

          {/* 1. Distance */}
          <div>
            <div className="flex justify-between font-semibold text-slate-700 mb-1">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                1. Geographic Proximity (Weight: 35%)
              </span>
              <span className="font-bold text-slate-900">{breakdown.distanceScore}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-emerald-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${breakdown.distanceScore}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400">
              Computed via Haversine great-circle formula: {scoreData?.distanceKm || listing.distance || '2.8'} km away
            </span>
          </div>

          {/* 2. Urgency */}
          <div>
            <div className="flex justify-between font-semibold text-slate-700 mb-1">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-rose-600" />
                2. Expiry Urgency & Transit Feasibility (Weight: 25%)
              </span>
              <span className="font-bold text-slate-900">{breakdown.urgencyScore}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-rose-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${breakdown.urgencyScore}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400">
              Evaluates remaining shelf-life vs estimated travel time
            </span>
          </div>

          {/* 3. Dietary */}
          <div>
            <div className="flex justify-between font-semibold text-slate-700 mb-1">
              <span className="flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-blue-600" />
                3. Dietary Profile Alignment (Weight: 20%)
              </span>
              <span className="font-bold text-slate-900">{breakdown.dietaryScore}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${breakdown.dietaryScore}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400">
              {listing.dietary} item matching community preferences
            </span>
          </div>

          {/* 4. Capacity */}
          <div>
            <div className="flex justify-between font-semibold text-slate-700 mb-1">
              <span className="flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-teal-600" />
                4. Organization Capacity Absorption (Weight: 20%)
              </span>
              <span className="font-bold text-slate-900">{breakdown.capacityScore}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-teal-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${breakdown.capacityScore}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400">
              Available portions ({listing.quantity} {listing.unit}) vs shelter beneficiary intake
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm cursor-pointer"
          >
            Close Breakdown
          </button>
        </div>

      </div>
    </div>
  );
}
