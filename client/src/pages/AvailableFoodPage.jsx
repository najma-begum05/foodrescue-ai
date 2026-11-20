import React, { useState, useEffect } from 'react';
import { SAMPLE_FOOD_LISTINGS } from '../components/LiveFoodShowcase';
import { listingService, requestService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Package, 
  HeartHandshake, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export default function AvailableFoodPage({ onOpenAuth }) {
  const { user } = useAuth();

  const [listings, setListings] = useState(SAMPLE_FOOD_LISTINGS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedUrgency, setSelectedUrgency] = useState('All');
  const [sortBy, setSortBy] = useState('urgency');
  
  // Claim / Request Food Modal state
  const [selectedItemForRequest, setSelectedItemForRequest] = useState(null);
  const [requestQuantity, setRequestQuantity] = useState(1);
  const [requestNote, setRequestNote] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [requestSuccessMsg, setRequestSuccessMsg] = useState(null);
  const [requestErrorMsg, setRequestErrorMsg] = useState(null);

  const categories = ['All', 'Cooked Meals', 'Bakery', 'Fresh Produce', 'Dairy', 'Packaged Goods'];
  const urgencies = ['All', 'CRITICAL', 'URGENT', 'MODERATE', 'LOW'];

  const fetchLiveListings = async () => {
    setLoading(true);
    try {
      const data = await listingService.getAllListings();
      if (data.success && data.listings && data.listings.length > 0) {
        const normalized = data.listings.map(item => {
          const hoursLeft = Math.max(0, Math.round((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60)));
          let urgency = 'MODERATE';
          if (hoursLeft <= 4 || (item.category === 'Cooked Meals' && hoursLeft <= 6)) urgency = 'CRITICAL';
          else if (hoursLeft <= 24) urgency = 'URGENT';
          else if (hoursLeft > 120) urgency = 'LOW';

          return {
            id: item._id,
            foodName: item.foodName,
            category: item.category,
            providerName: item.providerName || 'Registered Donor',
            providerType: item.providerType || 'Food Provider',
            quantity: item.quantity,
            unit: item.unit,
            foodCondition: item.foodCondition || 'Quality Inspected',
            dietary: item.dietary || 'Vegetarian',
            location: item.pickupLocation,
            distance: item.distance || (Math.random() * 6 + 1).toFixed(1),
            expiryHoursLeft: hoursLeft,
            urgency,
            aiMatchScore: item.aiMatchScore || Math.floor(Math.random() * 15 + 85),
            matchReason: item.description || `Fresh ${item.category} listed by ${item.providerName}. Recommended for rapid distribution.`,
            image: item.image,
            status: item.status
          };
        });
        setListings(normalized);
      }
    } catch (err) {
      console.warn('Using baseline listings:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveListings();
  }, []);

  // Filter and sort listings
  const filtered = listings.filter((item) => {
    const matchesSearch = item.foodName.toLowerCase().includes(search.toLowerCase()) ||
                          item.providerName.toLowerCase().includes(search.toLowerCase()) ||
                          item.location.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesUrg = selectedUrgency === 'All' || item.urgency === selectedUrgency;
    return matchesSearch && matchesCat && matchesUrg;
  }).sort((a, b) => {
    if (sortBy === 'urgency') {
      const order = { 'CRITICAL': 1, 'URGENT': 2, 'MODERATE': 3, 'LOW': 4 };
      return (order[a.urgency] || 3) - (order[b.urgency] || 3);
    }
    if (sortBy === 'distance') return a.distance - b.distance;
    if (sortBy === 'quantity') return b.quantity - a.quantity;
    return 0;
  });

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'CRITICAL':
        return { bg: 'bg-rose-100 text-rose-800 border-rose-300', dot: 'bg-rose-600', label: 'Critical (< 4h)' };
      case 'URGENT':
        return { bg: 'bg-amber-100 text-amber-800 border-amber-300', dot: 'bg-amber-500', label: 'Urgent (< 24h)' };
      case 'MODERATE':
        return { bg: 'bg-blue-100 text-blue-800 border-blue-300', dot: 'bg-blue-500', label: 'Moderate' };
      default:
        return { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', dot: 'bg-emerald-500', label: 'Low Urgency' };
    }
  };

  const handleOpenRequestModal = (item) => {
    if (!user) {
      onOpenAuth('login');
      return;
    }
    setSelectedItemForRequest(item);
    setRequestQuantity(Math.min(50, item.quantity));
    setRequestNote('');
    setRequestErrorMsg(null);
    setRequestSuccessMsg(null);
  };

  const handleConfirmRequest = async (e) => {
    e.preventDefault();
    setSubmittingRequest(true);
    setRequestErrorMsg(null);
    setRequestSuccessMsg(null);

    try {
      const res = await requestService.createRequest({
        listingId: selectedItemForRequest.id,
        quantityRequested: Number(requestQuantity),
        notes: requestNote
      });

      setSubmittingRequest(false);

      if (res.success) {
        setRequestSuccessMsg(`Donation request confirmed! Inventory lock reserved ${requestQuantity} ${selectedItemForRequest.unit}.`);
        
        // Update local listing quantity
        setListings(listings.map(l => {
          if (l.id === selectedItemForRequest.id) {
            const newQty = Math.max(0, l.quantity - Number(requestQuantity));
            return { ...l, quantity: newQty, status: newQty === 0 ? 'Reserved' : l.status };
          }
          return l;
        }));

        setTimeout(() => {
          setRequestSuccessMsg(null);
          setSelectedItemForRequest(null);
        }, 2200);
      } else {
        setRequestErrorMsg(res.message);
      }
    } catch (err) {
      setSubmittingRequest(false);
      setRequestErrorMsg(err.response?.data?.message || err.message || 'Failed to submit donation request.');
    }
  };

  return (
    <div className="py-12 bg-[#F8FAF8] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Live Surplus Directory
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
              Available Food Redistribution Board
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Surplus food inventory from hotels, farms, supermarkets & restaurants ready for collection.
            </p>
          </div>
          <button
            onClick={fetchLiveListings}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-700' : ''}`} />
            <span>Refresh Board</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs mb-8 space-y-4">
          
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search food, provider, or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end text-xs font-semibold text-slate-600">
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
              >
                <option value="urgency">Expiry Urgency (Critical First)</option>
                <option value="distance">Nearest Distance</option>
                <option value="quantity">Highest Quantity</option>
              </select>
            </div>
          </div>

          {/* Category & Urgency filter pills */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            
            {/* Category Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-slate-400 mr-1">Category:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Urgency Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-xs font-bold text-slate-400 mr-1">Urgency:</span>
              {urgencies.map((urg) => (
                <button
                  key={urg}
                  onClick={() => setSelectedUrgency(urg)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer whitespace-nowrap ${
                    selectedUrgency === urg ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {urg}
                </button>
              ))}
            </div>

          </div>

        </div>

        {/* Results Counter */}
        <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
          <span>Showing <strong>{filtered.length}</strong> active food listings</span>
          <span>⚡ Multi-recipient Inventory Reservation Lock Active</span>
        </div>

        {/* Listings Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">No matching food surplus found</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting your filters or search keywords.</p>
            <button
              onClick={() => { setSearch(''); setSelectedCategory('All'); setSelectedUrgency('All'); }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => {
              const urgencyBadge = getUrgencyBadge(item.urgency);
              const isAvailable = item.status === 'Available' && item.quantity > 0;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Food Card Image */}
                    <div className="relative h-48 w-full bg-slate-100">
                      <img
                        src={item.image}
                        alt={item.foodName}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border shadow-xs ${urgencyBadge.bg}`}>
                          <span className={`w-2 h-2 rounded-full ${urgencyBadge.dot} animate-pulse`} />
                          {urgencyBadge.label}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-950/85 text-emerald-300 backdrop-blur-xs border border-emerald-500/30">
                          <Sparkles className="w-3 h-3" />
                          {item.aiMatchScore}% Score
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="font-semibold text-emerald-700">{item.category}</span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded-md text-[11px] font-medium">{item.dietary}</span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-base leading-snug line-clamp-1">
                        {item.foodName}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Provider: <span className="font-semibold text-slate-700">{item.providerName}</span> ({item.providerType})
                      </p>

                      {/* Quantity & Distance Pill */}
                      <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Inventory</span>
                          <p className="font-bold text-slate-900 mt-0.5">{item.quantity} {item.unit}</p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Proximity</span>
                          <p className="font-bold text-emerald-700 mt-0.5">{item.distance} km away</p>
                        </div>
                      </div>

                      <div className="mt-2.5 text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-700">Freshness:</span> {item.foodCondition}
                      </div>

                      {/* AI Reason box */}
                      <div className="mt-3 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-950">
                        <span className="font-bold flex items-center gap-1 text-emerald-800 mb-0.5">
                          <Sparkles className="w-3 h-3 text-emerald-600" /> AI Recommendation
                        </span>
                        <p className="text-slate-600 line-clamp-2 leading-relaxed">{item.matchReason}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="p-5 pt-0">
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-[140px]">{item.location}</span>
                      </span>
                      {isAvailable ? (
                        <button
                          onClick={() => handleOpenRequestModal(item)}
                          className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition cursor-pointer flex items-center gap-1.5"
                        >
                          <HeartHandshake className="w-3.5 h-3.5" />
                          <span>Request Donation</span>
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500 font-semibold text-xs">
                          {item.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Claim / Donation Request Modal */}
        {selectedItemForRequest && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
              
              <button
                onClick={() => setSelectedItemForRequest(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Module 5: Donation Claim & Reservation Lock
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  Request: {selectedItemForRequest.foodName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Provided by {selectedItemForRequest.providerName} &bull; {selectedItemForRequest.location}
                </p>
              </div>

              {requestErrorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{requestErrorMsg}</span>
                </div>
              )}

              {requestSuccessMsg ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-emerald-950 text-base">Request Submitted Successfully!</h4>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    {requestSuccessMsg}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleConfirmRequest} className="space-y-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                    <p className="text-slate-600">Currently available stock: <strong>{selectedItemForRequest.quantity} {selectedItemForRequest.unit}</strong></p>
                    <p className="text-slate-600">Strict remaining shelf-life: <strong>{selectedItemForRequest.expiryHoursLeft} hours</strong></p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Quantity Required ({selectedItemForRequest.unit}) *:
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={selectedItemForRequest.quantity}
                      value={requestQuantity}
                      onChange={(e) => setRequestQuantity(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-bold"
                      required
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      🔒 Inventory Reservation Lock: Reserving this quantity prevents double-allocation by other charities.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Collection Schedule & Logistics Notes:
                    </label>
                    <textarea
                      rows="2"
                      placeholder="e.g. Hope Haven collection van will arrive with thermal crates by 2:15 PM..."
                      value={requestNote}
                      onChange={(e) => setRequestNote(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 text-xs"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedItemForRequest(null)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingRequest}
                      className="px-5 py-2.5 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {submittingRequest ? 'Locking Inventory...' : 'Submit Donation Request'}
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
