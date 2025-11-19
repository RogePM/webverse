import mongoose from 'mongoose';

// Schema for recording changes to food items. Example documents:
// {
//   _id: ObjectId,
//   actionType: 'updated',
//   itemId: ObjectId,
//   itemName: 'Apple',
//   category: 'Produce',
//   changes: { quantity: { old: 5, new: 10 } },
//   timestamp: ISODate(...),
//   previousQuantity: 5,
//   // Optional: userId: ObjectId, // 'User' collection
//   // Optional: pantryId: ObjectId, // 'FoodPantry' collection
// }
const changeLogSchema = new mongoose.Schema({
  actionType: {
    type: String,
    enum: ['added', 'updated', 'deleted'],
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodItem'
  },
  // Optional: store the user that performed the action.
  // Uncomment when you have a user collection set up and want to track which
  // user performed the action. Make sure to update routes to pass user ID.
  // userId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User'
  // },
  // Optionally track which food pantry the action belongs to. Uncomment
  // when you have a FoodPantry (or similar) collection available.
  // pantryId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'FoodPantry'
  // },
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


  // NEW: Distribution metadata
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

export const ChangeLog = mongoose.model('ChangeLog', changeLogSchema);
