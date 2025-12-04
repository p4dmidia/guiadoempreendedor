import { getSupabase } from '@/react-app/lib/supabaseClient'
import { ORG_ID } from '@/react-app/lib/org'

export function orgSelect(table: string, columns = '*') {
  return getSupabase().from(table).select(columns).eq('organization_id', ORG_ID)
}

export function orgUpdate(table: string, match: Record<string, any>, payload: Record<string, any>) {
  return getSupabase().from(table).update(payload).eq('organization_id', ORG_ID).match(match || {})
}

export function orgDelete(table: string, match: Record<string, any>) {
  return getSupabase().from(table).delete().eq('organization_id', ORG_ID).match(match || {})
}

export function orgInsert(table: string, payload: Record<string, any> | Record<string, any>[]) {
  const rows = Array.isArray(payload) ? payload : [payload]
  return getSupabase().from(table).insert(rows.map(r => ({ ...r, organization_id: ORG_ID })))
}

