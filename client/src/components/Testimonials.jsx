import React from 'react';
import { 
  Quote, 
  Star, 
  Building2, 
  HeartHandshake, 
  Truck,
  CheckCircle2
} from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      quote: "Before FoodRescue AI, our hotel buffet surplus had no fast legal channel for distribution. Now within 20 minutes of listing, a verified shelter is matched, collected, and feeding families.",
      author: "Rajesh Varma",
      role: "Executive Chef & Banquet Manager",
      org: "Grand Horizon Hotels",
      icon: Building2,
      impact: "Rescued 3,400+ meals in 3 months"
    },
    {
      id: 2,
      quote: "The AI urgency matching is revolutionary. For cooked meals with only 3 hours left, the platform routes it immediately to our nearby shelter instead of an NGO across the city.",
      author: "Sister Mary Teresa",
      role: "Operations Director",
      org: "Hope Haven Children Shelter",
      icon: HeartHandshake,
      impact: "Feeds 180 residents daily"
    },
    {
      id: 3,
      quote: "As volunteer transport partners, having clear GPS pickup pins and insulated handling guidelines right in the driver view eliminates confusion and protects food safety.",
      author: "Vikram Malhotra",
      role: "Lead Logistics Coordinator",
      org: "Urban Relief Volunteer Fleet",
      icon: Truck,
      impact: "Completed 280+ safe rescue runs"
    }
  ];

  return (
    <section className="py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Real Stories of Hope
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            Trusted by Kitchens, Charities, and Drivers
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            Real impact happens when food providers and community shelters communicate without delay.
          </p>
        </div>

        {/* Testimonials Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.id}
                className="bg-slate-50/80 border border-slate-200/90 rounded-3xl p-7 flex flex-col justify-between hover:shadow-md transition duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Quote className="w-8 h-8 text-emerald-600/40" />
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>

                  <p className="text-slate-700 text-sm leading-relaxed italic mb-6">
                    "{t.quote}"
                  </p>
                </div>

                <div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200/70 text-xs font-semibold text-emerald-800 flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t.impact}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{t.author}</h4>
                      <p className="text-xs text-slate-500">{t.role} &bull; <span className="font-semibold text-slate-700">{t.org}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
