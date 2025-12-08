import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, TrendingUp, DollarSign, Clock, Settings, LogOut, PieChart as PieIcon, LineChart as LineIcon, List } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import { orgSelect } from '@/react-app/lib/orgQueries'
import { getSupabase } from '@/react-app/lib/supabaseClient'
import { ORG_ID } from '@/react-app/lib/org'

type Affiliate = {
  id: number
  full_name: string
  email: string
  plan: 'assinante' | 'associado' | 'embaixador'
  status?: string
  referred_by_code?: string | null
  created_at: string
  subscription_end_date?: string
}

type CommissionRow = { amount: number; status: string }

const PLAN_PRICE: Record<string, number> = { assinante: 997, associado: 2497, embaixador: 3997 }
const PIE_COLORS = { assinante: '#3b82f6', associado: '#22c55e', embaixador: '#eab308' }

export default function AdminDashboardBasic() {
  const navigate = useNavigate()
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [pendingCommissions, setPendingCommissions] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = getSupabase()
      const resAff: any = await (orgSelect('affiliates', 'id, full_name, email, plan, status, referred_by_code, created_at, subscription_end_date') as any)
        .order('created_at', { ascending: false })
      setAffiliates(((resAff?.data as any) || []) as any)
      const resCom: any = await orgSelect('commissions', 'amount, status') as any
      const pend = ((resCom?.data as any[]) || []).filter((c: any) => c.status === 'pending').reduce((s: number, r: any) => s + (Number(r.amount) || 0), 0)
      setPendingCommissions(pend)
      setLoading(false)
    }
    load()
  }, [])

  const totalMembers = affiliates.length
  const thirtyDaysAgo = useMemo(() => {
    const d = new Date(); d.setDate(d.getDate() - 30); return d
  }, [])
  const newThisMonth = affiliates.filter(a => new Date(a.created_at) >= thirtyDaysAgo).length
  const revenueEstimate = affiliates
    .filter(a => (a.status === 'active') || (a.subscription_end_date && new Date(a.subscription_end_date) > new Date()))
    .reduce((sum, a) => sum + (PLAN_PRICE[a.plan] || 0), 0)

  const planDistribution = useMemo(() => {
    const counts = { assinante: 0, associado: 0, embaixador: 0 }
    affiliates.forEach(a => { counts[a.plan] = (counts[a.plan] || 0) + 1 })
    return [
      { name: 'Assinante', key: 'assinante', value: counts.assinante, color: PIE_COLORS.assinante },
      { name: 'Associado', key: 'associado', value: counts.associado, color: PIE_COLORS.associado },
      { name: 'Embaixador', key: 'embaixador', value: counts.embaixador, color: PIE_COLORS.embaixador },
    ]
  }, [affiliates])

  const growthData = useMemo(() => {
    const days = 30
    const map: Record<string, number> = {}
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      map[key] = 0
    }
    affiliates.forEach(a => {
      const key = new Date(a.created_at).toISOString().slice(0, 10)
      if (key in map) map[key] += 1
    })
    return Object.entries(map).map(([date, count]) => ({ date, count }))
  }, [affiliates])

  const recent = affiliates.slice(0, 5)

  const formatCurrency = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
  const planBadge = (plan: string) => ({
    assinante: 'bg-blue-100 text-blue-800',
    associado: 'bg-green-100 text-green-800',
    embaixador: 'bg-yellow-100 text-yellow-800'
  }[plan] || 'bg-gray-100 text-gray-800')

  const logout = async () => {
    const supabase = getSupabase()
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-text-light">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-body">
      <div className="flex">
        <aside className="w-64 bg-primary text-white shadow-sm min-h-screen p-6 sticky top-0">
          <img src="https://mocha-cdn.com/019ae075-432d-7f0b-9b71-b1650e85c237/Fundo-Escuro.png" alt="Guia Empreendedor Digital" className="mb-6" />
          <nav className="space-y-2">
            <button onClick={() => navigate('/admin/dashboard')} className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md bg-white/10 hover:bg-white/20"><LineIcon className="w-4 h-4" />Visão Geral</button>
            <button onClick={() => navigate('/admin/blog')} className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10"><List className="w-4 h-4" />Gerenciar Blog</button>
            <button onClick={() => navigate('/admin/afiliados')} className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10"><Users className="w-4 h-4" />Gerenciar Afiliados</button>
            <button onClick={() => navigate('/admin/saques')} className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10"><DollarSign className="w-4 h-4" />Financeiro / Saques</button>
            <button onClick={() => navigate('/admin/configuracoes')} className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10"><Settings className="w-4 h-4" />Configurações</button>
            <button onClick={logout} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-cta/20 text-cta w-full"><LogOut className="w-4 h-4" />Sair</button>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <div className="mb-6">
            <h1 className="font-poppins font-bold text-2xl text-primary">Olá, Admin</h1>
            <p className="text-text-light">Bem-vindo ao Painel de Controle</p>
          </div>

          <section id="overview" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-primary">{totalMembers}</div>
              <div className="text-sm text-text-light">Total de Membros</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-primary">{newThisMonth}</div>
              <div className="text-sm text-text-light">Novos últimos 30 dias</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-accent" />
                </div>
              </div>
              <div className="text-2xl font-bold text-primary">{formatCurrency(revenueEstimate)}</div>
              <div className="text-sm text-text-light">Faturamento estimado</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-cta" />
                </div>
              </div>
              <div className="text-2xl font-bold text-primary">{formatCurrency(pendingCommissions)}</div>
              <div className="text-sm text-text-light">Comissões pendentes</div>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-poppins font-semibold text-lg text-primary mb-4 flex items-center gap-2"><PieIcon className="w-4 h-4" />Distribuição de Planos</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={planDistribution} dataKey="value" cx="50%" cy="50%" outerRadius={100} label={(e) => `${e.name}: ${e.value}`}> 
                    {planDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-poppins font-semibold text-lg text-primary mb-4 flex items-center gap-2"><LineIcon className="w-4 h-4" />Crescimento (30 dias)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section id="affiliates" className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-poppins font-semibold text-lg text-primary mb-4 flex items-center gap-2"><List className="w-4 h-4" />Últimos Cadastros</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-body">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Nome</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Plano</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Data</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Indicado por</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((a) => (
                    <tr key={a.id} className="border-b hover:bg-body">
                      <td className="px-4 py-3">
                        <div className="font-medium text-primary">{a.full_name}</div>
                        <div className="text-xs text-text-light">{a.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${planBadge(a.plan)}`}>{a.plan}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-text-light">{new Date(a.created_at).toLocaleDateString('pt-BR')}</td>
                      <td className="px-4 py-3 text-sm text-text-light">{a.referred_by_code || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          
        </main>
      </div>
    </div>
  )
}

