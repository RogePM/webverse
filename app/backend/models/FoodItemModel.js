import mongoose from 'mongoose';

// Core food item schema. Example document:
// {
//   _id: ObjectId,
//   barcode: '012345678905',
//   name: 'Apples',
//   category: 'Produce',
//   quantity: 20,
//   expirationDate: ISODate(...),
//   storageLocation: 'Freezer',
//   lastModified: ISODate(...),
//   // Optional when enabled: addedBy: ObjectId('User'), pantryId: ObjectId('FoodPantry')
// }
const FoodItemSchema = new mongoose.Schema({
    barcode: { type: String, unique: true, sparse: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    expirationDate: { type: Date },
    storageLocation: String,
    lastModified: { type: Date, default: Date.now }
    // Optional: store the user who added the item (uncomment when User model exists)
    // addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // Optional: food pantry ID — uncomment when a FoodPantry collection is created
    // pantryId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodPantry' },
});

export const FoodItem = mongoose.model('FoodItem', FoodItemSchema);

const BarcodeCacheSchema = new mongoose.Schema({
  barcode: { type: String, required: true, unique: true },
  name: String,
  category: String,
  storageLocation: String,
});

export const BarcodeCache = mongoose.model('BarcodeCache', BarcodeCacheSchema);
