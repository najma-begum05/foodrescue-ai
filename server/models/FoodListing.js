import mongoose from 'mongoose';

const foodListingSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    providerName: {
      type: String,
      required: true,
      trim: true
    },
    providerType: {
      type: String,
      default: 'Restaurant / Kitchen'
    },
    foodName: {
      type: String,
      required: [true, 'Please provide the food surplus title'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please select a food category'],
      enum: [
        'Cooked Meals',
        'Bakery',
        'Fresh Produce',
        'Dairy',
        'Packaged Goods',
        'Beverages',
        'Other'
      ],
      default: 'Cooked Meals'
    },
    foodType: {
      type: String,
      enum: ['cooked', 'raw', 'packaged', 'fresh_produce'],
      default: 'cooked'
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'
    },
    quantity: {
      type: Number,
      required: [true, 'Please specify available quantity'],
      min: [1, 'Quantity must be at least 1']
    },
    unit: {
      type: String,
      required: true,
      enum: ['kg', 'litres', 'pieces', 'packets', 'meals'],
      default: 'meals'
    },
    foodCondition: {
      type: String,
      default: 'Freshly Prepared & Thermally Stored',
      trim: true
    },
    dietary: {
      type: String,
      enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Egg', 'Dairy Free', 'Gluten Free', 'Any'],
      default: 'Vegetarian'
    },
    preparationDate: {
      type: Date,
      default: Date.now
    },
    expiryDate: {
      type: Date,
      required: [true, 'Please provide the strict expiry date and time']
    },
    storageRequirements: {
      type: String,
      default: 'Keep Hot (>65°C) or Refrigerated (<4°C)',
      trim: true
    },
    pickupLocation: {
      type: String,
      required: [true, 'Please provide pickup location address'],
      trim: true
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [78.4867, 17.3850]
      }
    },
    pickupWindow: {
      type: String,
      default: 'Immediate collection requested',
      trim: true
    },
    status: {
      type: String,
      enum: [
        'Available',
        'Reserved',
        'Requested',
        'Accepted',
        'Pickup Scheduled',
        'Picked Up',
        'Delivered',
        'Expired',
        'Cancelled'
      ],
      default: 'Available'
    }
  },
  {
    timestamps: true
  }
);

// Geospatial index for geographic proximity matching
foodListingSchema.index({ location: '2dsphere' });
foodListingSchema.index({ status: 1, expiryDate: 1 });

const FoodListing = mongoose.models.FoodListing || mongoose.model('FoodListing', foodListingSchema);
export default FoodListing;
