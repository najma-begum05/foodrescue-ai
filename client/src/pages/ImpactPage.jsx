import React, { useState } from 'react';
import { 
  Scale, 
  Utensils, 
  CloudRain, 
  Droplet, 
  Sparkles, 
  Info, 
  Download, 
  ShieldCheck,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

export default function ImpactPage() {
  const [surplusKg, setSurplusKg] = useState(250);

  // Clearly defined formula calculations (Module 11 requirement):
  // 1 kg food rescued ≈ 2.5 nutritious meal portions
  // 1 kg food rescued ≈ 2.5 kg CO2 equivalent prevented from landfill methane
  // 1 kg food saved ≈ 1,000 litres of embedded water conserved
  const mealsEstimated = Math.round(surplusKg * 2.5);
  const co2ePreventedKg = Math.round(surplusKg * 2.5);
  const waterSavedLitres = Math.round(surplusKg * 1000);

  return (
    <div className="py-12 bg-[#F8FAF8] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            ESG & Sustainability Intelligence
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-3">
            Interactive Food Waste Impact Calculator
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Simulate the tangible social and ecological benefits achieved when surplus food is redirected from municipal dumps to hungry bellies.
          </p>
        </div>

        {/* Interactive Simulator Box */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-10 max-w-4xl mx-auto mb-14">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Simulate Food Surplus Quantity</h3>
              <p className="text-xs text-slate-500">Drag the slider or enter kilograms of food surplus</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="10"
                max="10000"
                value={surplusKg}
                onChange={(e) => setSurplusKg(Math.max(1, Number(e.target.value)))}
                className="w-28 px-3 py-2 text-center font-black text-lg text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-sm font-bold text-slate-700">Kilograms</span>
            </div>
          </div>

          {/* Range Slider */}
          <div className="mb-10">
            <input
              type="range"
              min="10"
              max="2000"
              step="10"
              value={surplusKg}
              onChange={(e) => setSurplusKg(Number(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-2">
              <span>10 kg (Small Cafe)</span>
              <span>500 kg (Banquet Hall)</span>
              <span>1,000 kg (Supermarket)</span>
              <span>2,000 kg (Wholesaler)</span>
            </div>
          </div>

          {/* Real-time Simulated Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Metric 1 */}
            <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
                <Utensils className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Meals Created</span>
              <h4 className="text-3xl font-black text-emerald-950 mt-1">{mealsEstimated.toLocaleString()}</h4>
              <p className="text-[11px] text-emerald-700 mt-1">Approximate standard meal servings</p>
            </div>

            {/* Metric 2 */}
            <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
                <CloudRain className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-800">CO₂e Averted</span>
              <h4 className="text-3xl font-black text-blue-950 mt-1">{co2ePreventedKg.toLocaleString()} kg</h4>
              <p className="text-[11px] text-blue-700 mt-1">Landfill methane emissions avoided</p>
            </div>

            {/* Metric 3 */}
            <div className="p-6 rounded-2xl bg-teal-50/70 border border-teal-200 text-center">
              <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
                <Droplet className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800">Water Conserved</span>
              <h4 className="text-3xl font-black text-teal-950 mt-1">{(waterSavedLitres / 1000).toFixed(0)}k L</h4>
              <p className="text-[11px] text-teal-700 mt-1">Agricultural irrigation water saved</p>
            </div>

          </div>

          {/* Formula Transparency Callout (Module 11 requirement) */}
          <div className="mt-8 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
            <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Calculation Standards & Formulas:</strong> All projected calculations follow scientific food rescue metrics: (1) <strong>Meal Equivalence</strong>: Each 1.0 kg of wholesome food is calculated as 2.5 average nutritional meal portions (based on FAO food balance standards); (2) <strong>Greenhouse Emission Factor</strong>: Rescuing 1 kg of edible organic food diverts 2.5 kg of greenhouse gases (CO₂ equivalent) caused by anaerobic landfill decomposition.
            </p>
          </div>

        </div>

        {/* ESG Certificate Preview */}
        <div className="max-w-4xl mx-auto bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Certified Verification
            </div>
            <h3 className="text-2xl font-bold">Verifiable Corporate Social Responsibility (CSR)</h3>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Food donors receive cryptographically verifiable donation receipts for audited sustainability reports, tax deductions, and municipal zero-waste awards.
            </p>
          </div>
          <button
            onClick={() => alert('Sample CSR ESG Certificate downloaded (Demo preview). Full automated report generator activates in Phase 9.')}
            className="shrink-0 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Sample CSR Report</span>
          </button>
        </div>

      </div>
    </div>
  );
}
