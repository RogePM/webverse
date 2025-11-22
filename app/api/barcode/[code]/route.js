export async function GET(req, { params }) {
  try {
    const { code } = params;

    if (!code) {
      return new Response(
        JSON.stringify({ message: 'Barcode code is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Backend API URL
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5555';
    const API_URL = `${BACKEND_URL}/foods/barcode/${code}`;

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to lookup barcode' }));
      return new Response(
        JSON.stringify(errorData),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await response.json();
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in barcode API route:', error);
    return new Response(
      JSON.stringify({ message: 'An unexpected error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}




