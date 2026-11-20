import React, { useState, useEffect } from 'react';
import { listingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  PackagePlus, 
  Clock, 
  MapPin, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Utensils, 
  ShieldCheck, 
  Calendar,
  Layers
} from 'lucide-react';

export default function CreateListingModal({ isOpen, onClose, onListingCreated, initialValues = null }) {
  const { user } = useAuth();

  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState('Cooked Meals');
  const [foodType, setFoodType] = useState('cooked');
  const [quantity, setQuantity] = useState(50);
  const [unit, setUnit] = useState('meals');
  const [dietary, setDietary] = useState('Vegetarian');
  const [foodCondition, setFoodCondition] = useState('Freshly Prepared & Thermally Insulated');
  const [storageRequirements, setStorageRequirements] = useState('Keep Hot (>65°C)');
  const [pickupLocation, setPickupLocation] = useState(user?.address || 'Banjara Hills, Hyderabad');
  const [pickupWindow, setPickupWindow] = useState('Today within 3 hours');
  const [image, setImage] = useState('');
  
  // Set default expiry to 4 hours from now
  const defaultExpiry = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString().slice(0, 16);
  const [expiryDate, setExpiryDate] = useState(defaultExpiry);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Auto-fill from AI Forecast if provided
  useEffect(() => {
    if (initialValues) {
      if (initialValues.category) handleCategoryChange(initialValues.category);
      if (initialValues.quantity) setQuantity(initialValues.quantity);
      if (initialValues.foodName) setFoodName(initialValues.foodName);
    }
  }, [initialValues, isOpen]);

  if (!isOpen) return null;

  // Auto-adjust default storage and foodType based on category
  const handleCategoryChange = (cat) => {
    setCategory(cat);
    if (cat === 'Cooked Meals') {
      setFoodType('cooked');
      setUnit('meals');
      setStorageRequirements('Keep Hot (>65°C)');
    } else if (cat === 'Bakery') {
      setFoodType('packaged');
      setUnit('pieces');
      setStorageRequirements('Dry & Cool Ambient Storage');
    } else if (cat === 'Dairy') {
      setFoodType('packaged');
      setUnit('litres');
      setStorageRequirements('Keep Refrigerated (<4°C)');
    } else if (cat === 'Fresh Produce') {
      setFoodType('fresh_produce');
      setUnit('kg');
      setStorageRequirements('Cool Ambient Storage (<15°C)');
    } else {
      setFoodType('packaged');
      setUnit('kg');
      setStorageRequirements('Dry Room Temperature Storage');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const payload = {
        foodName,
        category,
        foodType,
        quantity: Number(quantity),
        unit,
        dietary,
        foodCondition,
        storageRequirements,
        pickupLocation,
        pickupWindow,
        expiryDate: new Date(expiryDate).toISOString(),
        image,
        coordinates: user?.location?.coordinates || [78.4867, 17.3850]
      };

      const res = await listingService.createListing(payload);
      setLoading(false);

      if (res.success) {
        setSuccessMsg('Food surplus listing broadcasted successfully!');
        if (onListingCreated) onListingCreated(res.listing);
        setTimeout(() => {
          setSuccessMsg(null);
          onClose();
        }, 1800);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to publish listing.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Module 3: Surplus Listing Engine
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            Create Food Surplus Listing
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Publish unsold edible food to instantly match with nearby verified charities.
          </p>
        </div>

        {/* Feedback alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-bold">{successMsg}</span>
          </div>
        )}

        {/* Listing Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Food Title */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Food Item Name / Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Vegetarian Buffet Surplus (Biryani, Dal Makhani & Roti)"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category & Dietary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Food Category *</label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 font-semibold"
              >
                <option value="Cooked Meals">Cooked Meals (Buffet / Catering)</option>
                <option value="Bakery">Bakery (Bread, Buns, Pastries)</option>
                <option value="Fresh Produce">Fresh Produce (Fruits & Vegetables)</option>
                <option value="Dairy">Dairy (Milk, Yogurt, Paneer)</option>
                <option value="Packaged Goods">Packaged Staples (Rice, Flour, Grains)</option>
                <option value="Beverages">Beverages & Juices</option>
                <option value="Other">Other Surplus Items</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Dietary Classification</label>
              <select
                value={dietary}
                onChange={(e) => setDietary(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 font-semibold"
              >
                <option value="Vegetarian">Pure Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Vegan">Vegan (Plant-Based)</option>
                <option value="Egg">Contains Egg</option>
                <option value="Dairy Free">Dairy Free</option>
                <option value="Gluten Free">Gluten Free</option>
              </select>
            </div>
          </div>

          {/* Quantity & Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Available Quantity *</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Unit of Measurement *</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 font-semibold"
              >
                <option value="meals">meals (Portions)</option>
                <option value="kg">kg (Kilograms)</option>
                <option value="litres">litres</option>
                <option value="pieces">pieces / loaves</option>
                <option value="packets">packets / cartons</option>
              </select>
            </div>
          </div>

          {/* Expiry Date & Pickup Window */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Strict Expiration Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-medium"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Crucial for AI urgency classification (Critical &lt; 4h)
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Available Pickup Window
              </label>
              <input
                type="text"
                placeholder="e.g. Today 2:00 PM - 5:00 PM"
                value={pickupWindow}
                onChange={(e) => setPickupWindow(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Storage & Food Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Storage Condition</label>
              <input
                type="text"
                value={storageRequirements}
                onChange={(e) => setStorageRequirements(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Food Quality & Freshness</label>
              <input
                type="text"
                value={foodCondition}
                onChange={(e) => setFoodCondition(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Pickup Location */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Pickup Address & Facility Location *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Optional Image */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Food Photo URL (Optional)
            </label>
            <input
              type="url"
              placeholder="Leave blank for automatic category photo"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-md shadow-emerald-700/20 rounded-xl transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <PackagePlus className="w-4 h-4" />
              <span>{loading ? 'Publishing...' : 'Publish Surplus Listing'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
