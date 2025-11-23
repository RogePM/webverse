import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { ClientDistribution } from '@/lib/models/ClientDistributionModel';
import { ChangeLog } from '@/lib/models/ChangeLogModel';

export async function POST(req) {
  try {
    const data = await req.json();
    const pantryId = req.headers.get('x-pantry-id');

    if (!pantryId) {
      return NextResponse.json({ message: 'Pantry ID is required' }, { status: 400 });
    }

    await connectDB();

    // 1. Create Distribution Record
    const distribution = await ClientDistribution.create({
      ...data,
      pantryId,
      distributionDate: new Date(),
    });

    // 2. Log to ChangeLog (History)
    await ChangeLog.create({
      pantryId,
      actionType: 'distributed',
      itemId: data.itemId,
      itemName: data.itemName,
      category: data.category,
      distributionReason: data.reason,
      clientName: data.clientName,
      clientId: data.clientId,
      removedQuantity: data.removedQuantity, // ensure frontend sends this key or map it
      unit: data.unit,
      timestamp: new Date()
    });

    return NextResponse.json({ message: 'Logged', distribution }, { status: 201 });

  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}