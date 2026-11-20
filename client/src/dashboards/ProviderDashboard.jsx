import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { listingService, requestService } from '../services/api';
import CreateListingModal from '../components/CreateListingModal';
import EditListingModal from '../components/EditListingModal';
import SurplusForecastModal from '../components/SurplusForecastModal';
import { 
  PackagePlus, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  Edit3, 
  AlertTriangle, 
  MapPin, 
  RefreshCw,
  Sparkles,
  Layers,
  Utensils,
  Phone,
  TrendingUp
} from 'lucide-react';

export default function ProviderDashboard() {
  const { user } = useAuth();

  const [myListings, setMyListings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [forecastModalOpen, setForecastModalOpen] = useState(false);
  const [prefilledListingData, setPrefilledListingData] = useState(null);
  const [editingListing, setEditingListing] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [listingsRes, requestsRes] = await Promise.all([
        listingService.getMyListings(),
        requestService.getIncomingRequests()
      ]);

      if (listingsRes.success) setMyListings(listingsRes.listings);
      if (requestsRes.success) setRequests(requestsRes.requests);
    } catch (err) {
      console.warn('Dashboard fetch notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRequestAction = async (id, action) => {
    try {
      const res = await requestService.respondToRequest(id, action);
      if (res.success) {
        setStatusMessage(`Donation claim #${id} ${action}ed! ${action === 'reject' ? 'Inventory lock released back to listing.' : 'Collection window confirmed.'}`);
        fetchDashboardData();
        setTimeout(() => setStatusMessage(null), 4000);
      }
    } catch (err) {
      alert('Error updating request: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this surplus listing?')) return;
    try {
      const res = await listingService.deleteListing(id);
      if (res.success) {
        setStatusMessage('Listing deleted successfully.');
        setMyListings(myListings.filter(l => l._id !== id));
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err) {
      alert('Error deleting listing: ' + err.message);
    }
  };

  const handleListingCreated = (newListing) => {
    setMyListings([newListing, ...myListings]);
    setStatusMessage('New surplus food listing published and broadcasting!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleListingUpdated = (updatedListing) => {
    setMyListings(myListings.map(l => l._id === updatedListing._id ? updatedListing : l));
    setStatusMessage('Listing updated successfully.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const calculateHoursLeft = (expiry) => {
    const diffMs = new Date(expiry) - new Date();
    const hours = Math.round(diffMs / (1000 * 60 * 60));
    return hours > 0 ? hours : 0;
  };

  // Dynamic Metrics
  const activeCount = myListings.filter(l => l.status === 'Available').length;
  const pendingRequestsCount = requests.filter(r => r.status === 'pending').length;
  const totalPortions = myListings.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
  const completedDonationsCount = requests.filter(r => r.status === 'completed' || r.status === 'accepted').length;

  return (
    <DashboardLayout 
      title={`Welcome back, ${user?.name}`} 
      subtitle={`Surplus Management Desk • ${user?.organizationName}`}
    >
      <div className="space-y-8">
        
        {/* Status Toast */}
        {statusMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 rounded-xl flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{statusMessage}</span>
          </div>
        )}

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Your Active Listings</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-3xl font-black text-slate-900">{activeCount}</h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Live Online</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Available for nearby NGO claims</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Incoming Requests</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-3xl font-black text-amber-600">{pendingRequestsCount}</h3>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">Pending Review</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Charity claims awaiting confirmation</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Inventory Reserved</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-3xl font-black text-emerald-700">{totalPortions.toLocaleString()}</h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Portions</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Under active multi-recipient protection</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Fulfilled Donations</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-3xl font-black text-blue-700">{completedDonationsCount}</h3>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">Completed</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Successfully routed to local shelters</p>
          </div>
        </div>

        {/* Action Header Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Module 5: Real-Time Donation Workflow Active
            </div>
            <h3 className="text-2xl font-black">Incoming Charity Claims & Inventory</h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
              When charities request food portions, an automatic Inventory Lock prevents over-claiming. You can accept requests to schedule pickups or decline to restore stock.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button 
              onClick={() => setForecastModalOpen(true)}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-950 text-white font-extrabold text-sm border border-emerald-600/40 shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <TrendingUp className="w-5 h-5 text-emerald-300" />
              <span>AI Surplus Forecast</span>
            </button>
            <button 
              onClick={() => {
                setPrefilledListingData(null);
                setCreateModalOpen(true);
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <PackagePlus className="w-5 h-5 text-emerald-700" />
              <span>List Surplus Food</span>
            </button>
          </div>
        </div>

        {/* Incoming Donation Claims Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Incoming Donation Requests</h3>
              <p className="text-xs text-slate-500 mt-0.5">Approve claims submitted by verified charity partners to confirm collection</p>
            </div>
            <button
              onClick={fetchDashboardData}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition"
              title="Refresh requests"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-700' : ''}`} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6">Food Item</th>
                  <th className="py-3 px-6">Requesting Charity</th>
                  <th className="py-3 px-6">Quantity</th>
                  <th className="py-3 px-6">Pickup Schedule</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Provider Response</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No incoming donation requests at this time.
                    </td>
                  </tr>
                ) : (
                  requests.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 px-6 font-bold text-slate-900">{r.listingName}</td>
                      <td className="py-4 px-6">
                        <p className="text-slate-800 font-semibold">{r.ngoName}</p>
                        {r.ngoPhone && (
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3" /> {r.ngoPhone}
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-6 text-slate-900 font-bold">
                        {r.quantityRequested} {r.unit}
                      </td>
                      <td className="py-4 px-6 text-slate-500">{r.pickupSchedule}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          r.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                          r.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          r.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        {r.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleRequestAction(r._id, 'accept')}
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleRequestAction(r._id, 'reject')}
                              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
                            >
                              Decline
                            </button>
                          </>
                        ) : (
                          <span className="text-slate-400 font-semibold text-[11px] uppercase">
                            {r.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Current Active Listings Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Your Food Surplus Listings</h3>
              <p className="text-xs text-slate-500 mt-0.5">Manage stock availability and edit items</p>
            </div>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <PackagePlus className="w-4 h-4" />
              <span>New Listing</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6">Food Item</th>
                  <th className="py-3 px-6">Category</th>
                  <th className="py-3 px-6">Available Stock</th>
                  <th className="py-3 px-6">Dietary</th>
                  <th className="py-3 px-6">Expiry Remaining</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myListings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No surplus listings yet. Click <strong>"New Listing"</strong> above to publish your first surplus food!
                    </td>
                  </tr>
                ) : (
                  myListings.map((item) => {
                    const hoursLeft = calculateHoursLeft(item.expiryDate);
                    return (
                      <tr key={item._id} className="hover:bg-slate-50/50 transition">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <img
                              src={item.image}
                              alt={item.foodName}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-slate-900">{item.foodName}</p>
                              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {item.pickupLocation}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-700">{item.category}</td>
                        <td className="py-4 px-6 font-bold text-slate-900">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="py-4 px-6 text-slate-500">{item.dietary}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1 font-bold ${
                            hoursLeft <= 4 ? 'text-rose-600' : hoursLeft <= 24 ? 'text-amber-600' : 'text-slate-600'
                          }`}>
                            <Clock className="w-3.5 h-3.5" />
                            {hoursLeft > 0 ? `${hoursLeft} hours` : 'Expired'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            item.status === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                            item.status === 'Reserved' ? 'bg-amber-100 text-amber-800' :
                            item.status === 'Accepted' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => setEditingListing(item)}
                            className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition"
                            title="Edit Listing"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteListing(item._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Modal */}
        <CreateListingModal
          isOpen={createModalOpen}
          initialValues={prefilledListingData}
          onClose={() => {
            setCreateModalOpen(false);
            setPrefilledListingData(null);
          }}
          onListingCreated={handleListingCreated}
        />

        {/* AI Surplus Forecast Modal */}
        <SurplusForecastModal
          isOpen={forecastModalOpen}
          onClose={() => setForecastModalOpen(false)}
          onApplyToCreate={(prediction) => {
            setPrefilledListingData({
              category: prediction.category,
              quantity: prediction.quantity,
              foodName: `Surplus ${prediction.category} (${new Date().toLocaleDateString('en-US', { weekday: 'short' })})`
            });
            setCreateModalOpen(true);
          }}
        />

        {/* Edit Modal */}
        <EditListingModal
          isOpen={!!editingListing}
          listing={editingListing}
          onClose={() => setEditingListing(null)}
          onListingUpdated={handleListingUpdated}
        />

      </div>
    </DashboardLayout>
  );
}
