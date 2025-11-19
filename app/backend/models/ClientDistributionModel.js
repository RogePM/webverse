import mongoose from 'mongoose';

// Schema for tracking food distributions to clients
// Example document:
// {
//   _id: ObjectId,
//   clientName: 'Maria Lopez',
//   clientId: 'CLT-001',
//   itemName: 'Apples',
//   itemId: ObjectId('...'),
//   category: 'Produce',
//   quantityDistributed: 5,
//   reason: 'distribution-individual',
//   distributionDate: ISODate(...),
//   // Optional: userId, pantryId
// }
const ClientDistributionSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    clientId: { type: String },
    itemName: { type: String, required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' },
    category: { type: String, required: true },
    quantityDistributed: { type: Number, required: true },
    unit: { type: String, default: 'units' }, // 'units' or 'pounds'
    reason: { type: String, required: true },
    distributionDate: { type: Date, default: Date.now },
    // Optional: track which user performed the distribution
    // distributedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // Optional: food pantry ID
    // pantryId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodPantry' },
});

// Index for faster queries
ClientDistributionSchema.index({ clientName: 1, distributionDate: -1 });
ClientDistributionSchema.index({ clientId: 1, distributionDate: -1 });
ClientDistributionSchema.index({ distributionDate: -1 });

export const ClientDistribution = mongoose.model('ClientDistribution', ClientDistributionSchema);