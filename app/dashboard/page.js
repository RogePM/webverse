import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import DashboardClientApp from './client-page'; 

export default async function DashboardPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component cannot set cookies, ignore
          }
        },
      },
    }
  );

  // ✅ FIX: Use getUser() instead of getSession()
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  // 1. Security: Redirect if not logged in or auth error
  if (error || !user) {
    console.log('❌ Server-side: No valid user, redirecting to login');
    redirect('/');
  }

  console.log('✅ Server-side: User is authenticated:', user.email);

  // 2. Optionally fetch user's pantry data here on the server
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('current_pantry_id, name')
    .eq('user_id', user.id)
    .single();

  // 3. Pass user data to client (not the full session for security)
  return (
    <DashboardClientApp 
      initialUser={{
        id: user.id,
        email: user.email,
        name: profile?.name || user.user_metadata?.full_name
      }}
      initialPantryId={profile?.current_pantry_id}
    />
  );
}