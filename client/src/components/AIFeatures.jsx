import React from 'react';
import { 
  Cpu, 
  Clock, 
  LineChart, 
  Bot, 
  CheckCircle2, 
  Sparkles,
  Zap,
  ArrowRight
} from 'lucide-react';

export default function AIFeatures() {
  const features = [
    {
      id: 'matching',
      title: 'Intelligent Multi-Criteria Matching Engine',
      badge: 'Core AI Algorithm',
      description: 'Calculates a 0–100 matching compatibility score evaluating Haversine geographic distance, remaining shelf-life, NGO daily meal requirement, and transport viability.',
      points: [
        'Geographic distance weighting to prioritize local community shelters',
        'Considers diet type (Veg / Non-Veg / Vegan / Allergen flags)',
        'Generates transparent natural language explanations for every match'
      ],
      icon: Cpu,
      color: 'emerald'
    },
    {
      id: 'urgency',
      title: 'Food Expiry & Urgency Priority Classifier',
      badge: 'Urgency Heuristics',
      description: 'Dynamically stratifies surplus into Critical (<4 hrs), Urgent (<24 hrs), Moderate (1-5 days), and Low Priority (>5 days) to ensure highly perishable items move first.',
      points: [
        'Perishability factor based on food category (cooked vs packaged)',
        'Prevents food spoilage by flagging impending expiration',
        'Human safety verification reminder at physical handover'
      ],
      icon: Clock,
      color: 'rose'
    },
    {
      id: 'prediction',
      title: 'Surplus Forecasting & Waste Reduction Analytics',
      badge: 'Demonstration ML Model',
      description: 'Analyzes historical weekday patterns, weather factors, and seasonal events to predict potential surplus in advance so providers can plan redistribution proactively.',
      points: [
        'Predicts expected unsold stock by end of business day',
        'Suggests actionable steps: Donate, Discount, or Batch process',
        'Prototype demonstration model using synthetic benchmark time-series'
      ],
      icon: LineChart,
      color: 'blue'
    },
    {
      id: 'rescuebot',
      title: 'RescueBot – Conversational AI Assistant',
      badge: 'Interactive Assistant',
      description: 'Built-in assistant guiding new donors through listing surplus, onboarding charities, answering redistribution policies, and troubleshooting platform logistics.',
      points: [
        'Answers platform FAQs, packaging rules, and donation protocols',
        'Assists NGOs in finding emergency rations quickly',
        'Clean, conversational interface with LLM integration support'
      ],
      icon: Bot,
      color: 'purple'
    }
  ];

  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-700/60 text-emerald-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Artificial Intelligence Pillars
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            How AI Powers Intelligent Redistribution
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            Unlike static noticeboards, FoodRescue AI actively computes priorities, minimizes food transit times, and automates optimal match recommendations.
          </p>
        </div>

        {/* Features 2x2 Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div 
                key={feat.id}
                className="bg-slate-800/80 border border-slate-700 rounded-3xl p-8 hover:border-emerald-500/50 transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-700/60 text-emerald-400 flex items-center justify-center shadow-inner">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-700 text-emerald-300 border border-slate-600">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">{feat.description}</p>

                  <div className="space-y-2.5">
                    {feat.points.map((pt, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-700/80 flex items-center text-xs font-bold text-emerald-400">
                  <span>Included in Modular Architecture</span>
                  <Zap className="w-3.5 h-3.5 ml-1.5" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
