import React, { useState } from 'react';
import { listingService } from '../services/api';
import { X, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function EditListingModal({ isOpen, onClose, listing, onListingUpdated }) {
  if (!isOpen || !listing) return null;

  const [foodName, setFoodName] = useState(listing.foodName || '');
  const [quantity, setQuantity] = useState(listing.quantity || 1);
  const [foodCondition, setFoodCondition] = useState(listing.foodCondition || '');
  const [storageRequirements, setStorageRequirements] = useState(listing.storageRequirements || '');
  const [status, setStatus] = useState(listing.status || 'Available');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const updates = {
        foodName,
        quantity: Number(quantity),
        foodCondition,
        storageRequirements,
        status
      };

      const res = await listingService.updateListing(listing._id, updates);
      setLoading(false);

      if (res.success) {
        setSuccessMsg('Listing updated successfully!');
        if (onListingUpdated) onListingUpdated(res.listing);
        setTimeout(() => {
          setSuccessMsg(null);
          onClose();
        }, 1200);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.response?.data?.message || err.message || 'Update failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-slate-900 mb-1">Edit Surplus Listing</h3>
        <p className="text-xs text-slate-500 mb-4">{listing.foodName}</p>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-xs text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Food Name</label>
            <input
              type="text"
              required
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Available Quantity ({listing.unit})</label>
              <input
                type="number"
                min="0"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Listing Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 font-semibold"
              >
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
                <option value="Accepted">Accepted</option>
                <option value="Pickup Scheduled">Pickup Scheduled</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Condition & Freshness Notes</label>
            <input
              type="text"
              value={foodCondition}
              onChange={(e) => setFoodCondition(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Storage Instructions</label>
            <input
              type="text"
              value={storageRequirements}
              onChange={(e) => setStorageRequirements(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
