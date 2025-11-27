import mongoose from 'mongoose';

const changeLogSchema = new mongoose.Schema({
  // Multi-tenant isolation
  pantryId: { 
    type: String, 
    required: true,
    index: true 
  },

  // What happened?
  actionType: {
    type: String,
    enum: ['added', 'updated', 'deleted', 'distributed'],
    required: true
  },

  // Item Details
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

  // For "Updated" actions (stores old vs new values)
  changes: {
    type: mongoose.Schema.Types.Mixed
  },

  // Quantity Tracking
  previousQuantity: { type: Number },
  quantityChanged: { type: Number }, // The delta (e.g. 5, 10, etc.)
  newQuantity: { type: Number },
  
  // Important: Capture the unit at the time of the event
  unit: { 
    type: String, 
    default: 'units' 
  },

  // Distribution Specific Metadata
  distributionReason: { type: String },
  clientName: { type: String },
  clientId: { type: String },
  removedQuantity: { type: Number }, // (Legacy field, kept for safety, similar to quantityChanged)

  // --- 🔥 NEW: IMPACT METRICS (Future-Proofing) ---
  impactMetrics: {
    // How many people does this help? (e.g. Family of 4)
    peopleServed: { type: Number, default: 0 }, 
    
    // Monetary value (Good for reporting grants)
    estimatedValue: { type: Number, default: 0 }, 
    
    // Weight in standardized lbs (for accurate "Tons Distributed" charts)
    standardizedWeight: { type: Number, default: 0 },
    
    // Was this food saved from being wasted?
    wasteDiverted: { type: Boolean, default: false }
  },

  // --- UI TAGS ---
  // e.g. ["Urgent", "Grant-Funded"]
  tags: [{ type: String }],

  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index: Fast lookup for your "Recent Changes" dashboard
changeLogSchema.index({ pantryId: 1, timestamp: -1 });

export const ChangeLog = mongoose.models.ChangeLog || mongoose.model('ChangeLog', changeLogSchema);