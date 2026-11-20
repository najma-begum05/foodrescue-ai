import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  Package, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  AlertTriangle,
  HeartHandshake
} from 'lucide-react';

export const SAMPLE_FOOD_LISTINGS = [
  {
    id: 'food-001',
    foodName: 'Fresh Cooked Banquet Meals (Biryani & Salads)',
    category: 'Cooked Meals',
    providerName: 'Royal Palace Convention Center',
    providerType: 'Hotel / Banquet',
    quantity: 120,
    unit: 'meals',
    foodCondition: 'Freshly Prepared & Thermally Insulated',
    dietary: 'Vegetarian',
    location: 'Banjara Hills, Hyderabad',
    distance: 2.8,
    expiryHoursLeft: 3.5,
    urgency: 'CRITICAL',
    aiMatchScore: 98,
    matchReason: 'High priority due to 3.5h shelf-life; matches Hope Kitchen (2.8 km away, capacity 150 meals).',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'food-002',
    foodName: 'Artisan Sourdough & Multigrain Bread Loaves',
    category: 'Bakery',
    providerName: 'Boulangerie Artisan Bakery',
    providerType: 'Bakery',
    quantity: 45,
    unit: 'loaves',
    foodCondition: 'Baked Today Morning',
    dietary: 'Vegan',
    location: 'Jubilee Hills, Hyderabad',
    distance: 4.2,
    expiryHoursLeft: 20,
    urgency: 'URGENT',
    aiMatchScore: 91,
    matchReason: 'Bakery batch baked 6h ago. Compatible with St. Jude Youth Shelter.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'food-003',
    foodName: 'Organic Seasonal Apples & Oranges',
    category: 'Fresh Produce',
    providerName: 'Green Valley Organic Farms',
    providerType: 'Farmer / Co-op',
    quantity: 250,
    unit: 'kg',
    foodCondition: 'Ripe, Slight Cosmetic Blemishes',
    dietary: 'Fresh Fruit',
    location: 'Shamshabad Depot, Hyderabad',
    distance: 8.5,
    expiryHoursLeft: 72,
    urgency: 'MODERATE',
    aiMatchScore: 89,
    matchReason: 'High volume fresh fruit surplus; ideal for community kitchen weekly breakfast program.',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'food-004',
    foodName: 'Fortified Whole Milk & Natural Yogurt Cartons',
    category: 'Dairy',
    providerName: 'FreshDairy Superstore',
    providerType: 'Supermarket',
    quantity: 80,
    unit: 'litres',
    foodCondition: 'Sealed, Continuous Cold Chain Stored',
    dietary: 'Vegetarian',
    location: 'Madhapur, Hyderabad',
    distance: 3.1,
    expiryHoursLeft: 18,
    urgency: 'URGENT',
    aiMatchScore: 94,
    matchReason: 'Refrigerated transport required; close to Sunshine Children Home.',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'food-005',
    foodName: 'Premium Basmati Rice & Red Lentils (Dry Packaged)',
    category: 'Packaged Goods',
    providerName: 'National Grain Distributors',
    providerType: 'Wholesaler',
    quantity: 500,
    unit: 'kg',
    foodCondition: 'Original Factory Sealed Sacks',
    dietary: 'Dry Staples',
    location: 'Kukatpally Logistics Hub',
    distance: 11.2,
    expiryHoursLeft: 720,
    urgency: 'LOW',
    aiMatchScore: 82,
    matchReason: 'Non-perishable shelf staples; can be stored up to 30 days by food banks.',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'food-006',
    foodName: 'Campus Dining Evening Dinner Surplus',
    category: 'Cooked Meals',
    providerName: 'Tech University Student Mess',
    providerType: 'Educational Institution',
    quantity: 90,
    unit: 'meals',
    foodCondition: 'Kept Hot at >65°C in Food Warmer',
    dietary: 'Vegetarian',
    location: 'Gachibowli, Hyderabad',
    distance: 5.0,
    expiryHoursLeft: 4.0,
    urgency: 'CRITICAL',
    aiMatchScore: 96,
    matchReason: 'Immediate evening collection required within 90 minutes.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'
  }
];

export default function LiveFoodShowcase({ onOpenAuth }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Cooked Meals', 'Bakery', 'Fresh Produce', 'Dairy', 'Packaged Goods'];

  const filteredListings = SAMPLE_FOOD_LISTINGS.filter((item) => {
    const matchesSearch = item.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-300',
          dot: 'bg-rose-600',
          label: 'Critical (< 4h)'
        };
      case 'URGENT':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          dot: 'bg-amber-500',
          label: 'Urgent (< 24h)'
        };
      case 'MODERATE':
        return {
          bg: 'bg-blue-100 text-blue-800 border-blue-300',
          dot: 'bg-blue-500',
          label: 'Moderate'
        };
      default:
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500',
          label: 'Low Urgency'
        };
    }
  };

  return (
    <section className="py-20 bg-[#F8FAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Live Surplus Discovery
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
              Available Surplus Ready for Rescue
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Browse real-time listings currently awaiting NGO claim and logistics dispatch.
            </p>
          </div>
          <Link
            to="/available-food"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800"
          >
            <span>View Full Directory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by food name, provider, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.slice(0, 6).map((item) => {
            const urgencyBadge = getUrgencyBadge(item.urgency);
            return (
              <div 
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col"
              >
                {/* Image & Top Badges */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.foodName}
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border shadow-xs ${urgencyBadge.bg}`}>
                      <span className={`w-2 h-2 rounded-full ${urgencyBadge.dot} animate-pulse`} />
                      {urgencyBadge.label}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-950/80 text-emerald-300 backdrop-blur-xs border border-emerald-500/30">
                      <Sparkles className="w-3 h-3" />
                      {item.aiMatchScore}% Match
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-semibold text-emerald-700">{item.category}</span>
                      <span>{item.dietary}</span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-base leading-snug line-clamp-1">
                      {item.foodName}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <span>By {item.providerName}</span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="text-[11px] text-slate-400">{item.providerType}</span>
                    </p>

                    {/* Quantity & Distance Pills */}
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Available</span>
                        <p className="font-bold text-slate-900 mt-0.5">{item.quantity} {item.unit}</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Distance</span>
                        <p className="font-bold text-emerald-700 mt-0.5">{item.distance} km away</p>
                      </div>
                    </div>

                    {/* AI Recommendation Reason */}
                    <div className="mt-3.5 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-900">
                      <span className="font-semibold flex items-center gap-1 mb-0.5 text-emerald-800">
                        <Sparkles className="w-3 h-3 text-emerald-600" /> AI Recommendation Reason:
                      </span>
                      <p className="line-clamp-2 leading-relaxed text-slate-600">{item.matchReason}</p>
                    </div>
                  </div>

                  {/* Action CTA */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-[150px]">{item.location}</span>
                    </span>
                    <button
                      onClick={() => onOpenAuth('login')}
                      className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition cursor-pointer"
                    >
                      Request Food
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
