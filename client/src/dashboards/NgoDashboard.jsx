import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { requestService, aiService } from '../services/api';
import AIMatchScoreModal from '../components/AIMatchScoreModal';
import { 
  CategoryDonutChart, 
  WeeklyMealsSparkline 
} from '../components/AnalyticsCharts';
import { 
  HeartHandshake, 
  Search, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  RefreshCw, 
  Info,
  Package,
  Layers,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NgoDashboard() {
  const { user } = useAuth();

  const [claims, setClaims] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);

  // Modal inspection states
  const [inspectListing, setInspectListing] = useState(null);
  const [claimModalListing, setClaimModalListing] = useState(null);
  const [claimQuantity, setClaimQuantity] = useState(1);
  const [claimNote, setClaimNote] = useState('');
  const [claimLoading, setClaimLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [claimsRes, aiRes] = await Promise.all([
        requestService.getOutgoingRequests(),
        aiService.getRecommendations()
      ]);

      if (claimsRes.success) setClaims(claimsRes.requests);
      if (aiRes.success) setRecommendations(aiRes.recommendations);
    } catch (err) {
      console.warn('Dashboard fetch notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleConfirmReceipt = async (id) => {
    try {
      const res = await requestService.confirmReceipt(id);
      if (res.success) {
        setStatusMessage('Food collection receipt confirmed! Donation cycle completed successfully.');
        fetchDashboardData();
        setTimeout(() => setStatusMessage(null), 4000);
      }
    } catch (err) {
      alert('Error confirming receipt: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCancelRequest = async (id) => {
    if (!window.confirm('Cancel this donation request? Reserved food inventory will be released back to the donor.')) return;
    try {
      const res = await requestService.cancelRequest(id);
      if (res.success) {
        setStatusMessage('Claim cancelled. Reserved stock released back to donor.');
        fetchDashboardData();
        setTimeout(() => setStatusMessage(null), 4000);
      }
    } catch (err) {
      alert('Error cancelling request: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleOpenClaim = (listing) => {
    setClaimModalListing(listing);
    setClaimQuantity(Math.min(50, listing.quantity));
    setClaimNote('');
  };

  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    setClaimLoading(true);

    try {
      const res = await requestService.createRequest({
        listingId: claimModalListing._id || claimModalListing.id,
        quantityRequested: Number(claimQuantity),
        notes: claimNote
      });

      setClaimLoading(false);

      if (res.success) {
        setStatusMessage(`Donation claim placed! Reserved ${claimQuantity} ${claimModalListing.unit}.`);
        setClaimModalListing(null);
        fetchDashboardData();
        setTimeout(() => setStatusMessage(null), 4000);
      }
    } catch (err) {
      setClaimLoading(false);
      alert('Error claiming donation: ' + (err.response?.data?.message || err.message));
    }
  };

  // Metrics
  const activeClaimsCount = claims.filter(c => c.status === 'pending' || c.status === 'accepted' || c.status === 'pickup_scheduled').length;
  const completedClaimsCount = claims.filter(c => c.status === 'completed').length;
  const totalMealsClaimed = claims.reduce((acc, curr) => acc + (Number(curr.quantityRequested) || 0), 0);

  return (
    <DashboardLayout
      title={`NGO Portal: ${user?.organizationName || 'Charity Shelter'}`}
      subtitle={`Welcome, ${user?.name} • AI Match Optimization & Claim Dispatch Hub`}
    >
      <div className="space-y-8">
        
        {/* Status Toast */}
        {statusMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 rounded-xl flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{statusMessage}</span>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Portions Claimed</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-3xl font-black text-blue-700">{totalMealsClaimed.toLocaleString()}</h3>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">Portions</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Allocated to your community residents</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Claims</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-3xl font-black text-emerald-700">{activeClaimsCount}</h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">In Progress</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Reserved inventory awaiting pickup</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">AI Matched Surplus</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-3xl font-black text-purple-700">{recommendations.length}</h3>
              <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">&gt; 80% Match</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Optimized by distance & urgency</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Completed Collections</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-3xl font-black text-slate-900">{completedClaimsCount}</h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Verified</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Physical handovers completed</p>
          </div>
        </div>

        {/* AI Recommendations Hub (Module 6) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <span>AI-Ranked Food Recommendations for You</span>
              </h3>
              <p className="text-xs text-slate-500">
                Sorted by our multi-criteria algorithm: Haversine distance, shelf-life urgency, dietary fit, and capacity
              </p>
            </div>
            <button
              onClick={fetchDashboardData}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition"
              title="Refresh recommendations"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-700' : ''}`} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.slice(0, 3).map((rec) => (
              <div 
                key={rec._id} 
                className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full bg-slate-100">
                    <img 
                      src={rec.image} 
                      alt={rec.foodName}
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-950/90 text-emerald-300 backdrop-blur-xs border border-emerald-500/40 shadow-md flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        {rec.aiMatchScore}% Match
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-bold text-emerald-700">{rec.category}</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md text-[10px] font-semibold">{rec.dietary}</span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-base line-clamp-1">{rec.foodName}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">By {rec.providerName}</p>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Inventory</span>
                        <p className="font-bold text-slate-900">{rec.quantity} {rec.unit}</p>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Proximity</span>
                        <p className="font-bold text-emerald-700">{rec.distanceKm} km away</p>
                      </div>
                    </div>

                    {/* AI Explanation Box */}
                    <div className="mt-3 p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-100 text-[11px] text-emerald-950">
                      <span className="font-bold flex items-center gap-1 text-emerald-800 mb-0.5">
                        <Sparkles className="w-3 h-3 text-emerald-600" /> AI Recommendation Reasoning:
                      </span>
                      <p className="line-clamp-2 leading-relaxed text-slate-600">
                        {rec.matchExplanation || rec.description || `Optimal match based on your shelter location and dietary profile.`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setInspectListing(rec)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Breakdown</span>
                    </button>

                    <button
                      onClick={() => handleOpenClaim(rec)}
                      className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-1.5"
                    >
                      <HeartHandshake className="w-3.5 h-3.5" />
                      <span>Claim Surplus</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Claims Tracking Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Your Food Donation Claims & Status</h3>
              <p className="text-xs text-slate-500 mt-0.5">Track status from provider approval to collection and verified receipt</p>
            </div>
            <Link 
              to="/available-food" 
              className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
            >
              Browse Full Food Board &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6">Food Item</th>
                  <th className="py-3 px-6">Donor Facility</th>
                  <th className="py-3 px-6">Portions Claimed</th>
                  <th className="py-3 px-6">Collection Schedule</th>
                  <th className="py-3 px-6">Workflow Status</th>
                  <th className="py-3 px-6 text-right">Receipt Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {claims.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No claims placed yet. Visit the <Link to="/available-food" className="text-emerald-700 font-bold underline">Available Food Board</Link> to claim surplus.
                    </td>
                  </tr>
                ) : (
                  claims.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 px-6 font-bold text-slate-900">{c.listingName}</td>
                      <td className="py-4 px-6 text-slate-600 font-semibold">{c.providerName}</td>
                      <td className="py-4 px-6 text-slate-900 font-bold">
                        {c.quantityRequested} {c.unit}
                      </td>
                      <td className="py-4 px-6 text-slate-500">{c.pickupSchedule}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          c.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                          c.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                          c.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        {c.status === 'accepted' ? (
                          <button 
                            onClick={() => handleConfirmReceipt(c._id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                          >
                            Confirm Food Receipt
                          </button>
                        ) : c.status === 'pending' ? (
                          <button
                            onClick={() => handleCancelRequest(c._id)}
                            className="px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-semibold cursor-pointer"
                          >
                            Cancel Claim
                          </button>
                        ) : c.status === 'completed' ? (
                          <span className="text-emerald-600 font-bold flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Receipt Verified
                          </span>
                        ) : (
                          <span className="text-slate-400 font-semibold text-[11px] uppercase">{c.status}</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charity Impact & Nutrition Diversity Analytics (Module 11) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeeklyMealsSparkline />
          <CategoryDonutChart />
        </div>

        {/* AI Match Score Breakdown Modal */}
        <AIMatchScoreModal
          isOpen={!!inspectListing}
          listing={inspectListing}
          scoreData={inspectListing ? {
            matchScore: inspectListing.aiMatchScore,
            distanceKm: inspectListing.distanceKm,
            explanation: inspectListing.matchExplanation,
            breakdown: inspectListing.scoreBreakdown
          } : null}
          onClose={() => setInspectListing(null)}
        />

        {/* Claim Modal for Recommended Listing */}
        {claimModalListing && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
              <button
                onClick={() => setClaimModalListing(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Claim Recommended Surplus
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  Claim: {claimModalListing.foodName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Donor: {claimModalListing.providerName} &bull; {claimModalListing.distanceKm || claimModalListing.distance} km away
                </p>
              </div>

              <form onSubmit={handleSubmitClaim} className="space-y-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <p className="text-slate-600">Available portions: <strong>{claimModalListing.quantity} {claimModalListing.unit}</strong></p>
                  <p className="text-slate-600">AI Compatibility: <strong>{claimModalListing.aiMatchScore}%</strong></p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Portions Required ({claimModalListing.unit}) *:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={claimModalListing.quantity}
                    value={claimQuantity}
                    onChange={(e) => setClaimQuantity(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Logistics / Pickup Notes:
                  </label>
                  <textarea
                    rows="2"
                    placeholder="e.g. Shelter collection team will pick up today by 3:00 PM..."
                    value={claimNote}
                    onChange={(e) => setClaimNote(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setClaimModalListing(null)}
                    className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={claimLoading}
                    className="px-5 py-2.5 font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {claimLoading ? 'Reserving...' : 'Confirm Claim'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
