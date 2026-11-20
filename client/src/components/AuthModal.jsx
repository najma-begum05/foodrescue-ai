import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  Building2, 
  HeartHandshake, 
  Truck, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', initialRole = 'provider' }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [role, setRole] = useState(initialRole); // 'provider', 'ngo', 'logistics'
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'login') {
      setSubmittedMessage(`Welcome back! Sign in simulated for ${email}. (Full JWT authentication activates in Phase 3)`);
    } else {
      setSubmittedMessage(`Registration details captured for ${name} (${orgName}) as a ${role.toUpperCase()}. (Backend registration activates in Phase 3)`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-700/20">
            <Sparkles className="w-6 h-6 text-emerald-200" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            {mode === 'login' ? 'Sign In to FoodRescue AI' : 'Join FoodRescue AI Network'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'login' 
              ? 'Access your food surplus dashboard or charity claims' 
              : 'Select your role and start redistributing surplus food'}
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6 text-xs font-bold">
          <button
            onClick={() => { setMode('login'); setSubmittedMessage(null); }}
            className={`flex-1 py-2 rounded-lg transition cursor-pointer ${
              mode === 'login' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('register'); setSubmittedMessage(null); }}
            className={`flex-1 py-2 rounded-lg transition cursor-pointer ${
              mode === 'register' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register Account
          </button>
        </div>

        {/* Role Selection (for Register) */}
        {mode === 'register' && (
          <div className="mb-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Select Your Role:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole('provider')}
                className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                  role === 'provider'
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-xs'
                }`}
              >
                <Building2 className="w-5 h-5 mx-auto mb-1 text-emerald-700" />
                <span className="text-[11px] block leading-tight">Food Provider</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('ngo')}
                className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                  role === 'ngo'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-xs'
                }`}
              >
                <HeartHandshake className="w-5 h-5 mx-auto mb-1 text-blue-700" />
                <span className="text-[11px] block leading-tight">NGO / Shelter</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('logistics')}
                className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                  role === 'logistics'
                    ? 'border-amber-600 bg-amber-50/70 text-amber-900 font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-xs'
                }`}
              >
                <Truck className="w-5 h-5 mx-auto mb-1 text-amber-700" />
                <span className="text-[11px] block leading-tight">Logistics Partner</span>
              </button>
            </div>
          </div>
        )}

        {/* Success / Feedback Alert */}
        {submittedMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{submittedMessage}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {role === 'provider' ? 'Restaurant / Business Name' : role === 'ngo' ? 'NGO / Shelter Name' : 'Transport Service / Vehicle Info'}
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Organization or brand name"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@organization.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City & Base Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Hyderabad, Telangana"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-700/20 transition cursor-pointer"
          >
            {mode === 'login' ? 'Sign In' : 'Complete Registration'}
          </button>
        </form>

        {/* Phase 3 Notice */}
        <p className="mt-4 text-[11px] text-center text-slate-400">
          🔒 Secure authentication with JWT tokens & Bcrypt password hashing will be live in Phase 3.
        </p>

      </div>
    </div>
  );
}
