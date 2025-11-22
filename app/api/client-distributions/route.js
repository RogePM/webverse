import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // 1. FIX: Keep this to satisfy Next.js stream requirements
    await req.text();

    // 2. Get Pantry ID from the frontend request
    const pantryId = req.headers.get('x-pantry-id');
    if (!pantryId) {
      return NextResponse.json({ message: 'Pantry ID is required' }, { status: 400 });
    }

    // 3. Your Backend Logic
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5555';
    const API_URL = `${BACKEND_URL}/foods/distributions`;

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-pantry-id': pantryId, // <--- CRITICAL: Forward the header
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch client distributions' }));
      return NextResponse.json(errorData, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Error in client-distributions GET route:', error);
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();

    const pantryId = req.headers.get('x-pantry-id');
    if (!pantryId) {
      return NextResponse.json({ message: 'Pantry ID is required' }, { status: 400 });
    }

    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5555';
    const API_URL = `${BACKEND_URL}/foods/log-distribution`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-pantry-id': pantryId, // <--- Forward header
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to create client distribution' }));
      return NextResponse.json(errorData, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error('Error in client-distributions POST route:', error);
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const data = await req.json();
    
    const pantryId = req.headers.get('x-pantry-id');
    if (!pantryId) {
      return NextResponse.json({ message: 'Pantry ID is required' }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Distribution ID is required' }, { status: 400 });
    }

    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5555';
    const API_URL = `${BACKEND_URL}/foods/distribution/${id}`;

    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-pantry-id': pantryId, // <--- Forward header
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update client distribution' }));
      return NextResponse.json(errorData, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Error in client-distributions PUT route:', error);
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    // Await text if needed for timing, just like GET
    await req.text(); 

    const pantryId = req.headers.get('x-pantry-id');
    if (!pantryId) {
      return NextResponse.json({ message: 'Pantry ID is required' }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Distribution ID is required' }, { status: 400 });
    }

    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5555';
    const API_URL = `${BACKEND_URL}/foods/distribution/${id}`;

    const response = await fetch(API_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-pantry-id': pantryId, // <--- Forward header
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to delete client distribution' }));
      return NextResponse.json(errorData, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Error in client-distributions DELETE route:', error);
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}