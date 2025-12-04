import { useEffect, useMemo, useState } from 'react'
import { orgSelect, orgUpdate } from '@/react-app/lib/orgQueries'
import { DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react'
import AdminSidebar from '@/react-app/components/AdminSidebar'

type Withdrawal = {
  id: number
  affiliate_id: number
  amount: number
  status: 'pending' | 'paid' | 'rejected'
  requested_at: string
  processed_at?: string | null
}

type Affiliate = { id: number; full_name: string; pix_key?: string | null }

export default function AdminWithdrawals() {
  const [filter, setFilter] = useState<'pending' | 'paid' | 'rejected'>('pending')
  const [rows, setRows] = useState<Withdrawal[]>([])
  const [affMap, setAffMap] = useState<Record<number, Affiliate>>({})

  useEffect(() => {
    const load = async () => {
      const res: any = await (orgSelect('withdrawals', 'id, affiliate_id, amount, status, requested_at, processed_at') as any).order('requested_at', { ascending: false })
      const listRaw = res?.data as any
      const listArr: Withdrawal[] = Array.isArray(listRaw) ? listRaw : []
      setRows(listArr)
      const ids = Array.from(new Set(listArr.map((r: any) => r.affiliate_id)))
      if (ids.length) {
      const supabase = (await import('@/react-app/lib/supabaseClient')).getSupabase()
        const { data: affs } = await supabase
          .from('affiliates')
          .select('id, full_name, pix_key')
          .eq('organization_id', (await import('@/react-app/lib/org')).ORG_ID)
          .in('id', ids)
        const map: Record<number, Affiliate> = {}
        const affsArr: any[] = Array.isArray(affs) ? affs : []
        affsArr.forEach((a: any) => { map[a.id] = a })
        setAffMap(map)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => rows.filter(r => r.status === filter), [rows, filter])

  const approve = async (id: number) => {
    const { error } = await orgUpdate('withdrawals', { id }, { status: 'paid', processed_at: new Date().toISOString() })
    if (!error) setRows(prev => prev.map(r => r.id === id ? { ...r, status: 'paid', processed_at: new Date().toISOString() } : r))
  }

  const reject = async (id: number) => {
    const { error } = await orgUpdate('withdrawals', { id }, { status: 'rejected', processed_at: new Date().toISOString() })
    if (!error) setRows(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected', processed_at: new Date().toISOString() } : r))
  }

  const formatCurrency = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
  const formatDate = (s: string) => new Date(s).toLocaleDateString('pt-BR')

  return (
    <div className="min-h-screen bg-body">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
        <h1 className="font-poppins font-bold text-2xl text-primary mb-6">Financeiro / Saques</h1>
        <div className="flex gap-2 mb-6">
          <button onClick={() => setFilter('pending')} className={`px-4 py-2 rounded-md ${filter==='pending'?'bg-cta text-white':'bg-white text-primary border'}`}><Clock className="w-4 h-4 inline mr-2" />Pendentes</button>
          <button onClick={() => setFilter('paid')} className={`px-4 py-2 rounded-md ${filter==='paid'?'bg-cta text-white':'bg-white text-primary border'}`}><DollarSign className="w-4 h-4 inline mr-2" />Pagos</button>
          <button onClick={() => setFilter('rejected')} className={`px-4 py-2 rounded-md ${filter==='rejected'?'bg-cta text-white':'bg-white text-primary border'}`}>Rejeitados</button>
        </div>
        <div className="bg-white rounded-lg shadow-sm">
          <table className="w-full">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm">Data</th>
                <th className="px-4 py-3 text-left text-sm">Afiliado</th>
                <th className="px-4 py-3 text-left text-sm">Pix</th>
                <th className="px-4 py-3 text-left text-sm">Valor</th>
                <th className="px-4 py-3 text-left text-sm">Status</th>
                <th className="px-4 py-3 text-left text-sm">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b">
                  <td className="px-4 py-3 text-sm text-text-light">{formatDate(r.requested_at)}</td>
                  <td className="px-4 py-3 text-sm text-primary">{affMap[r.affiliate_id]?.full_name || '-'}</td>
                  <td className="px-4 py-3 text-sm text-text-light">{affMap[r.affiliate_id]?.pix_key || '-'}</td>
                  <td className="px-4 py-3 text-sm font-medium text-accent">{formatCurrency(r.amount)}</td>
                  <td className="px-4 py-3 text-sm">{r.status}</td>
                  <td className="px-4 py-3 text-sm">
                    {r.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button onClick={() => approve(r.id)} className="px-3 py-2 bg-cta text-white rounded-md hover:bg-opacity-90 flex items-center gap-1"><CheckCircle className="w-4 h-4" />Aprovar/Pagar</button>
                        <button onClick={() => reject(r.id)} className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1"><XCircle className="w-4 h-4" />Rejeitar</button>
                      </div>
                    ) : (
                      <span className="text-text-light">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td className="px-4 py-6 text-center text-text-light" colSpan={6}>Sem registros</td></tr>
              )}
            </tbody>
          </table>
        </div>
        </main>
      </div>
    </div>
  )
}

