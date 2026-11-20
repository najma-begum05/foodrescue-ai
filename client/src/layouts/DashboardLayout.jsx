import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationCenter from '../components/NotificationCenter';
import { 
  Sparkles, 
  LayoutDashboard, 
  PackagePlus, 
  ClipboardList, 
  HeartHandshake, 
  Truck, 
  Users, 
  ShieldCheck, 
  User, 
  LogOut, 
  Bell, 
  Menu, 
  X, 
  Clock, 
  ChevronRight,
  AlertCircle
} from 'lucide-react';

export default function DashboardLayout({ children, title, subtitle }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Define role-specific navigation menu items
  const getNavLinks = () => {
    switch (user?.role) {
      case 'provider':
        return [
          { name: 'Overview', path: '/dashboard/provider', icon: LayoutDashboard },
          { name: 'Browse Available Food', path: '/available-food', icon: ClipboardList },
          { name: 'Profile & Settings', path: '/profile', icon: User },
        ];
      case 'ngo':
        return [
          { name: 'Overview', path: '/dashboard/ngo', icon: LayoutDashboard },
          { name: 'Discover Surplus', path: '/available-food', icon: HeartHandshake },
          { name: 'Profile & Settings', path: '/profile', icon: User },
        ];
      case 'logistics':
        return [
          { name: 'Overview', path: '/dashboard/logistics', icon: LayoutDashboard },
          { name: 'Available Food Map', path: '/available-food', icon: Truck },
          { name: 'Profile & Settings', path: '/profile', icon: User },
        ];
      case 'admin':
        return [
          { name: 'Overview', path: '/dashboard/admin', icon: LayoutDashboard },
          { name: 'Food Listings Audit', path: '/available-food', icon: ClipboardList },
          { name: 'Platform Impact', path: '/impact', icon: Sparkles },
          { name: 'Profile & Settings', path: '/profile', icon: User },
        ];
      default:
        return [
          { name: 'Overview', path: '/', icon: LayoutDashboard }
        ];
    }
  };

  const navLinks = getNavLinks();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'provider':
        return { label: 'Food Provider', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'ngo':
        return { label: 'Verified NGO', bg: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'logistics':
        return { label: 'Logistics Partner', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'admin':
        return { label: 'Administrator', bg: 'bg-rose-100 text-rose-800 border-rose-200' };
      default:
        return { label: 'Member', bg: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  const roleBadge = getRoleBadge(user?.role);

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex">
      
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 md:static md:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        <div>
          {/* Logo & Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">FoodRescue</span>
                <span className="font-extrabold text-lg text-emerald-600">AI</span>
              </div>
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/60">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-700 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-bold text-slate-900 text-sm truncate">{user?.name}</h4>
                <p className="text-xs text-slate-500 truncate">{user?.organizationName || user?.email}</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${roleBadge.bg}`}>
                    {roleBadge.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1">
            <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Workspace Menu
            </div>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                    active
                      ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/80 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${active ? 'text-emerald-700' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                  </div>
                  {active && <ChevronRight className="w-4 h-4 text-emerald-600" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-slate-50 rounded-xl transition"
          >
            <span>Return to Public Homepage</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{title}</h1>
              {subtitle && <p className="text-xs text-slate-500 hidden sm:block mt-0.5">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Verification Notice Badge */}
            {user?.verificationStatus === 'pending' ? (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Pending Admin Approval</span>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Status</span>
              </div>
            )}

            {/* In-App Notifications Center (Module 10) */}
            <NotificationCenter />

            {/* User Avatar & Profile */}
            <Link
              to="/profile"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700"
            >
              <User className="w-4 h-4 text-emerald-700" />
              <span className="hidden sm:inline">My Profile</span>
            </Link>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className="p-4 sm:p-8 flex-1">
          {children}
        </main>

      </div>
    </div>
  );
}
