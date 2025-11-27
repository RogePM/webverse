import mongoose from 'mongoose';

const FoodItemSchema = new mongoose.Schema({
  pantryId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  // NEW: Enforce units
  unit: {
    type: String,
    required: true,
    enum: ['units', 'lbs', 'kg', 'oz'], // Strict typing
    default: "units"
  },
  barcode: {
    type: String,
    default: null,   // important: must allow null
  },
  storageLocation: {
    type: String,
    default: "N/A",
  },
  expirationDate: {
    type: Date
  }, // Made optional if needed, but good to have
  lastModified: {
    type: Date,
    default: Date.now,
  },
});

// --- 🔥 Critical Part: Unique per pantry ONLY when barcode exists ---
FoodItemSchema.index(
  { pantryId: 1, barcode: 1 },
  {
    unique: true,
    partialFilterExpression: { barcode: { $type: "string" } },
  }
);


// --- Barcode Cache Schema ---
const BarcodeCacheSchema = new mongoose.Schema({
  pantryId: {
    type: String,
    required: true,
    index: true
  },
  barcode: {
    type: String,
    required: true,
  },
  name: String,
  brand: String,
  category: String,
  storageLocation: String,
  lastModified: Date,
});

// allow only valid barcode strings to be unique
BarcodeCacheSchema.index(
  { pantryId: 1, barcode: 1 },
  {
    unique: true,
    partialFilterExpression: {
      barcode: { $type: "string" },
    },
  }
);

export const FoodItem =
  mongoose.models.FoodItem || mongoose.model('FoodItem', FoodItemSchema);

export const BarcodeCache =
  mongoose.models.BarcodeCache || mongoose.model('BarcodeCache', BarcodeCacheSchema);
