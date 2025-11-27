import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { ChangeLog } from '@/lib/models/ChangeLogModel';

export async function GET(req) {
  try {
    const pantryId = req.headers.get('x-pantry-id');

    if (!pantryId) {
      return NextResponse.json({ message: 'Pantry ID is required' }, { status: 400 });
    }

    await connectDB();

    const changes = await ChangeLog.find({ pantryId })
      .sort({ timestamp: -1 })
      .limit(50)
      .lean(); // <--- ADD THIS (Faster for read-only data)

    return NextResponse.json(changes);

  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}