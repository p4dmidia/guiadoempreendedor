import { createClient } from '@supabase/supabase-js'

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed')
  const url = process.env.SUPABASE_URL as string
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY as string
  if (!url || !key) return res.status(500).json({ error: 'Missing Supabase admin credentials' })
  const { userId, newPassword } = req.body || {}
  if (!userId || !newPassword) return res.status(400).json({ error: 'Missing userId or newPassword' })
  if (String(newPassword).length < 6) return res.status(400).json({ error: 'Password too short' })
  try {
    const supabase = createClient(url, key)
    const resp = await supabase.auth.admin.updateUserById(String(userId), { password: String(newPassword) })
    if (resp.error) return res.status(400).json({ error: resp.error.message })
    return res.status(200).json({ ok: true })
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Unexpected error' })
  }
}
