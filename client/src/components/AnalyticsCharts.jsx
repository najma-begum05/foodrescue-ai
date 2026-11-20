import React from 'react';
import { 
  TrendingUp, 
  Leaf, 
  Droplet, 
  Utensils, 
  Sparkles, 
  ShieldCheck, 
  Award,
  Layers
} from 'lucide-react';

/**
 * 1. Category Donut Chart (SVG)
 * Shows the percentage distribution of rescued food categories.
 */
export function CategoryDonutChart({ data = null }) {
  const categories = data || [
    { label: 'Cooked Meals', percentage: 42, color: '#059669', count: '1,260 portions' },
    { label: 'Bakery & Bread', percentage: 24, color: '#d97706', count: '720 loaves' },
    { label: 'Fresh Produce', percentage: 19, color: '#0d9488', count: '570 kg' },
    { label: 'Dairy & Milks', percentage: 15, color: '#2563eb', count: '450 litres' }
  ];

  // SVG Donut calculation
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-bold text-slate-900 text-sm">Rescued Food by Category</h4>
          <p className="text-xs text-slate-400 mt-0.5">Nutritional diversity breakdown</p>
        </div>
        <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
          Live Audit
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 my-2">
        {/* SVG Donut */}
        <div className="relative w-40 h-40 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180">
            {/* Background Circle */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth="24"
            />
            {/* Category Slices */}
            {categories.map((cat, idx) => {
              const strokeDasharray = `${(cat.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((cumulativePercent / 100) * circumference);
              cumulativePercent += cat.percentage;
              return (
                <circle
                  key={idx}
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="transparent"
                  stroke={cat.color}
                  strokeWidth="24"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-500 hover:opacity-85"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</span>
            <span className="text-xl font-black text-slate-900">100%</span>
            <span className="text-[10px] text-emerald-600 font-semibold">Diverse</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2.5 w-full text-xs">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="font-semibold text-slate-700">{cat.label}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900">{cat.percentage}%</span>
                <span className="text-slate-400 text-[10px] block">{cat.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 2. Monthly Trend Bar Chart (SVG)
 * Shows food rescued (in kg) over the past 6 months.
 */
export function MonthlyTrendBarChart({ title = "Monthly Surplus Rescued (kg)" }) {
  const months = [
    { name: 'Jun', amount: 280, target: 200 },
    { name: 'Jul', amount: 410, target: 300 },
    { name: 'Aug', amount: 560, target: 450 },
    { name: 'Sep', amount: 720, target: 600 },
    { name: 'Oct', amount: 890, target: 750 },
    { name: 'Nov', amount: 1150, target: 900 }
  ];

  const maxVal = 1200;

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
          <p className="text-xs text-slate-400 mt-0.5">Historical trajectory over 6 months</p>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600 inline-block" /> Actual
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-slate-300 inline-block" /> Target
          </span>
        </div>
      </div>

      {/* SVG Bar Chart */}
      <div className="w-full h-48 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b border-slate-100">
        {months.map((m, idx) => {
          const heightPercent = Math.round((m.amount / maxVal) * 100);
          return (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
              <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                {m.amount} kg
              </span>
              <div className="w-full max-w-[42px] bg-slate-100 rounded-t-xl overflow-hidden relative h-full flex items-end">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full bg-gradient-to-t from-emerald-700 to-emerald-500 group-hover:from-emerald-600 group-hover:to-teal-400 transition-all rounded-t-xl duration-500"
                />
              </div>
              <span className="text-[11px] font-bold text-slate-500 mt-2">{m.name}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1 text-emerald-700 font-bold">
          <TrendingUp className="w-4 h-4" /> +28.5% Growth Month-over-Month
        </span>
        <span>Cumulative: <strong>4,010 kg</strong></span>
      </div>
    </div>
  );
}

/**
 * 3. Weekly Meals Sparkline (SVG)
 * Shows daily meal volume across the current week.
 */
export function WeeklyMealsSparkline() {
  const days = [
    { day: 'Mon', count: 180 },
    { day: 'Tue', count: 210 },
    { day: 'Wed', count: 195 },
    { day: 'Thu', count: 260 },
    { day: 'Fri', count: 340 },
    { day: 'Sat', count: 420 },
    { day: 'Sun', count: 380 }
  ];

  // SVG Coordinates for sparkline (viewBox 0 0 350 90)
  // min 150 -> y=80, max 450 -> y=10
  const points = "0,75 58,68 116,72 174,52 232,32 290,12 348,22";
  const areaPoints = "0,75 58,68 116,72 174,52 232,32 290,12 348,22 348,90 0,90";

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-slate-900 text-sm">Weekly Redistribution Velocity</h4>
          <p className="text-xs text-slate-400 mt-0.5">Portions delivered Mon &bull; Sun</p>
        </div>
        <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl">
          1,985 Meals / wk
        </span>
      </div>

      <div className="w-full h-24 relative">
        <svg className="w-full h-full" viewBox="0 0 350 90" preserveAspectRatio="none">
          <defs>
            <linearGradient id="mealGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <polygon points={areaPoints} fill="url(#mealGradient)" />
          <polyline
            fill="none"
            stroke="#059669"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>

      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 px-1">
        {days.map((d, i) => (
          <span key={i}>{d.day}</span>
        ))}
      </div>
    </div>
  );
}

/**
 * 4. Impact Equivalency Card
 * Calculates environmental and hunger relief equivalencies.
 */
export function ImpactEquivalencyCard({ meals = 4850, kgFood = 1940 }) {
  const co2SavedKg = Math.round(kgFood * 2.5);
  const waterSavedLitres = Math.round(kgFood * 2000);
  const familiesSupported = Math.round(meals / 4);

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-700/50 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-300 text-xs font-bold mb-2">
            <Award className="w-3.5 h-3.5 text-emerald-400" /> Ecological & Community Equivalency
          </div>
          <h3 className="text-2xl font-black">Food Waste Prevention Dividend</h3>
          <p className="text-xs text-emerald-100/80 mt-1 max-w-xl">
            Redirecting surplus from landfills prevents methane decomposition and conserves the agricultural resources used to grow and harvest it.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-300 flex items-center gap-1">
            <Utensils className="w-3.5 h-3.5" /> Meals Provided
          </span>
          <h4 className="text-2xl font-black">{meals.toLocaleString()}</h4>
          <p className="text-[10px] text-emerald-200">Balanced, wholesome meals</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 space-y-1">
          <span className="text-[10px] uppercase font-bold text-teal-300 flex items-center gap-1">
            <Leaf className="w-3.5 h-3.5" /> CO2 Prevented
          </span>
          <h4 className="text-2xl font-black">{co2SavedKg.toLocaleString()} kg</h4>
          <p className="text-[10px] text-teal-200">Avoided landfill methane</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 space-y-1">
          <span className="text-[10px] uppercase font-bold text-blue-300 flex items-center gap-1">
            <Droplet className="w-3.5 h-3.5" /> Water Conserved
          </span>
          <h4 className="text-2xl font-black">{(waterSavedLitres / 1000).toLocaleString()} kL</h4>
          <p className="text-[10px] text-blue-200">Embodied irrigation water</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Families Reached
          </span>
          <h4 className="text-2xl font-black">~{familiesSupported.toLocaleString()}</h4>
          <p className="text-[10px] text-amber-200">4-member households</p>
        </div>

      </div>
    </div>
  );
}
