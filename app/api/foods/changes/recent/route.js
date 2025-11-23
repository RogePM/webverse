import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { ChangeLog } from '@/lib/models/ChangeLogModel';

export async function GET(req) {
  try {
    const pantryId = req.headers.get('x-pantry-id');

    if (!pantryId) {
      return NextResponse.json({ message: 'Pantry ID is required' }, { status: 400 });
    }

    // 1. Connect to DB Directly
    await connectDB();

    // 2. Query DB Directly
    // Sort by timestamp descending (newest first) and limit to 50
    const changes = await ChangeLog.find({ pantryId })
      .sort({ timestamp: -1 })
      .limit(50);

    return NextResponse.json(changes);

  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}