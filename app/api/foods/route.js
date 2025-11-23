import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { FoodItem, BarcodeCache } from '@/lib/models/FoodItemModel';
import { ChangeLog } from '@/lib/models/ChangeLogModel';

// --- Helper Function: Log Changes Directly ---
const logChange = async (actionType, item, changes = null, metadata = {}, pantryId) => {
  try {
    await ChangeLog.create({
      pantryId,
      actionType,
      itemId: item._id,
      itemName: item.name,
      category: item.category,
      changes,
      distributionReason: metadata.reason,
      clientName: metadata.clientName,
      clientId: metadata.clientId,
      removedQuantity: metadata.removedQuantity,
      unit: metadata.unit,
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

    await connectDB();

    const newItemData = {
      ...data,
      pantryId, // Auto-assign ID
      storageLocation: data.storageLocation || 'N/A',
      barcode: data.barcode?.trim() || undefined,
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