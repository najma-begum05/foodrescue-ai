import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'How does FoodRescue AI prioritize perishable food donations?',
      a: 'The system uses an AI Urgency Classifier that analyzes food category, preparation time, and strict expiration dates. Cooked meals with under 4 hours remaining are automatically tagged as CRITICAL and broadcasted to the nearest high-capacity shelters with instant pickup alerts.'
    },
    {
      q: 'How is food safety maintained during redistribution?',
      a: 'Food safety is our highest priority. The platform mandates thermal and hygiene checklists at listing and requires physical human inspection upon collection. Food showing signs of spoilage, abnormal odor, or temperature compromise is rejected at handover.'
    },
    {
      q: 'Is there any fee or subscription cost for NGOs or food providers?',
      a: 'No. FoodRescue AI is completely free for registered, verified non-profit organizations and charitable community kitchens. Food donors list surplus at zero platform cost, helping them reduce landfill disposal fees and earn CSR waste-prevention credits.'
    },
    {
      q: 'Can multiple NGOs request the same surplus listing?',
      a: 'To avoid overbooking, the platform employs an inventory reservation lock. When an NGO submits a request for 50 meals out of a 100-meal listing, 50 meals remain available for other nearby recipients until confirmed.'
    },
    {
      q: 'What types of food providers can register?',
      a: 'We welcome restaurants, hotels, convention centers, corporate cafeterias, college hostel messes, supermarkets, bakeries, wholesalers, and agricultural farms.'
    },
    {
      q: 'How does an NGO get verified on the platform?',
      a: 'During registration, NGOs submit their government registration certificate (such as 80G/12A or registered trust deed). Our administrative compliance team audits credentials within 24 hours before opening full collection privileges.'
    }
  ];

  return (
    <section className="py-20 bg-[#F8FAF8]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            Common Questions & Answers
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Everything you need to know about food safety, platform algorithms, and onboarding.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                >
                  <span className="font-bold text-slate-900 text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-700' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
