import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSupabase } from '@/react-app/lib/supabaseClient'
import { ORG_ID } from '@/react-app/lib/org'
import { orgInsert } from '@/react-app/lib/orgQueries'
import { DollarSign, Clock, AlertTriangle } from 'lucide-react'
import DashboardNavbar from '@/react-app/components/DashboardNavbar'
import { useAuth } from '@/react-app/auth/AuthProvider'

type Totals = {
  available: number
  withdrawn: number
  pending: number
}

type WithdrawalRow = { id: number; amount: number; status: string; requested_at: string }

export default function Financeiro() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [affiliateId, setAffiliateId] = useState<number | null>(null)
  const [pixKey, setPixKey] = useState<string | null>(null)
  const [totals, setTotals] = useState<Totals>({ available: 0, withdrawn: 0, pending: 0 })
  const [withdrawals, setWithdrawals] = useState<WithdrawalRow[]>([])
  const [amount, setAmount] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [member, setMember] = useState<{ plan: string; full_name: string } | null>(null)
  const minValue = 50

  useEffect(() => {
    const load = async () => {
      const supabase = getSupabase()
      const { data: auth } = await supabase.auth.getUser()
      const uid = auth.user?.id
      if (!uid) { navigate('/login'); return }
      const { data: aff } = await supabase
        .from('affiliates')
        .select('id, pix_key, full_name, plan')
        .eq('organization_id', ORG_ID)
        .eq('user_id', uid)
        .maybeSingle()
      if (!aff) { navigate('/cadastro'); return }
      setAffiliateId(aff.id)
      setPixKey(aff.pix_key || null)
      setMember({ plan: aff.plan, full_name: aff.full_name })

      const { data: com } = await supabase
        .from('commissions')
        .select('amount, status')
        .eq('organization_id', ORG_ID)
        .eq('affiliate_id', aff.id)
      const available = (com || []).filter(r => r.status === 'available').reduce((s, r) => s + (Number(r.amount) || 0), 0)

      const { data: wd } = await supabase
        .from('withdrawals')
        .select('id, amount, status, requested_at')
        .eq('organization_id', ORG_ID)
        .eq('affiliate_id', aff.id)
        .order('requested_at', { ascending: false })
      const withdrawn = (wd || []).filter(r => r.status === 'paid').reduce((s, r) => s + (Number(r.amount) || 0), 0)
      const pending = (wd || []).filter(r => r.status === 'pending').reduce((s, r) => s + (Number(r.amount) || 0), 0)
      setWithdrawals((wd || []) as WithdrawalRow[])
      setTotals({ available, withdrawn, pending })
      setLoading(false)
    }
    load()
  }, [navigate])

  const availableBalance = totals.available - totals.withdrawn - totals.pending
  const canRequest = pixKey && availableBalance > 0

  const formatCurrency = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
  const formatDate = (s: string) => new Date(s).toLocaleDateString('pt-BR')

  const requestWithdraw = async () => {
    if (!affiliateId) return
    const value = Number(amount)
    if (Number.isNaN(value) || value <= 0) return
    if (value > availableBalance) { alert('Valor acima do saldo disponível'); return }
    if (value < minValue) { alert(`Valor mínimo para saque: ${formatCurrency(minValue)}`); return }
    const { error } = await orgInsert('withdrawals', {
      affiliate_id: affiliateId,
      amount: value,
      status: 'pending'
    })
    if (error) { alert('Erro ao solicitar saque'); return }
    setAmount('')
    const nowList = [
      { id: Date.now(), amount: value, status: 'pending', requested_at: new Date().toISOString() },
      ...withdrawals
    ]
    setWithdrawals(nowList as WithdrawalRow[])
    setTotals(t => ({ ...t, pending: t.pending + value }))
    alert('Solicitação enviada com sucesso!')
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-text-light">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-body">
      {member && (
        <DashboardNavbar member={member} onLogout={handleLogout} />
      )}
      <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="font-poppins font-bold text-2xl text-primary mb-6">Financeiro</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-primary">{formatCurrency(Math.max(availableBalance, 0))}</div>
          <div className="text-sm text-text-light">Saldo Disponível</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-cta" />
            </div>
          </div>
          <div className="text-2xl font-bold text-primary">{formatCurrency(totals.pending)}</div>
          <div className="text-sm text-text-light">Em Processamento</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-primary">{formatCurrency(totals.withdrawn)}</div>
          <div className="text-sm text-text-light">Total Já Sacado</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h3 className="font-poppins font-semibold text-lg text-primary mb-4">Solicitação de Saque</h3>
        {!pixKey && (
          <div className="flex items-center gap-2 p-3 rounded-md bg-yellow-50 text-yellow-700 mb-4">
            <AlertTriangle className="w-5 h-5" />
            <span>Você precisa cadastrar sua Chave Pix em "Meu Perfil" para solicitar saques.</span>
          </div>
        )}
        <div className="flex items-center gap-4">
          <input
            type="number"
            min={0}
            step={0.01}
            value={amount}
            onChange={e => setAmount(e.target.value)}
            disabled={!pixKey}
            placeholder="Valor do Saque (R$)"
            className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={requestWithdraw}
            disabled={!pixKey}
            className="px-6 py-3 bg-cta text-white rounded-md font-medium hover:bg-opacity-90 transition-all disabled:opacity-50"
          >
            Solicitar Saque
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-poppins font-semibold text-lg text-primary mb-4">Histórico de Saques</h3>
        {withdrawals.length === 0 ? (
          <p className="text-text-light">Nenhum saque realizado ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-body">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Data</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Valor</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Status</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map(w => (
                  <tr key={w.id} className="border-b">
                    <td className="px-4 py-3 text-sm text-text-light">{formatDate(w.requested_at)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-accent">{formatCurrency(w.amount)}</td>
                    <td className="px-4 py-3 text-sm">{w.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

