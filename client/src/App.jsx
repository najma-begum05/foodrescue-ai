import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import HowItWorksPage from './pages/HowItWorksPage';
import AvailableFoodPage from './pages/AvailableFoodPage';
import ImpactPage from './pages/ImpactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

// Role Dashboards
import ProviderDashboard from './dashboards/ProviderDashboard';
import NgoDashboard from './dashboards/NgoDashboard';
import LogisticsDashboard from './dashboards/LogisticsDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

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
      
      {/* Hide public Navbar if currently in full dashboard view */}
      {!isDashboardRoute && <Navbar onOpenAuth={handleOpenAuth} />}

      {/* Dynamic Routes */}
      <main className="flex-1">
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
      </main>

      {/* Hide public Footer if currently in full dashboard view */}
      {!isDashboardRoute && <Footer />}

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={handleCloseAuth}
        initialMode={authMode}
        initialRole={authRole}
      />
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
