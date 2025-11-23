import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { FoodItem, BarcodeCache } from '@/lib/models/FoodItemModel';

export async function GET(req, { params }) {
  try {
    // 1. Await Params (Next.js 15 requirement)
    const { code } = await params;

    // 2. Get Pantry ID from Header
    const pantryId = req.headers.get('x-pantry-id');
    if (!pantryId) {
      return NextResponse.json({ message: 'Pantry ID is required' }, { status: 400 });
    }

    if (!code) {
      return NextResponse.json({ message: 'Barcode is required' }, { status: 400 });
    }

    // 3. Connect to DB Directly
    await connectDB();

    // 4. Smart Lookup Logic
    // First, check the Barcode Cache (Fastest)
    let cached = await BarcodeCache.findOne({ barcode: code, pantryId });

    // Second, if not in cache, check if we already have this item in our main inventory
    // This fixes the "I added it but scanning doesn't find it" bug
    if (!cached) {
      const existingItem = await FoodItem.findOne({ barcode: code, pantryId });
      if (existingItem) {
        // If found in inventory, return it as if it were cached
        cached = existingItem;
      }
    }

    // 5. Return Result
    if (cached) {
      return NextResponse.json({ found: true, data: cached });
    }

    // Not found (return 200 so frontend handles it gracefully, not as an error)
    return NextResponse.json({ found: false, data: null });

  } catch (error) {
    console.error('Barcode Lookup Error:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}