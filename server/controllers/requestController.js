import mongoose from 'mongoose';
import DonationRequest from '../models/DonationRequest.js';
import FoodListing from '../models/FoodListing.js';
import { inMemoryListings } from './listingController.js';

// Pre-seeded sample donation claims for in-memory session testing
export const inMemoryRequests = [
  {
    _id: 'req-101',
    listing: 'listing-001',
    listingName: 'Fresh Cooked Banquet Meals (Biryani & Salads)',
    ngo: 'usr-ngo-01',
    ngoName: 'Hope Haven Community Kitchen & Shelter',
    ngoPhone: '+91 98480 12345',
    provider: 'usr-provider-01',
    providerName: 'Grand Horizon Convention & Hotels',
    quantityRequested: 80,
    unit: 'meals',
    pickupSchedule: 'Today 2:00 PM - 3:00 PM',
    deliveryAddress: 'Lakdikapul Shelter Center, Hyderabad',
    status: 'pending',
    notes: 'Our volunteer van equipped with thermal insulated crates will collect.',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  },
  {
    _id: 'req-102',
    listing: 'listing-002',
    listingName: 'Artisan Sourdough & Multigrain Bread Loaves',
    ngo: 'usr-ngo-01',
    ngoName: 'Hope Haven Community Kitchen & Shelter',
    ngoPhone: '+91 98480 12345',
    provider: 'usr-provider-01',
    providerName: 'Grand Horizon Convention & Hotels',
    quantityRequested: 30,
    unit: 'pieces',
    pickupSchedule: 'Today by 5:00 PM',
    deliveryAddress: 'Lakdikapul Shelter Center, Hyderabad',
    status: 'accepted',
    notes: 'For youth evening snack program.',
    createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString()
  }
];

/**
 * @route   POST /api/requests
 * @desc    Submit a donation claim for a surplus food listing with Inventory Reservation Lock
 * @access  Private (NGO / Recipient)
 */
export const createRequest = async (req, res) => {
  try {
    const { listingId, quantityRequested, notes, pickupSchedule } = req.body;

    if (!listingId || !quantityRequested) {
      return res.status(400).json({
        success: false,
        message: 'Please provide listing ID and requested quantity.'
      });
    }

    const requestedQty = Number(quantityRequested);
    if (requestedQty <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Requested quantity must be at least 1.'
      });
    }

    // 1. Try MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      const listing = await FoodListing.findById(listingId);
      if (!listing) {
        return res.status(404).json({ success: false, message: 'Food listing not found.' });
      }

      if (listing.status !== 'Available') {
        return res.status(400).json({
          success: false,
          message: `This listing is currently ${listing.status} and cannot accept new requests.`
        });
      }

      // Concurrency & Overbooking Guard: Inventory Reservation Lock
      if (requestedQty > listing.quantity) {
        return res.status(400).json({
          success: false,
          message: `Requested quantity (${requestedQty} ${listing.unit}) exceeds currently available stock (${listing.quantity} ${listing.unit}).`
        });
      }

      // Deduct inventory and update listing status
      listing.quantity -= requestedQty;
      if (listing.quantity === 0) {
        listing.status = 'Reserved';
      }
      await listing.save();

      const newRequest = await DonationRequest.create({
        listing: listing._id,
        listingName: listing.foodName,
        ngo: req.user._id,
        ngoName: req.user.organizationName || req.user.name,
        ngoPhone: req.user.phone || '',
        provider: listing.provider,
        providerName: listing.providerName,
        quantityRequested: requestedQty,
        unit: listing.unit,
        pickupSchedule: pickupSchedule || listing.pickupWindow || 'Today',
        deliveryAddress: req.user.address || '',
        status: 'pending',
        notes: notes || ''
      });

      return res.status(201).json({
        success: true,
        message: `Donation request submitted! Reserved ${requestedQty} ${listing.unit}.`,
        request: newRequest,
        remainingStock: listing.quantity
      });
    }

    // 2. In-Memory Fallback
    const listing = inMemoryListings.find(l => l._id === listingId);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Food listing not found in session.' });
    }

    if (listing.status !== 'Available') {
      return res.status(400).json({
        success: false,
        message: `This listing is currently ${listing.status} and cannot accept new claims.`
      });
    }

    // Inventory Lock
    if (requestedQty > listing.quantity) {
      return res.status(400).json({
        success: false,
        message: `Requested quantity (${requestedQty} ${listing.unit}) exceeds currently available stock (${listing.quantity} ${listing.unit}).`
      });
    }

    // Deduct stock
    listing.quantity -= requestedQty;
    if (listing.quantity === 0) {
      listing.status = 'Reserved';
    }

    const newRequest = {
      _id: `req-${Date.now()}`,
      listing: listing._id,
      listingName: listing.foodName,
      ngo: req.user._id.toString(),
      ngoName: req.user.organizationName || req.user.name,
      ngoPhone: req.user.phone || '+91 98480 12345',
      provider: listing.provider,
      providerName: listing.providerName,
      quantityRequested: requestedQty,
      unit: listing.unit,
      pickupSchedule: pickupSchedule || listing.pickupWindow || 'Today',
      deliveryAddress: req.user.address || 'Local Community Shelter',
      status: 'pending',
      notes: notes || '',
      createdAt: new Date().toISOString()
    };

    inMemoryRequests.unshift(newRequest);

    return res.status(201).json({
      success: true,
      message: `Donation request submitted! Reserved ${requestedQty} ${listing.unit}. (Session)`,
      request: newRequest,
      remainingStock: listing.quantity
    });

  } catch (err) {
    console.error('Request creation error:', err);
    return res.status(500).json({ success: false, message: 'Error processing donation claim.' });
  }
};

