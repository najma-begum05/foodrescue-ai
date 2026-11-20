import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

// Pages
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import HowItWorksPage from './pages/HowItWorksPage';
import AvailableFoodPage from './pages/AvailableFoodPage';
import ImpactPage from './pages/ImpactPage';

export default function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authRole, setAuthRole] = useState('provider'); // 'provider', 'ngo', 'logistics'

  const handleOpenAuth = (mode = 'login', role = 'provider') => {
    setAuthMode(mode);
    setAuthRole(role);
    setAuthModalOpen(true);
  };

  const handleCloseAuth = () => {
    setAuthModalOpen(false);
  };

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#F8FAF8] text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
        
        {/* Sticky Global Navigation */}
        <Navbar onOpenAuth={handleOpenAuth} />

        {/* Dynamic Route Pages */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage onOpenAuth={handleOpenAuth} />} />
            <Route path="/about" element={<AboutPage onOpenAuth={handleOpenAuth} />} />
            <Route path="/how-it-works" element={<HowItWorksPage onOpenAuth={handleOpenAuth} />} />
            <Route path="/available-food" element={<AvailableFoodPage onOpenAuth={handleOpenAuth} />} />
            <Route path="/impact" element={<ImpactPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Global Auth Modal (Preview for Phase 3 JWT Authentication) */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={handleCloseAuth}
          initialMode={authMode}
          initialRole={authRole}
        />

      </div>
    </Router>
  );
}
