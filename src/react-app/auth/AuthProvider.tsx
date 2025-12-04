import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { getSupabase } from '@/react-app/lib/supabaseClient'

type AuthContextValue = {
  user: User | null
  session: Session | null
  isPending: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isPending, setIsPending] = useState(true)

  useEffect(() => {
    const supabase = getSupabase()
    ;(async () => {
      try {
        const { data } = await supabase.auth.getSession()
        setSession(data.session ?? null)
        setUser(data.session?.user ?? null)
      } finally {
        setIsPending(false)
      }
    })()
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s ?? null)
      setUser(s?.user ?? null)
    })
    return () => {
      sub.subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    const supabase = getSupabase()
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, session, isPending, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

