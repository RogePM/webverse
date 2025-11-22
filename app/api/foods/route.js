import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // 1. Get Pantry ID from header
    const pantryId = req.headers.get('x-pantry-id');
    
    if (!pantryId) {
      return NextResponse.json({ message: 'Pantry ID is required' }, { status: 400 });
    }

    // 2. Backend Config
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5555';
    const API_URL = `${BACKEND_URL}/foods`;

    // 3. Forward Request to Express
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-pantry-id': pantryId, // Forward the ID
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch items' }));
      return NextResponse.json(errorData, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Error in foods GET route:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    // 1. Parse Body (Only for POST)
    const data = await req.json();

    // 2. Get Pantry ID
    const pantryId = req.headers.get('x-pantry-id');
    if (!pantryId) {
      return NextResponse.json({ message: 'Pantry ID is required' }, { status: 400 });
    }

    // 3. Validate Fields
    if (!data.name || !data.category || !data.quantity) {
      return NextResponse.json({ message: 'Please provide Name, Category, and Quantity' }, { status: 400 });
    }

    // 4. Backend Config
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5555';
    const API_URL = `${BACKEND_URL}/foods`;

    // 5. Forward Request
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-pantry-id': pantryId,
      },
      body: JSON.stringify({
        ...data,
        storageLocation: data.storageLocation || 'N/A',
        barcode: data.barcode || undefined,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to add item' }));
      return NextResponse.json(errorData, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error('Error in foods POST route:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}