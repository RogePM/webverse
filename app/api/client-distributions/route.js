import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { ClientDistribution } from '@/lib/models/ClientDistributionModel';
import { ChangeLog } from '@/lib/models/ChangeLogModel';

// --- Helper: Log Changes ---
const logChange = async (actionType, item, changes = null, metadata = {}, pantryId) => {
  try {
    await ChangeLog.create({
      pantryId,
      actionType,
      itemId: item._id,
      itemName: item.name,
      category: item.category,
      changes,
      // Metadata
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

// --- GET: List All Distributions ---
export async function GET(req) {
  try {
    const pantryId = req.headers.get('x-pantry-id');
    if (!pantryId) return NextResponse.json({ message: 'Pantry ID required' }, { status: 400 });

    await connectDB();

    const distributions = await ClientDistribution.find({ pantryId })
      .sort({ distributionDate: -1 })
      .limit(100);

    return NextResponse.json({ count: distributions.length, data: distributions });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// --- POST: Create New Distribution ---
export async function POST(req) {
  try {
    const data = await req.json();
    const pantryId = req.headers.get('x-pantry-id');
    if (!pantryId) return NextResponse.json({ message: 'Pantry ID required' }, { status: 400 });

    await connectDB();

    // 1. Create Record
    const distribution = await ClientDistribution.create({
      ...data,
      pantryId,
      distributionDate: new Date(),
    });

    // 2. Log to History
    // Note: We construct the log data carefully to match the schema
    await logChange('distributed', {
        _id: data.itemId,
        name: data.itemName,
        category: data.category
    }, null, {
        reason: data.reason,
        clientName: data.clientName,
        clientId: data.clientId,
        removedQuantity: data.quantityDistributed, // Map this field correctly
        unit: data.unit
    }, pantryId);

    return NextResponse.json(distribution, { status: 201 });

  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// --- PUT: Update Distribution ---
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const data = await req.json();
    const pantryId = req.headers.get('x-pantry-id');

    if (!id) return NextResponse.json({ message: 'ID required' }, { status: 400 });
    if (!pantryId) return NextResponse.json({ message: 'Pantry ID required' }, { status: 400 });

    await connectDB();

    const result = await ClientDistribution.findOneAndUpdate(
      { _id: id, pantryId },
      data,
      { new: true }
    );

    if (!result) return NextResponse.json({ message: 'Record not found' }, { status: 404 });

    return NextResponse.json({ message: 'Updated', data: result });

  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// --- DELETE: Remove Distribution ---
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const pantryId = req.headers.get('x-pantry-id');

    if (!id) return NextResponse.json({ message: 'ID required' }, { status: 400 });
    if (!pantryId) return NextResponse.json({ message: 'Pantry ID required' }, { status: 400 });

    await connectDB();

    const result = await ClientDistribution.findOneAndDelete({ _id: id, pantryId });

    if (!result) return NextResponse.json({ message: 'Record not found' }, { status: 404 });

    return NextResponse.json({ message: 'Deleted' });

  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}