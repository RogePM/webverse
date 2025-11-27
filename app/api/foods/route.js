import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { FoodItem, BarcodeCache } from '@/lib/models/FoodItemModel';
import { ChangeLog } from '@/lib/models/ChangeLogModel';

// --- FIXED Helper Function: Log Changes Correctly ---
const logChange = async (actionType, item, changes = null, metadata = {}, pantryId) => {
  try {
    // 1. DETERMINE QUANTITY CHANGED
    let qty = 0;
    
    if (actionType === 'added') {
        // FIX: If adding, the "change" is the total quantity of the new item
        qty = item.quantity;
    } else if (actionType === 'distributed') {
        // If distributing, use the specific amount removed
        qty = metadata.removedQuantity || 0;
    }
    // For 'updated', qty usually stays 0 unless specific quantity logic is added

    // 2. CALCULATE IMPACT METRICS (Future-proofing)
    let weight = 0;
    const unit = (metadata.unit || item.unit || 'units').toLowerCase();
    
    // Approximate weight conversions for stats
    if (unit === 'lbs') weight = qty;
    else if (unit === 'kg') weight = qty * 2.20462;
    else if (unit === 'oz') weight = qty / 16;
    else weight = qty * 1; // Default estimate

    // Estimate Value ($2.50 per lb avg)
    const value = weight * 2.50; 
    const familySize = metadata.familySize || 1; 

    // 3. CREATE LOG
    await ChangeLog.create({
      pantryId,
      actionType,
      itemId: item._id,
      itemName: item.name,
      category: item.category,
      
      // Logic to determine previous quantity based on action
      previousQuantity: actionType === 'added' ? 0 : (item.quantity + (actionType === 'distributed' ? qty : 0)),
      quantityChanged: qty,
      newQuantity: item.quantity,
      unit: item.unit, 

      // Distribution Specifics
      changes,
      distributionReason: metadata.reason,
      clientName: metadata.clientName,
      clientId: metadata.clientId,
      removedQuantity: qty, // Keep legacy field populated for safety

      // New Impact Data
      impactMetrics: {
        peopleServed: actionType === 'distributed' ? familySize : 0,
        estimatedValue: parseFloat(value.toFixed(2)),
        standardizedWeight: parseFloat(weight.toFixed(2)),
        wasteDiverted: actionType === 'added' // Assume added food is "saved"
      },
      tags: metadata.reason === 'emergency' ? ['Urgent'] : [],
      
      timestamp: new Date()
    });
  } catch (e) {
    console.error("Failed to log change:", e);
  }
};

// --- GET: Fetch Inventory ---
export async function GET(req) {
  try {
    const pantryId = req.headers.get('x-pantry-id');
    
    if (!pantryId) {
      return NextResponse.json({ message: 'Pantry ID is required' }, { status: 400 });
    }

    // 1. Connect to DB Directly
    await connectDB();

    // 2. Query DB (No fetch to localhost:5555!)
    const foods = await FoodItem.find({ pantryId });

    return NextResponse.json({ count: foods.length, data: foods });

  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}


// --- POST: Add Item ---
export async function POST(req) {
  try {
    const data = await req.json();
    const pantryId = req.headers.get('x-pantry-id');

    if (!pantryId) {
      return NextResponse.json({ message: 'Pantry ID is required' }, { status: 400 });
    }

    if (!data.name || !data.category || !data.quantity) {
      return NextResponse.json({ message: 'Please provide Name, Category, and Quantity' }, { status: 400 });
    }
    const validUnits = ['units', 'lbs', 'kg', 'oz'];
    const unit = validUnits.includes(data.unit) ? data.unit : 'units';
    await connectDB();

    const newItemData = {
      ...data,
      pantryId,
      unit: unit, // Ensure unit is saved
      // If frontend didn't send a barcode, generate a fallback (failsafe)
      barcode: data.barcode?.trim() || `SYS-${Date.now().toString().slice(-8)}`,
      lastModified: new Date(),
    };

    // 1. Create Item Directly
    const foodItem = await FoodItem.create(newItemData);

    // 2. Cache Barcode (if exists)
    if (newItemData.barcode) {
      await BarcodeCache.findOneAndUpdate(
        { barcode: newItemData.barcode, pantryId },
        { ...newItemData, pantryId },
        { upsert: true, new: true }
      );
    }

    // 3. Log Change
    // We pass empty metadata because the helper now knows to grab item.quantity for 'added' events
    await logChange('added', foodItem, null, {}, pantryId);

    return NextResponse.json(foodItem, { status: 201 });

  } catch (error) {
    console.error('Database Error:', error);
    if (error.code === 11000) {
        return NextResponse.json({ message: 'Barcode already exists in this pantry' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}