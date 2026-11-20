import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  LogIn, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  ShieldCheck,
  Building2,
  HeartHandshake,
  Truck,
  Users
} from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Quick fill demo credentials
  const handleQuickDemo = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('Password123!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      // Redirect to their role's dashboard or previous location
      const destination = location.state?.from?.pathname || `/dashboard/${res.user.role}`;
      navigate(destination, { replace: true });
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2.5 mb-4 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition">
            <Sparkles className="w-6 h-6 text-emerald-200" />
          </div>
          <span className="font-extrabold text-2xl text-slate-900 tracking-tight">FoodRescue <span className="text-emerald-600">AI</span></span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Sign In to Your Workspace
        </h2>
        <p className="mt-2 text-xs text-slate-500">
          Access your role-based dashboard for surplus listing, claims, or dispatches
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200/90 shadow-xl space-y-6">
          
          {/* Quick Demo Credentials Panel for Students & Reviewers */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              ⚡ Instant 1-Click Demo Logins:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemo('provider@foodrescue.org', 'provider')}
                className="p-2 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 text-left transition flex items-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="font-semibold text-slate-700 truncate">Food Provider</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('ngo@foodrescue.org', 'ngo')}
                className="p-2 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 text-left transition flex items-center gap-1.5"
              >
                <HeartHandshake className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                <span className="font-semibold text-slate-700 truncate">Verified NGO</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('driver@foodrescue.org', 'logistics')}
                className="p-2 rounded-xl bg-white hover:bg-amber-50 border border-slate-200 text-left transition flex items-center gap-1.5"
              >
                <Truck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span className="font-semibold text-slate-700 truncate">Logistics Driver</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('admin@foodrescue.org', 'admin')}
                className="p-2 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 text-left transition flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                <span className="font-semibold text-slate-700 truncate">Platform Admin</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="e.g. provider@foodrescue.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 shadow-md shadow-emerald-700/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>

          {/* Switch to Register */}
          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-emerald-700 hover:text-emerald-800">
              Create an account &rarr;
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
