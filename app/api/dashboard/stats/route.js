import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { FoodItem } from '@/lib/models/FoodItemModel';
import { ChangeLog } from '@/lib/models/ChangeLogModel';

// ⚠️ NOTE: There is NO 'export default' in this file. 
// Only named exports like 'GET' are allowed in route.js files.

export async function GET(req) {
  try {
    const pantryId = req.headers.get('x-pantry-id');
    
    if (!pantryId) {
      return NextResponse.json({ message: 'Pantry ID required' }, { status: 400 });
    }

    await connectDB();

    // 1. Get Total Inventory Count
    // This counts how many unique items are currently in the database
    const totalItemsCount = await FoodItem.countDocuments({ pantryId });

    // 2. Aggregate Impact Metrics from ChangeLog
    // We calculate the total sum of value, weight, and people served based on 'distributed' logs
    const impactStats = await ChangeLog.aggregate([
      { 
        $match: { 
          pantryId: pantryId, 
          actionType: 'distributed' 
        } 
      },
      {
        $group: {
          _id: null,
          totalPeopleServed: { $sum: "$impactMetrics.peopleServed" },
          totalValue: { $sum: "$impactMetrics.estimatedValue" },
          totalWeight: { $sum: "$impactMetrics.standardizedWeight" },
          totalDistributions: { $sum: 1 }
        }
      }
    ]);

    // If no distributions yet, return 0s
    const stats = impactStats[0] || { 
        totalPeopleServed: 0, 
        totalValue: 0, 
        totalWeight: 0,
        totalDistributions: 0 
    };

    // Return the combined data
    return NextResponse.json({
      inventoryCount: totalItemsCount,
      ...stats
    });

  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}