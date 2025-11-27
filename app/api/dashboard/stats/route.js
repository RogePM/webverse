import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import connectDB from '@/lib/db';
import { FoodItem } from '@/lib/models/FoodItemModel';
import { ClientDistribution } from '@/lib/models/ClientDistributionModel';

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

export async function GET(req) {
  try {
    // ✅ AUTH CHECK
    const auth = await authenticateRequest(req);
    if (!auth.authenticated) {
      console.log('❌ GET /api/dashboard - Unauthorized');
      return NextResponse.json({ message: auth.error }, { status: 401 });
    }

    const pantryId = req.headers.get('x-pantry-id');
    
    if (!pantryId) {
      console.log('❌ GET /api/dashboard - No pantry ID');
      return NextResponse.json({ message: 'Pantry ID required' }, { status: 400 });
    }

    console.log('✅ GET /api/dashboard - User:', auth.user.email, 'Pantry:', pantryId);

    await connectDB();

    // 1. Get Stock Count
    const totalItemsCount = await FoodItem.countDocuments({ pantryId });
    console.log('📊 Total items in stock:', totalItemsCount);

    // 2. Get Distribution Stats
    const distributionStats = await ClientDistribution.aggregate([
      { 
        $match: { pantryId: pantryId } 
      },
      {
        $group: {
          _id: null,
          totalVisits: { $sum: 1 },
          totalItemsDistributed: { $sum: "$quantityDistributed" }
        }
      }
    ]);

    const distData = distributionStats[0] || { totalVisits: 0, totalItemsDistributed: 0 };
    console.log('📊 Distribution stats:', distData);

    // 3. Calculate estimates
    const estimatedWeight = distData.totalItemsDistributed; 
    const estimatedValue = distData.totalItemsDistributed * 2.50;

    const response = {
      inventoryCount: totalItemsCount,
      totalPeopleServed: distData.totalVisits,
      totalValue: estimatedValue,
      totalWeight: estimatedWeight
    };

    console.log('✅ GET /api/dashboard - Success:', response);
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ GET /api/dashboard - Error:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}