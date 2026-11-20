import mongoose from 'mongoose';
import FoodListing from '../models/FoodListing.js';

// Category-based high quality default images
const CATEGORY_IMAGES = {
  'Cooked Meals': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
  'Bakery': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
  'Fresh Produce': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&auto=format&fit=crop&q=80',
  'Dairy': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
  'Packaged Goods': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
  'Beverages': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
  'Other': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'
};

// Initial Seed Listings for In-Memory Fallback & Instant Testing
export const inMemoryListings = [
  {
    _id: 'listing-001',
    provider: 'usr-provider-01',
    providerName: 'Grand Horizon Convention & Hotels',
    providerType: 'Hotel / Banquet',
    foodName: 'Fresh Cooked Banquet Meals (Biryani & Salads)',
    category: 'Cooked Meals',
    foodType: 'cooked',
    description: 'Hot banquet buffet surplus prepared for afternoon corporate luncheon. Stored in temperature-controlled cambro containers.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    quantity: 120,
    unit: 'meals',
    foodCondition: 'Freshly Prepared & Thermally Insulated',
    dietary: 'Vegetarian',
    preparationDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    expiryDate: new Date(Date.now() + 3.5 * 60 * 60 * 1000).toISOString(),
    storageRequirements: 'Keep Hot (>65°C)',
    pickupLocation: 'Banjara Hills Road #2, Hyderabad',
    location: { type: 'Point', coordinates: [78.4482, 17.4156] },
    pickupWindow: 'Today by 2:30 PM',
    status: 'Available',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'listing-002',
    provider: 'usr-provider-01',
    providerName: 'Grand Horizon Convention & Hotels',
    providerType: 'Hotel / Banquet',
    foodName: 'Artisan Sourdough & Multigrain Bread Loaves',
    category: 'Bakery',
    foodType: 'packaged',
    description: 'Freshly baked bakery loaves from morning buffet prep. Crisp crust, sealed in food-grade brown paper bags.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    quantity: 45,
    unit: 'pieces',
    foodCondition: 'Baked Today Morning',
    dietary: 'Vegan',
    preparationDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    expiryDate: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
    storageRequirements: 'Dry & Ambient Room Temperature',
    pickupLocation: 'Jubilee Hills Checkpost, Hyderabad',
    location: { type: 'Point', coordinates: [78.4116, 17.4319] },
    pickupWindow: 'Anytime before 6:00 PM',
    status: 'Available',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'listing-003',
    provider: 'usr-provider-02',
    providerName: 'Green Valley Organic Wholesale',
    providerType: 'Wholesaler / Farm',
    foodName: 'Organic Seasonal Apples & Sweet Oranges',
    category: 'Fresh Produce',
    foodType: 'fresh_produce',
    description: 'Farm crates of ripe fruits with minor cosmetic skin spots, completely edible and delicious.',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&auto=format&fit=crop&q=80',
    quantity: 250,
    unit: 'kg',
    foodCondition: 'Ripe, Slight Cosmetic Blemishes',
    dietary: 'Vegetarian',
    preparationDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    expiryDate: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    storageRequirements: 'Cool Storage (<15°C)',
    pickupLocation: 'Shamshabad Depot, Hyderabad',
    location: { type: 'Point', coordinates: [78.4294, 17.2403] },
    pickupWindow: 'Today 10:00 AM - 5:00 PM',
    status: 'Available',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'listing-004',
    provider: 'usr-provider-03',
    providerName: 'FreshDairy Superstore',
    providerType: 'Supermarket',
    foodName: 'Fortified Whole Milk & Natural Yogurt Cartons',
    category: 'Dairy',
    foodType: 'packaged',
    description: 'Commercial pasteurized milk and set yogurt approaching 2-day inventory sell-by dates.',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
    quantity: 80,
    unit: 'litres',
    foodCondition: 'Sealed, Unbroken Cold Chain',
    dietary: 'Vegetarian',
    preparationDate: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    expiryDate: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
    storageRequirements: 'Keep Refrigerated (<4°C)',
    pickupLocation: 'Madhapur Main Road, Hyderabad',
    location: { type: 'Point', coordinates: [78.3908, 17.4483] },
    pickupWindow: 'Immediate dispatch required',
    status: 'Available',
    createdAt: new Date().toISOString()
  }
];

