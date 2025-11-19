export async function POST(request) {
  try {
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5555';
    const API_URL = `${BACKEND_URL}/foods/log-distribution`;

    // Get the request body
    const body = await request.json();

    console.log('Proxying distribution log to backend:', body);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: 'Failed to log distribution' 
      }));
      console.error('Backend error:', errorData);
      return new Response(
        JSON.stringify(errorData),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await response.json();
    console.log('Distribution logged successfully:', result);
    
    return new Response(
      JSON.stringify(result),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in log-distribution POST route:', error);
    return new Response(
      JSON.stringify({ 
        message: 'An unexpected error occurred',
        error: error.message 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}