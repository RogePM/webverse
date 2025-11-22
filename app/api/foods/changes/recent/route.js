import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // 1. Standard Fix for Next.js
    await req.text();

    // 2. Get Pantry ID
    const pantryId = req.headers.get('x-pantry-id');
    if (!pantryId) {
      return NextResponse.json({ message: 'Pantry ID is required' }, { status: 400 });
    }

    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5555';
    
    // 3. Call the Express Backend
    const API_URL = `${BACKEND_URL}/foods/changes/recent`; 

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-pantry-id': pantryId, // Forward the header!
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch changes' }));
      return NextResponse.json(errorData, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Error in recent-changes GET route:', error);
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}