import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Core Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import ProtectedRoute from './components/ProtectedRoute';
import RescueBot from './components/RescueBot';

// Lazy-Loaded Route Components for Optimized Bundle Code Splitting (Efficiency)
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'));
const AvailableFoodPage = lazy(() => import('./pages/AvailableFoodPage'));
const ImpactPage = lazy(() => import('./pages/ImpactPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

// Lazy-Loaded Dashboards
const ProviderDashboard = lazy(() => import('./dashboards/ProviderDashboard'));
const NgoDashboard = lazy(() => import('./dashboards/NgoDashboard'));
const LogisticsDashboard = lazy(() => import('./dashboards/LogisticsDashboard'));
const AdminDashboard = lazy(() => import('./dashboards/AdminDashboard'));

// Accessible Loading Fallback (WCAG 2.1 AA)
function PageLoader() {
  return (
    <div 
      role="status" 
      aria-live="polite" 
      className="flex flex-col items-center justify-center min-h-[60vh] gap-3"
    >
      <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-700 rounded-full animate-spin" />
      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
        Loading FoodRescue AI...
      </span>
      <span className="sr-only">Content is loading, please wait.</span>
    </div>
  );
}

// Helper component to redirect /dashboard to user's role-specific dashboard
function DashboardIndexRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={`/dashboard/${user.role}`} replace />;
}

// Shell component to optionally hide Navbar & Footer inside Dashboard pages for immersive UX
function AppShell() {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard') || location.pathname === '/profile';

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authRole, setAuthRole] = useState('provider');

  const handleOpenAuth = (mode = 'login', role = 'provider') => {
    setAuthMode(mode);
    setAuthRole(role);
    setAuthModalOpen(true);
  };

  const handleCloseAuth = () => {
    setAuthModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF8] text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Accessibility: Skip to Main Content Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-emerald-800 focus:text-white focus:font-bold focus:rounded-xl focus:shadow-xl focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Accessible Header Navigation */}
      {!isDashboardRoute && <Navbar onOpenAuth={handleOpenAuth} />}

      {/* Accessible Main Content Region with Lazy Suspense Boundary */}
      <main id="main-content" tabIndex="-1" className="flex-1 focus:outline-none">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<LandingPage onOpenAuth={handleOpenAuth} />} />
            <Route path="/about" element={<AboutPage onOpenAuth={handleOpenAuth} />} />
            <Route path="/how-it-works" element={<HowItWorksPage onOpenAuth={handleOpenAuth} />} />
            <Route path="/available-food" element={<AvailableFoodPage onOpenAuth={handleOpenAuth} />} />
            <Route path="/impact" element={<ImpactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Role-Based Dashboards */}
            <Route path="/dashboard" element={<DashboardIndexRedirect />} />

            <Route 
              path="/dashboard/provider" 
              element={
                <ProtectedRoute allowedRoles={['provider', 'admin']}>
                  <ProviderDashboard />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/dashboard/ngo" 
              element={
                <ProtectedRoute allowedRoles={['ngo', 'admin']}>
                  <NgoDashboard />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/dashboard/logistics" 
              element={
                <ProtectedRoute allowedRoles={['logistics', 'admin']}>
                  <LogisticsDashboard />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/dashboard/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Protected User Profile */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      {/* Accessible Footer */}
      {!isDashboardRoute && <Footer />}

      {/* Global Auth Modal with Dialog Accessibility */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={handleCloseAuth}
        initialMode={authMode}
        initialRole={authRole}
      />

      {/* Global AI Assistant Widget (Module 6 & Support) */}
      <RescueBot />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </Router>
  );
}
