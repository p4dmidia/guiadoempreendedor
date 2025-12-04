import { getSupabase } from '@/react-app/lib/supabaseClient'
import { ORG_ID } from '@/react-app/lib/org'

type AffiliateRow = {
  id: number
  user_id: string
  plan: string
  full_name: string
  referral_code?: string | null
  referred_by_code?: string | null
}

type CommissionSetting = {
  level: number
  percentage: number
}

export async function processOrderCommissions(affiliateId: number, orderAmount: number) {
  const supabase = getSupabase()

  const { data: buyer } = await supabase
    .from('affiliates')
    .select('id,user_id,plan,full_name,referral_code,referred_by_code')
    .eq('organization_id', ORG_ID)
    .eq('id', affiliateId)
    .maybeSingle()
  if (!buyer) return

  const { data: settings } = await supabase
    .from('commission_settings')
    .select('level,percentage')
    .eq('organization_id', ORG_ID)
    .in('level', [1, 2, 3])
  const pctByLevel = new Map<number, number>(
    (settings || []).map((s: CommissionSetting) => [s.level, s.percentage])
  )

  const ancestors: AffiliateRow[] = []
  let currentRefCode = buyer.referred_by_code || null
  for (let level = 1; level <= 3; level++) {
    if (!currentRefCode) break
    const { data: ancestor } = await supabase
      .from('affiliates')
      .select('id,user_id,plan,full_name,referral_code,referred_by_code')
      .eq('organization_id', ORG_ID)
      .eq('referral_code', currentRefCode)
      .maybeSingle()
    if (!ancestor) break
    ancestors.push(ancestor as AffiliateRow)
    currentRefCode = ancestor.referred_by_code || null
  }

  for (let i = 0; i < ancestors.length; i++) {
    const level = i + 1
    const ancestor = ancestors[i]
    const pct = pctByLevel.get(level) || 0
    const canPay =
      level === 1
        ? ancestor.plan === 'associado' || ancestor.plan === 'embaixador'
        : ancestor.plan === 'embaixador'
    if (!canPay || pct <= 0) continue
    const amount = (orderAmount * pct) / 100
    await supabase
      .from('commissions')
      .insert([
        {
          organization_id: ORG_ID,
          affiliate_id: ancestor.id,
          amount,
          percentage: pct,
          status: 'pending'
        }
      ])
  }
}

