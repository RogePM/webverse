'use client';
import { createBrowserClient } from '@supabase/ssr';

export default function AuthButton() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`, // redirect after login
      },
    });

    if (error) console.error('OAuth error:', error.message);
  };

  return (
    <button
      onClick={handleSignIn}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      Sign in with Google
    </button>
  );
}
