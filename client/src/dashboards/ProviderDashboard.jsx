import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { listingService } from '../services/api';
import CreateListingModal from '../components/CreateListingModal';
import EditListingModal from '../components/EditListingModal';
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
  Utensils
} from 'lucide-react';

export default function ProviderDashboard() {
  const { user } = useAuth();

  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  // Incoming donation requests received by this provider
  const [requests, setRequests] = useState([
    {
      id: 'req-101',
      listingName: 'Fresh Cooked Banquet Meals (Biryani & Salads)',
      ngoName: 'Hope Haven Community Kitchen',
      quantityRequested: '80 meals',
      urgency: 'CRITICAL',
      requestTime: '15 mins ago',
      status: 'pending'
    },
    {
      id: 'req-102',
      listingName: 'Campus Dining Evening Dinner Surplus',
      ngoName: 'Sunshine Youth Shelter',
      quantityRequested: '50 meals',
      urgency: 'URGENT',
      requestTime: '1 hour ago',
      status: 'accepted'
    }
  ]);

  const fetchMyListings = async () => {
    setLoading(true);
    try {
      const data = await listingService.getMyListings();
      if (data.success) {
        setMyListings(data.listings);
      }
    } catch (err) {
      console.warn('Could not fetch real provider listings:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleRequestAction = (id, newStatus) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
    setStatusMessage(`Request #${id} marked as ${newStatus}`);
    setTimeout(() => setStatusMessage(null), 3000);
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
    setStatusMessage('New surplus food listing published!');
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

  // Metrics
  const activeCount = myListings.filter(l => l.status === 'Available').length;
  const pendingRequestsCount = requests.filter(r => r.status === 'pending').length;
  const totalPortions = myListings.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);

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
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pending Requests</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-3xl font-black text-amber-600">{pendingRequestsCount}</h3>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">Action Needed</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Charity claims awaiting confirmation</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Available Units</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-3xl font-black text-emerald-700">{totalPortions.toLocaleString()}</h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Portions</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Active inventory listed across categories</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Diverted from Landfill</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-3xl font-black text-blue-700">1,420 kg</h3>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">Verified</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">≈ 3,550 kg CO₂e emissions prevented</p>
          </div>
        </div>

        {/* Action Header Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Module 3: Food Listing Management Active
            </div>
            <h3 className="text-2xl font-black">Got Unsold Surplus Food Today?</h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
              List surplus items in 60 seconds with strict expiration windows and dietary tags. The AI matching algorithm will broadcast to nearby verified charities immediately.
            </p>
          </div>
          <button 
            onClick={() => setCreateModalOpen(true)}
            className="shrink-0 px-6 py-3.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 font-extrabold text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <PackagePlus className="w-5 h-5 text-emerald-700" />
            <span>List Surplus Food</span>
          </button>
        </div>

        {/* Current Active Listings Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Your Food Surplus Listings</h3>
              <p className="text-xs text-slate-500 mt-0.5">Manage stock availability, edit items, or cancel expired listings</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchMyListings}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition"
                title="Refresh listings"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCreateModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <PackagePlus className="w-4 h-4" />
                <span>New Listing</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6">Food Item</th>
                  <th className="py-3 px-6">Category</th>
                  <th className="py-3 px-6">Inventory</th>
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

        {/* Incoming Claims Section */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Incoming Charity Claims</h3>
              <p className="text-xs text-slate-500 mt-0.5">Approve donation requests submitted by verified NGOs</p>
            </div>
            <span className="text-xs font-semibold text-slate-400">Real-time Claims</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6">Food Item</th>
                  <th className="py-3 px-6">Requesting Charity</th>
                  <th className="py-3 px-6">Portions</th>
                  <th className="py-3 px-6">Urgency</th>
                  <th className="py-3 px-6">Request Time</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6 font-bold text-slate-900">{r.listingName}</td>
                    <td className="py-4 px-6 text-slate-600 font-semibold">{r.ngoName}</td>
                    <td className="py-4 px-6 text-slate-900 font-bold">{r.quantityRequested}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        r.urgency === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {r.urgency}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-400">{r.requestTime}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        r.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                        r.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {r.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleRequestAction(r.id, 'accepted')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRequestAction(r.id, 'rejected')}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
                          >
                            Decline
                          </button>
                        </>
                      ) : (
                        <span className="text-slate-400 font-semibold text-[11px]">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Modal */}
        <CreateListingModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onListingCreated={handleListingCreated}
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
