export type PlanCode = 'assinante' | 'associado' | 'embaixador'

export const PLANS: Record<PlanCode, { title: string; price: number }> = {
  assinante: { title: 'Plano Assinante', price: 997 },
  associado: { title: 'Plano Associado', price: 2497 },
  embaixador: { title: 'Plano Embaixador', price: 3997 },
}

export function getPlanMeta(code?: string | null) {
  const key = (code || '').toLowerCase() as PlanCode
  return PLANS[key] || PLANS.assinante
}

