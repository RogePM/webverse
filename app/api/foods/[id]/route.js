export async function GET(req, { params }) {
    try {
      // FIX: Await the request to resolve Next.js timing issues
      await req.text(); 
      
      const { id } = params;
      const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5555';
      const API_URL = `${BACKEND_URL}/foods/${id}`;
  
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch item' }));
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
      console.error('Error in foods GET route:', error);
      return new Response(
        JSON.stringify({ message: 'An unexpected error occurred' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
  
  export async function PUT(req, { params }) {
    try {
      // FIX: Await the request body *before* accessing params
      const data = await req.json();
      const { id } = params;
  
      const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5555';
      const API_URL = `${BACKEND_URL}/foods/${id}`;
  
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to update item' }));
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
      console.error('Error in foods PUT route:', error);
      return new Response(
        JSON.stringify({ message: 'An unexpected error occurred' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
  
  export async function DELETE(req, { params }) {
    try {
      // FIX: Await the request (even if empty) to resolve Next.js timing issues
      await req.text(); 
      
      const { id } = params;
  
      const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5555';
      const API_URL = `${BACKEND_URL}/foods/${id}`;
  
      const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to delete item' }));
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
      console.error('Error in foods DELETE route:', error);
      return new Response(
        JSON.stringify({ message: 'An unexpected error occurred' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