/**
 * @route   GET /api/listings
 * @desc    Get all available surplus food listings (with optional category, search, and status filters)
 * @access  Public
 */
export const getAllListings = async (req, res) => {
  try {
    const { category, status, search } = req.query;

    if (mongoose.connection.readyState === 1) {
      const filter = {};
      if (category && category !== 'All') filter.category = category;
      if (status && status !== 'All') filter.status = status;
      if (search) {
        filter.$or = [
          { foodName: { $regex: search, $options: 'i' } },
          { providerName: { $regex: search, $options: 'i' } },
          { pickupLocation: { $regex: search, $options: 'i' } }
        ];
      }

      const listings = await FoodListing.find(filter).sort({ createdAt: -1 });
      return res.json({ success: true, count: listings.length, listings });
    }

    // In-memory fallback
    let result = [...inMemoryListings];
    if (category && category !== 'All') {
      result = result.filter(item => item.category === category);
    }
    if (status && status !== 'All') {
      result = result.filter(item => item.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(item =>
        item.foodName.toLowerCase().includes(q) ||
        item.providerName.toLowerCase().includes(q) ||
        item.pickupLocation.toLowerCase().includes(q)
      );
    }

    return res.json({ success: true, count: result.length, listings: result });
  } catch (err) {
    console.error('Error fetching listings:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving food listings.' });
  }
};

/**
 * @route   GET /api/listings/my/all
 * @desc    Get listings created by the logged-in provider
 * @access  Private (Provider)
 */
export const getMyListings = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    if (mongoose.connection.readyState === 1) {
      const listings = await FoodListing.find({ provider: req.user._id }).sort({ createdAt: -1 });
      return res.json({ success: true, count: listings.length, listings });
    }

    // In-memory filter: match by userId or default to 'usr-provider-01' for demo provider
    const myListings = inMemoryListings.filter(l => 
      l.provider === userId || (req.user.email === 'provider@foodrescue.org' && l.provider === 'usr-provider-01')
    );

    return res.json({ success: true, count: myListings.length, listings: myListings });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error retrieving your listings.' });
  }
};

/**
 * @route   GET /api/listings/:id
 * @desc    Get single listing details
 * @access  Public
 */
export const getListingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const listing = await FoodListing.findById(id).populate('provider', 'name email phone organizationName');
      if (!listing) return res.status(404).json({ success: false, message: 'Listing not found.' });
      return res.json({ success: true, listing });
    }

    const listing = inMemoryListings.find(l => l._id === id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found in session.' });
    return res.json({ success: true, listing });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error finding listing.' });
  }
};

/**
 * @route   POST /api/listings
 * @desc    Create a new surplus food listing
 * @access  Private (Provider / Admin)
 */
