import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { FoodItem } from '@/lib/models/FoodItemModel';
import { ChangeLog } from '@/lib/models/ChangeLogModel';
import { ClientDistribution } from '@/lib/models/ClientDistributionModel';

// --- FIXED Helper: Log Changes with Metrics ---
const logChange = async (actionType, item, changes = null, metadata = {}, pantryId) => {
  try {
    // 1. DETERMINE QUANTITY CHANGED
    let qty = 0;
    
    if (actionType === 'added') {
        qty = item.quantity;
    } else if (actionType === 'distributed') {
        qty = metadata.removedQuantity || 0;
    } else if (actionType === 'deleted') {
        // If deleting, the change is the entire remaining quantity
        qty = item.quantity; 
    }

    // 2. CALCULATE IMPACT METRICS
    let weight = 0;
    const unit = (metadata.unit || item.unit || 'units').toLowerCase();
    
    if (unit === 'lbs') weight = qty;
    else if (unit === 'kg') weight = qty * 2.20462;
    else if (unit === 'oz') weight = qty / 16;
    else weight = qty * 1; 

    const value = weight * 2.50; 
    const familySize = metadata.familySize || 1; 

    // 3. CREATE LOG
    await ChangeLog.create({
      pantryId,
      actionType,
      itemId: item._id,
      itemName: item.name,
      category: item.category,
      
      // Logic for previous quantity
      // If deleted, previous was item.quantity. If updated, we assume item.quantity is current.
      previousQuantity: actionType === 'added' ? 0 : item.quantity, 
      quantityChanged: qty,
      newQuantity: actionType === 'deleted' ? 0 : item.quantity,
      unit: item.unit, 

      // Metadata
      changes,
      distributionReason: metadata.reason,
      clientName: metadata.clientName,
      clientId: metadata.clientId,
      removedQuantity: qty, 

      // Impact Data
      impactMetrics: {
        peopleServed: actionType === 'distributed' ? familySize : 0,
        estimatedValue: parseFloat(value.toFixed(2)),
        standardizedWeight: parseFloat(weight.toFixed(2)),
        wasteDiverted: false // Deletion usually counts as waste/adjustment
      },
      tags: metadata.reason === 'emergency' ? ['Urgent'] : [],
      
      timestamp: new Date()
    });
  } catch (e) {
    console.error("Failed to log change:", e);
  }
};

// --- GET Single Item ---
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const pantryId = req.headers.get('x-pantry-id');

    if (!pantryId) return NextResponse.json({ message: 'Pantry ID required' }, { status: 400 });

    await connectDB();

    const food = await FoodItem.findOne({ _id: id, pantryId });
    
    if (!food) return NextResponse.json({ message: 'Item not found' }, { status: 404 });

    return NextResponse.json(food);

  } catch (error) {
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// --- PUT: Update Item ---
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const pantryId = req.headers.get('x-pantry-id');

    if (!pantryId) return NextResponse.json({ message: 'Pantry ID required' }, { status: 400 });

    await connectDB();

    // 1. Find old item to compare changes
    const oldItem = await FoodItem.findOne({ _id: id, pantryId });
    if (!oldItem) return NextResponse.json({ message: 'Item not found' }, { status: 404 });

    // 2. Update
    const updateData = { ...data, lastModified: new Date() };
    const result = await FoodItem.findOneAndUpdate(
      { _id: id, pantryId },
      updateData,
      { new: true }
    );

    // 3. Log Changes
    const changes = {};
    for (const key of Object.keys(updateData)) {
        if (key !== 'lastModified' && key !== '_id' && oldItem[key] != updateData[key]) {
            changes[key] = { old: oldItem[key], new: updateData[key] };
        }
    }

    if (Object.keys(changes).length > 0) {
        await logChange('updated', result, changes, {}, pantryId);
    }

    return NextResponse.json({ message: 'Item updated', data: result });

  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// --- DELETE: Remove Item ---
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const pantryId = req.headers.get('x-pantry-id');
    
    if (!pantryId) return NextResponse.json({ message: 'Pantry ID required' }, { status: 400 });

    // Parse query params
    const { searchParams } = new URL(req.url);
    const reason = searchParams.get('reason');
    const clientName = searchParams.get('clientName');
    const clientId = searchParams.get('clientId');
    const removedQuantity = searchParams.get('removedQuantity');
    const unit = searchParams.get('unit');

    await connectDB();

    // 1. Find and Delete
    const result = await FoodItem.findOneAndDelete({ _id: id, pantryId });

    if (!result) return NextResponse.json({ message: 'Item not found' }, { status: 404 });

    // 2. Log Distribution (if client name was provided)
    if (clientName && clientName.trim()) {
        await ClientDistribution.create({
            pantryId,
            clientName: clientName.trim(),
            clientId: clientId?.trim(),
            itemName: result.name,
            itemId: result._id,
            category: result.category,
            quantityDistributed: parseInt(removedQuantity) || result.quantity,
            unit: unit || result.unit || 'units',
            reason: reason || 'deleted',
            distributionDate: new Date()
        });
    }

    // 3. Log Deletion to History
    await logChange('deleted', result, null, { 
        reason, 
        clientName, 
        clientId, 
        // If specific qty wasn't passed, assume the whole item quantity was removed
        removedQuantity: parseInt(removedQuantity) || result.quantity, 
        unit: unit || result.unit 
    }, pantryId);

    return NextResponse.json({ message: 'Item deleted' });

  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}