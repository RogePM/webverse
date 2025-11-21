import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )

    // 1️⃣ Create session from Google OAuth code
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error('Exchange error:', error.message)
      return NextResponse.redirect(new URL('/?error=auth_failed', requestUrl.origin))
    }

    console.log('✅ Session created successfully!')

    // 2️⃣ Get the logged-in user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.error("❌ No user returned after OAuth!")
      return NextResponse.redirect(new URL('/?error=no_user', requestUrl.origin))
    }

    // 3️⃣ Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('user_id')
      .eq('user_id', user.id)
      .single()

    // 4️⃣ Redirect based on profile
    if (!profile) {
      console.log("🟡 No profile found → redirecting to onboarding")
      return NextResponse.redirect(new URL('/onboarding', requestUrl.origin))
    }

    console.log("🟢 Existing profile → redirect to dashboard")
    return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
  }

  // no code in URL — back to landing page
  return NextResponse.redirect(new URL('/', requestUrl.origin))
}
