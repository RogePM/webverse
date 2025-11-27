import mongoose from 'mongoose';

const FoodItemSchema = new mongoose.Schema({
  pantryId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { 
    type: String, 
    required: true, 
    enum: ['units', 'lbs', 'kg', 'oz'], 
    default: "units" 
  },
  barcode: { type: String, default: null },
  storageLocation: { type: String, default: "N/A" },
  expirationDate: { type: Date }, 
  lastModified: { type: Date, default: Date.now },
});

// --- ✅ THE FIX: ALLOW MULTIPLE BATCHES ---
// We removed "unique: true". Now you can have 5 rows with the same barcode
// as long as they represent different batches (handled by your API logic).
FoodItemSchema.index(
  { pantryId: 1, barcode: 1 },
  { 
    // unique: true  <-- DELETED THIS LINE
    partialFilterExpression: { barcode: { $type: "string" } } 
  }
);

// --- OPTIONAL: SPEED BOOST ---
// Add this index so finding items by expiration date is instant
FoodItemSchema.index({ pantryId: 1, barcode: 1, expirationDate: 1 });

// --- Barcode Cache Schema (Keep this UNIQUE) ---
const BarcodeCacheSchema = new mongoose.Schema({
  pantryId: { type: String, required: true, index: true },
  barcode: { type: String, required: true },
  name: String,
  brand: String,
  category: String,
  storageLocation: String,
  lastModified: Date,
});

// This stays unique because it's just the "Reference Card" for the barcode
BarcodeCacheSchema.index(
  { pantryId: 1, barcode: 1 },
  {
    unique: true, 
    partialFilterExpression: { barcode: { $type: "string" } },
  }
);

export const FoodItem = mongoose.models.FoodItem || mongoose.model('FoodItem', FoodItemSchema);

export const BarcodeCache = mongoose.models.BarcodeCache || mongoose.model('BarcodeCache', BarcodeCacheSchema);