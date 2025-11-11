import mongoose from 'mongoose';

const FoodItemSchema = new mongoose.Schema({
    barcode: { type: String, unique: true, sparse: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    expirationDate: { type: Date },
    storageLocation: String,
    lastModified: { type: Date, default: Date.now }
});

export const FoodItem = mongoose.model('FoodItem', FoodItemSchema);

const BarcodeCacheSchema = new mongoose.Schema({
  barcode: { type: String, required: true, unique: true },
  name: String,
  category: String,
  storageLocation: String,
});

export const BarcodeCache = mongoose.model('BarcodeCache', BarcodeCacheSchema);
