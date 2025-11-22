import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // FIX: Await request text to satisfy Next.js requirements
    await req.text();

    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5555';
    
    // CORRECTED URL: Added '/foods' prefix
    const API_URL = `${BACKEND_URL}/foods/distributions`;

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store' // Ensure we don't cache old data
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

    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5555';
    
    // CORRECTED URL: Added '/foods' prefix and pointing to 'log-distribution'
    const API_URL = `${BACKEND_URL}/foods/log-distribution`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
    
    // Extract ID from query string (e.g., ?id=123)
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Distribution ID is required' }, { status: 400 });
    }

    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5555';
    
    // Pointing to the new backend route: /foods/distribution/:id
    const API_URL = `${BACKEND_URL}/foods/distribution/${id}`;

    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
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
    // Extract ID from query string
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Distribution ID is required' }, { status: 400 });
    }

    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5555';
    
    // Pointing to the new backend route: /foods/distribution/:id
    const API_URL = `${BACKEND_URL}/foods/distribution/${id}`;

    const response = await fetch(API_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
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