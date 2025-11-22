import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // 1. Get Pantry ID from the Frontend request
    const pantryId = request.headers.get('x-pantry-id');

    // 2. Validation: If frontend didn't send it, stop here.
    if (!pantryId) {
      return NextResponse.json({ message: 'Pantry ID is required' }, { status: 400 });
    }

    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5555';
    const API_URL = `${BACKEND_URL}/foods/log-distribution`;

    const body = await request.json();

    console.log('Proxying distribution log to backend:', body);

    // 3. Call the Backend
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 4. CRITICAL FIX: Forward the header!
        'x-pantry-id': pantryId, 
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: 'Failed to log distribution' 
      }));
      console.error('Backend error:', errorData);
      return NextResponse.json(errorData, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error('Error in log-distribution POST route:', error);
    return NextResponse.json({ 
      message: 'An unexpected error occurred',
      error: error.message 
    }, { status: 500 });
  }
}