/**
 * @route   GET /api/requests/incoming
 * @desc    Get all requests received by the logged-in Food Provider
 * @access  Private (Provider / Admin)
 */
export const getMyIncomingRequests = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    if (mongoose.connection.readyState === 1) {
      const requests = await DonationRequest.find({ provider: req.user._id }).sort({ createdAt: -1 });
      return res.json({ success: true, count: requests.length, requests });
    }

    // In-memory fallback
    const incoming = inMemoryRequests.filter(r => 
      r.provider === userId || (req.user.email === 'provider@foodrescue.org' && r.provider === 'usr-provider-01')
    );

    return res.json({ success: true, count: incoming.length, requests: incoming });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching incoming requests.' });
  }
};

/**
 * @route   GET /api/requests/outgoing
 * @desc    Get all requests made by the logged-in NGO
 * @access  Private (NGO / Admin)
 */
export const getMyOutgoingRequests = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    if (mongoose.connection.readyState === 1) {
      const requests = await DonationRequest.find({ ngo: req.user._id }).sort({ createdAt: -1 });
      return res.json({ success: true, count: requests.length, requests });
    }

    // In-memory fallback
    const outgoing = inMemoryRequests.filter(r => 
      r.ngo === userId || (req.user.email === 'ngo@foodrescue.org' && r.ngo === 'usr-ngo-01')
    );

    return res.json({ success: true, count: outgoing.length, requests: outgoing });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching outgoing claims.' });
  }
};

/**
 * @route   PATCH /api/requests/:id/respond
 * @desc    Provider accepts or rejects a donation request (releases inventory lock if rejected)
 * @access  Private (Provider / Admin)
 */
