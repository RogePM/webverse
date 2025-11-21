// app/onboarding/page.js (SERVER COMPONENT)
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import OnboardingApp from './OnboardingApp'

export default async function OnboardingPage() {
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

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Not logged in → redirect home
  if (!session) redirect('/')

  const userId = session.user.id

  // Check for existing user profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle()

  if (profile) {
    // Profile exists → go to dashboard
    redirect('/dashboard')
  }

  // No profile → show onboarding wizard
  return <OnboardingApp session={session} />
}
