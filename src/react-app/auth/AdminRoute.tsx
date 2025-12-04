import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { getSupabase } from '@/react-app/lib/supabaseClient'
import { ORG_ID } from '@/react-app/lib/org'

export default function AdminRoute({ children }: { children: ReactNode }) {
  const [allowed, setAllowed] = useState<boolean | null>(null)

  useEffect(() => {
    (async () => {
      const supabase = getSupabase()
      const { data } = await supabase.auth.getUser()
      const uid = data.user?.id
      if (!uid) { setAllowed(false); return }
      const { data: prof } = await supabase
        .from('profiles')
        .select('role, organization_id')
        .eq('id', uid)
        .maybeSingle()
      const ok = prof && prof.role === 'admin' && prof.organization_id === ORG_ID
      setAllowed(!!ok)
    })()
  }, [])

  if (allowed === null) return null
  if (!allowed) return <Navigate to="/admin/login" replace />
  return children
}

