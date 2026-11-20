import mongoose from 'mongoose';

const donationRequestSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodListing',
      required: true
    },
    listingName: {
      type: String,
      required: true
    },
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    ngoName: {
      type: String,
      required: true
    },
    ngoPhone: {
      type: String,
      default: ''
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    providerName: {
      type: String,
      required: true
    },
    quantityRequested: {
      type: Number,
      required: [true, 'Please specify quantity required'],
      min: [1, 'Quantity must be at least 1']
    },
    unit: {
      type: String,
      required: true,
      default: 'meals'
    },
    pickupSchedule: {
      type: String,
      default: 'Today within specified pickup window'
    },
    deliveryAddress: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: [
        'pending',
        'accepted',
        'rejected',
        'pickup_scheduled',
        'in_transit',
        'delivered',
        'completed',
        'cancelled'
      ],
      default: 'pending'
    },
    notes: {
      type: String,
      default: ''
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    completedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

donationRequestSchema.index({ provider: 1, status: 1 });
donationRequestSchema.index({ ngo: 1, status: 1 });

const DonationRequest = mongoose.models.DonationRequest || mongoose.model('DonationRequest', donationRequestSchema);
export default DonationRequest;
