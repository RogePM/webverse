export async function GET() {
  try {
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5555';

    // Backend endpoint (you MUST have this in Express)
    const API_URL = `${BACKEND_URL}/foods/changes/recent`;

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch recent change logs' }));
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
    console.error('Error in recent change logs GET route:', error);
    return new Response(
      JSON.stringify({ message: 'An unexpected error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
