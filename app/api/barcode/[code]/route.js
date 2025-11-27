import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import connectDB from '@/lib/db';
import { FoodItem, BarcodeCache } from '@/lib/models/FoodItemModel';

// --- AUTHENTICATION HELPER ---
async function authenticateRequest(req) {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return { authenticated: false, user: null, error: 'Unauthorized' };
  }

  return { authenticated: true, user, error: null };
}

export async function GET(req, { params }) {
  try {
    // ✅ AUTH CHECK
    const auth = await authenticateRequest(req);
    if (!auth.authenticated) {
      console.log('❌ GET /api/barcode - Unauthorized');
      return NextResponse.json({ message: auth.error }, { status: 401 });
    }

    // 1. Await Params
    const { code } = await params;

    // 2. Get Pantry ID from Header
    const pantryId = req.headers.get('x-pantry-id');
    if (!pantryId) {
      console.log('❌ GET /api/barcode - No pantry ID');
      return NextResponse.json({ message: 'Pantry ID is required' }, { status: 400 });
    }

    if (!code) {
      console.log('❌ GET /api/barcode - No barcode provided');
      return NextResponse.json({ message: 'Barcode is required' }, { status: 400 });
    }

    console.log('✅ GET /api/barcode - User:', auth.user.email, 'Looking up:', code);

    // 3. Connect to DB
    await connectDB();

    // 4. Smart Lookup Logic
    // First, check the Barcode Cache
    let cached = await BarcodeCache.findOne({ barcode: code, pantryId });

    // Second, if not in cache, check main inventory
    if (!cached) {
      console.log('🔍 Not in cache, checking inventory...');
      const existingItem = await FoodItem.findOne({ barcode: code, pantryId });
      if (existingItem) {
        console.log('✅ Found in inventory:', existingItem.name);
        cached = existingItem;
      }
    } else {
      console.log('✅ Found in cache:', cached.name);
    }

    // 5. Return Result
    if (cached) {
      return NextResponse.json({ found: true, data: cached });
    }

    console.log('ℹ️ Barcode not found');
    return NextResponse.json({ found: false, data: null });

  } catch (error) {
    console.error('❌ GET /api/barcode - Error:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}