export const respondToRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, pickupSchedule, rejectionReason } = req.body; // action: 'accept' or 'reject'

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ success: false, message: "Action must be 'accept' or 'reject'." });
    }

    const newStatus = action === 'accept' ? 'accepted' : 'rejected';

    if (mongoose.connection.readyState === 1) {
      const request = await DonationRequest.findById(id);
      if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });

      if (request.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: `Request is already ${request.status} and cannot be modified.`
        });
      }

      request.status = newStatus;
      if (pickupSchedule) request.pickupSchedule = pickupSchedule;
      if (rejectionReason) request.rejectionReason = rejectionReason;
      await request.save();

      // If rejected, restore inventory lock back to listing
      if (action === 'reject') {
        const listing = await FoodListing.findById(request.listing);
        if (listing) {
          listing.quantity += request.quantityRequested;
          if (listing.status === 'Reserved') {
            listing.status = 'Available';
          }
          await listing.save();
        }
      }

      return res.json({
        success: true,
        message: `Request ${action}ed successfully.`,
        request
      });
    }

    // In-memory fallback
    const request = inMemoryRequests.find(r => r._id === id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found in session.' });

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Request is already ${request.status} and cannot be modified.`
      });
    }

    request.status = newStatus;
    if (pickupSchedule) request.pickupSchedule = pickupSchedule;
    if (rejectionReason) request.rejectionReason = rejectionReason;

    // Release inventory lock if rejected
    if (action === 'reject') {
      const listing = inMemoryListings.find(l => l._id === request.listing);
      if (listing) {
        listing.quantity += request.quantityRequested;
        if (listing.status === 'Reserved') {
          listing.status = 'Available';
        }
      }
    }

    return res.json({
      success: true,
      message: `Request ${action}ed successfully. (Session)`,
      request
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error processing request response.' });
  }
};

/**
 * @route   PATCH /api/requests/:id/confirm
 * @desc    NGO confirms physical food collection receipt (completes donation cycle)
 * @access  Private (NGO / Admin)
 */
export const confirmReceipt = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const request = await DonationRequest.findById(id);
      if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });

      request.status = 'completed';
      request.completedAt = new Date();
      await request.save();

      // Update listing status if fully distributed
      const listing = await FoodListing.findById(request.listing);
      if (listing && listing.quantity === 0) {
        listing.status = 'Delivered';
        await listing.save();
      }

      return res.json({
        success: true,
        message: 'Food receipt verified! Donation cycle successfully completed.',
        request
      });
    }

    // In-memory fallback
    const request = inMemoryRequests.find(r => r._id === id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found in session.' });

    request.status = 'completed';
    request.completedAt = new Date().toISOString();

    const listing = inMemoryListings.find(l => l._id === request.listing);
    if (listing && listing.quantity === 0) {
      listing.status = 'Delivered';
    }

    return res.json({
      success: true,
      message: 'Food receipt verified! Donation cycle successfully completed. (Session)',
      request
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error confirming receipt.' });
  }
};

/**
 * @route   DELETE /api/requests/:id/cancel
 * @desc    NGO cancels a pending request (releases reserved inventory lock)
 * @access  Private (NGO / Admin)
 */
export const cancelRequest = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const request = await DonationRequest.findById(id);
      if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });

      if (request.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Only pending donation requests can be cancelled.'
        });
      }

      request.status = 'cancelled';
      await request.save();

      // Restore inventory lock
      const listing = await FoodListing.findById(request.listing);
      if (listing) {
        listing.quantity += request.quantityRequested;
        if (listing.status === 'Reserved') {
          listing.status = 'Available';
        }
        await listing.save();
      }

      return res.json({ success: true, message: 'Donation request cancelled and stock restored.' });
    }

    // In-memory fallback
    const request = inMemoryRequests.find(r => r._id === id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Only pending requests can be cancelled.' });
    }

    request.status = 'cancelled';

    const listing = inMemoryListings.find(l => l._id === request.listing);
    if (listing) {
      listing.quantity += request.quantityRequested;
      if (listing.status === 'Reserved') {
        listing.status = 'Available';
      }
    }

    return res.json({ success: true, message: 'Donation request cancelled and stock restored. (Session)' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error cancelling request.' });
  }
};
