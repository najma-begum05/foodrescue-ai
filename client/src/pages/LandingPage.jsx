import React from 'react';
import HeroSection from '../components/HeroSection';
import ImpactStats from '../components/ImpactStats';
import HowItWorks from '../components/HowItWorks';
import Stakeholders from '../components/Stakeholders';
import AIFeatures from '../components/AIFeatures';
import LiveFoodShowcase from '../components/LiveFoodShowcase';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';

export default function LandingPage({ onOpenAuth }) {
  return (
    <div className="bg-[#F8FAF8]">
      {/* 1. Hero Section with Mission & Real-Time AI Dispatcher Preview */}
      <HeroSection onOpenAuth={onOpenAuth} />

      {/* 2. Quantifiable Platform Impact Statistics (With formula disclosure) */}
      <ImpactStats />

      {/* 3. Step-by-Step Food Rescue Workflow */}
      <HowItWorks />

      {/* 4. Live Food Discovery Showcase (Sample real-time surplus) */}
      <LiveFoodShowcase onOpenAuth={onOpenAuth} />

      {/* 5. 4 Core AI Features (Matching, Urgency, Forecast, RescueBot) */}
      <AIFeatures />

      {/* 6. Stakeholder Categories (Providers, NGOs, Logistics, Admins) */}
      <Stakeholders onOpenAuth={onOpenAuth} />

      {/* 7. Community Testimonials & Success Stories */}
      <Testimonials />

      {/* 8. Frequently Asked Questions Accordion */}
      <FAQ />
    </div>
  );
}
