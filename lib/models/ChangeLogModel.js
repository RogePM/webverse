import mongoose from 'mongoose';

const changeLogSchema = new mongoose.Schema({
  // NEW: Multi-tenant isolation
  pantryId: { 
    type: String, 
    required: true,
    index: true 
  },

  actionType: {
    type: String,
    enum: ['added', 'updated', 'deleted', 'distributed'],
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodItem'
  },
  itemName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  changes: {
    type: mongoose.Schema.Types.Mixed
  },
  previousQuantity: { type: Number },

  // Distribution metadata
  removedQuantity: { type: Number },
  distributionReason: { type: String },
  clientName: { type: String },
  clientId: { type: String },
  unit: { type: String },

  timestamp: {
    type: Date,
    default: Date.now
  }
});

// NEW INDEX: Fast lookup for "Recent Changes" dashboard per pantry
changeLogSchema.index({ pantryId: 1, timestamp: -1 });

export const ChangeLog = mongoose.models.ChangeLog || mongoose.model('ChangeLog', changeLogSchema);