export const createListing = async (req, res) => {
  try {
    const {
      foodName,
      category,
      foodType,
      description,
      image,
      quantity,
      unit,
      foodCondition,
      dietary,
      preparationDate,
      expiryDate,
      storageRequirements,
      pickupLocation,
      coordinates,
      pickupWindow
    } = req.body;

    if (!foodName || !category || !quantity || !unit || !expiryDate || !pickupLocation) {
      return res.status(400).json({
        success: false,
        message: 'Please provide food name, category, quantity, unit, expiry date, and pickup location.'
      });
    }

    const assignedImage = image && image.trim() !== '' 
      ? image 
      : (CATEGORY_IMAGES[category] || CATEGORY_IMAGES['Cooked Meals']);

    const providerCoords = coordinates && Array.isArray(coordinates) && coordinates.length === 2
      ? coordinates
      : (req.user.location?.coordinates || [78.4867, 17.3850]);

    if (mongoose.connection.readyState === 1) {
      const newListing = await FoodListing.create({
        provider: req.user._id,
        providerName: req.user.organizationName || req.user.name,
        providerType: req.user.role === 'provider' ? 'Food Provider' : 'Registered Partner',
        foodName,
        category,
        foodType: foodType || 'cooked',
        description: description || '',
        image: assignedImage,
        quantity: Number(quantity),
        unit,
        foodCondition: foodCondition || 'Good Quality',
        dietary: dietary || 'Vegetarian',
        preparationDate: preparationDate || new Date(),
        expiryDate: new Date(expiryDate),
        storageRequirements: storageRequirements || 'Ambient',
        pickupLocation,
        location: {
          type: 'Point',
          coordinates: providerCoords
        },
        pickupWindow: pickupWindow || 'Immediate pickup available',
        status: 'Available'
      });

      return res.status(201).json({
        success: true,
        message: 'Food surplus listed successfully!',
        listing: newListing
      });
    }

    // In-memory fallback
    const newInMem = {
      _id: `listing-${Date.now()}`,
      provider: req.user._id.toString(),
      providerName: req.user.organizationName || req.user.name,
      providerType: 'Food Provider',
      foodName,
      category,
      foodType: foodType || 'cooked',
      description: description || '',
      image: assignedImage,
      quantity: Number(quantity),
      unit,
      foodCondition: foodCondition || 'Good Quality',
      dietary: dietary || 'Vegetarian',
      preparationDate: preparationDate || new Date().toISOString(),
      expiryDate: new Date(expiryDate).toISOString(),
      storageRequirements: storageRequirements || 'Ambient',
      pickupLocation,
      location: {
        type: 'Point',
        coordinates: providerCoords
      },
      pickupWindow: pickupWindow || 'Immediate pickup available',
      status: 'Available',
      createdAt: new Date().toISOString()
    };

    inMemoryListings.unshift(newInMem);

    return res.status(201).json({
      success: true,
      message: 'Food surplus listed successfully! (Session)',
      listing: newInMem
    });
  } catch (err) {
    console.error('Error creating listing:', err);
    return res.status(500).json({ success: false, message: err.message || 'Error creating food listing.' });
  }
};

/**
 * @route   PUT /api/listings/:id
 * @desc    Update a food listing
 * @access  Private (Owner / Admin)
 */
export const updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (mongoose.connection.readyState === 1) {
      const listing = await FoodListing.findById(id);
      if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });

      // Check ownership
      if (listing.provider.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Unauthorized to edit this listing.' });
      }

      Object.assign(listing, updates);
      await listing.save();
      return res.json({ success: true, message: 'Listing updated successfully!', listing });
    }

    const listing = inMemoryListings.find(l => l._id === id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found in session.' });

    if (listing.provider !== req.user._id.toString() && req.user.role !== 'admin' && req.user.email !== 'provider@foodrescue.org') {
      return res.status(403).json({ success: false, message: 'Unauthorized to edit this listing.' });
    }

    Object.assign(listing, updates);
    return res.json({ success: true, message: 'Listing updated successfully! (Session)', listing });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error updating listing.' });
  }
};

/**
 * @route   DELETE /api/listings/:id
 * @desc    Delete a food listing
 * @access  Private (Owner / Admin)
 */
export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const listing = await FoodListing.findById(id);
      if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });

      if (listing.provider.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Unauthorized to delete this listing.' });
      }

      await listing.deleteOne();
      return res.json({ success: true, message: 'Listing deleted successfully.' });
    }

    const index = inMemoryListings.findIndex(l => l._id === id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Listing not found in session.' });

    const listing = inMemoryListings[index];
    if (listing.provider !== req.user._id.toString() && req.user.role !== 'admin' && req.user.email !== 'provider@foodrescue.org') {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this listing.' });
    }

    inMemoryListings.splice(index, 1);
    return res.json({ success: true, message: 'Listing deleted successfully. (Session)' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error deleting listing.' });
  }
};

/**
 * @route   PATCH /api/listings/:id/status
 * @desc    Update listing status (Available, Reserved, Cancelled)
 * @access  Private (Owner / Admin)
 */
export const updateListingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      'Available', 'Reserved', 'Requested', 'Accepted',
      'Pickup Scheduled', 'Picked Up', 'Delivered', 'Expired', 'Cancelled'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid listing status.' });
    }

    if (mongoose.connection.readyState === 1) {
      const listing = await FoodListing.findByIdAndUpdate(id, { status }, { new: true });
      if (!listing) return res.status(404).json({ success: false, message: 'Listing not found.' });
      return res.json({ success: true, message: `Listing status changed to ${status}`, listing });
    }

    const listing = inMemoryListings.find(l => l._id === id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found in session.' });
    listing.status = status;

    return res.json({ success: true, message: `Listing status changed to ${status} (Session)`, listing });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error updating status.' });
  }
};
