// app/dashboard/page.js (SERVER COMPONENT)
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import App from './page'

export default async function DashboardPage() {
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

  console.log('Server-side session:', session ? `✅ EXISTS (${session.user.email})` : '❌ NULL')

  return <App session={session} />
}