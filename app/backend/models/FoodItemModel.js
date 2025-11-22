import mongoose from 'mongoose';

// =========================================================
// 1. MAIN FOOD ITEM SCHEMA
// =========================================================
const FoodItemSchema = new mongoose.Schema({
    // Removed 'unique: true' here so different pantries can use the same barcode
    barcode: { type: String, sparse: true },
    
    name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    expirationDate: { type: Date },
    storageLocation: String,
    lastModified: { type: Date, default: Date.now },

    // NEW: The Multi-Tenant Field
    // We use String because Supabase IDs are UUIDs
    pantryId: { 
        type: String, 
        required: true, 
        index: true 
    },
});

// COMPOUND INDEX (The "Magic" Part)
// This ensures a barcode is unique ONLY within the same pantry.
// { sparse: true } means items without barcodes are ignored by this rule.
FoodItemSchema.index({ pantryId: 1, barcode: 1 }, { unique: true, sparse: true });

export const FoodItem = mongoose.model('FoodItem', FoodItemSchema);


// =========================================================
// 2. BARCODE CACHE SCHEMA (Now Isolated per Pantry)
// =========================================================
const BarcodeCacheSchema = new mongoose.Schema({
    // Removed 'unique: true' here
    barcode: { type: String, required: true },
    
    name: String,
    category: String,
    storageLocation: String,

    // NEW: Isolate cache per pantry
    pantryId: { 
        type: String, 
        required: true 
    },
});

// COMPOUND INDEX
// Ensures Pantry A's cache for "123" doesn't conflict with Pantry B's cache for "123"
BarcodeCacheSchema.index({ pantryId: 1, barcode: 1 }, { unique: true });

export const BarcodeCache = mongoose.model('BarcodeCache', BarcodeCacheSchema);