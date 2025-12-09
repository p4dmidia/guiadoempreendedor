import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { orgSelect, orgUpdate, orgDelete } from '@/react-app/lib/orgQueries'
import { Users, Network, Ban, Pencil, Trash2, Download, Plus } from 'lucide-react'
import AdminSidebar from '@/react-app/components/AdminSidebar'

type Affiliate = { id: number; full_name: string; email: string; plan: string; status?: string; referral_code?: string | null; created_at: string; cpf?: string; pix_key?: string; address?: string }
type Child = { id: number; full_name: string; plan: string; created_at: string }

export default function AdminAffiliates() {
  const navigate = useNavigate()
  const [rows, setRows] = useState<Affiliate[]>([])
  const [openId, setOpenId] = useState<number | null>(null)
  const [children, setChildren] = useState<Child[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Record<number, boolean>>({})
  const [editing, setEditing] = useState<Affiliate | null>(null)
  const [editForm, setEditForm] = useState({ full_name: '', email: '', plan: '', cpf: '', pix_key: '', address: '' })

  useEffect(() => {
    const load = async () => {
      const res: any = await (orgSelect('affiliates', 'id, full_name, email, plan, status, referral_code, created_at, cpf, pix_key, address') as any).order('created_at', { ascending: false })
      setRows(((res?.data as any) || []) as any)
    }
    load()
  }, [])

  const openNetwork = async (row: Affiliate) => {
    setOpenId(row.id)
    if (!row.referral_code) { setChildren([]); return }
    const res: any = await (orgSelect('affiliates', 'id, full_name, plan, created_at') as any).eq('referred_by_code', row.referral_code)
    setChildren(((res?.data as any) || []) as any)
  }

  const close = () => { setOpenId(null); setChildren([]) }

  const formatDate = (s: string) => new Date(s).toLocaleDateString('pt-BR')
  const filtered = useMemo(() => {
    const t = search.trim().toLowerCase()
    if (!t) return rows
    return rows.filter(r =>
      r.full_name.toLowerCase().includes(t) ||
      r.email.toLowerCase().includes(t) ||
      r.plan.toLowerCase().includes(t)
    )
  }, [rows, search])

  const toggleSelect = (id: number) => {
    setSelected(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const selectAll = (checked: boolean) => {
    const next: Record<number, boolean> = {}
    filtered.forEach(r => { next[r.id] = checked })
    setSelected(next)
  }

  const toCSV = (list: Affiliate[]) => {
    const header = ['id','full_name','email','plan','status','created_at']
    const lines = [header.join(',')]
    list.forEach(r => {
      lines.push([r.id, r.full_name, r.email, r.plan, r.status || '', r.created_at].map(v => String(v).replace(/"/g,'"')).join(','))
    })
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'afiliados.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportData = () => {
    const chosen = filtered.filter(r => selected[r.id])
    toCSV(chosen.length ? chosen : filtered)
  }

  const blockRow = async (row: Affiliate) => {
    const ok = window.confirm('Deseja bloquear este afiliado?')
    if (!ok) return
    const { error } = await orgUpdate('affiliates', { id: row.id }, { status: 'blocked' })
    if (!error) setRows(prev => prev.map(r => r.id === row.id ? { ...r, status: 'blocked' } : r))
  }

  const deleteRow = async (row: Affiliate) => {
    const ok = window.confirm('Deseja excluir este afiliado?')
    if (!ok) return
    const { error } = await orgDelete('affiliates', { id: row.id })
    if (!error) setRows(prev => prev.filter(r => r.id !== row.id))
  }

  const openEdit = (row: Affiliate) => {
    setEditing(row)
    setEditForm({ full_name: row.full_name, email: row.email, plan: row.plan, cpf: row.cpf || '', pix_key: row.pix_key || '', address: row.address || '' })
  }

  const saveEdit = async () => {
    if (!editing) return
    const { error } = await orgUpdate('affiliates', { id: editing.id }, { full_name: editForm.full_name, email: editForm.email, plan: editForm.plan, cpf: editForm.cpf, pix_key: editForm.pix_key, address: editForm.address })
    if (!error) {
      setRows(prev => prev.map(r => r.id === editing.id ? { ...r, full_name: editForm.full_name, email: editForm.email, plan: editForm.plan, cpf: editForm.cpf, pix_key: editForm.pix_key, address: editForm.address } : r))
      setEditing(null)
    }
  }

  return (
    <div className="min-h-screen bg-body">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
        <h1 className="font-poppins font-bold text-2xl text-primary mb-6">Gerenciar Afiliados</h1>
        <div className="flex items-center justify-between mb-4">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar por nome, plano, email" className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md" />
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/cadastro-guia-comercial')} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 flex items-center gap-2"><Plus className="w-4 h-4" />Cadastrar Novo</button>
            <button onClick={exportData} className="px-4 py-2 bg-cta text-white rounded-md hover:bg-opacity-90 flex items-center gap-2"><Download className="w-4 h-4" />Exportar</button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm">
          <table className="w-full">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-4 py-3"><input type="checkbox" onChange={e => selectAll(e.target.checked)} /></th>
                <th className="px-4 py-3 text-left text-sm">Nome</th>
                <th className="px-4 py-3 text-left text-sm">E-mail</th>
                <th className="px-4 py-3 text-left text-sm">Plano</th>
                <th className="px-4 py-3 text-left text-sm">Data</th>
                <th className="px-4 py-3 text-left text-sm">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b">
                  <td className="px-4 py-3"><input type="checkbox" checked={!!selected[r.id]} onChange={() => toggleSelect(r.id)} /></td>
                  <td className="px-4 py-3 text-sm text-primary">{r.full_name}</td>
                  <td className="px-4 py-3 text-sm text-text-light">{r.email}</td>
                  <td className="px-4 py-3 text-sm">{r.plan}</td>
                  <td className="px-4 py-3 text-sm text-text-light">{formatDate(r.created_at)}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      {r.plan === 'embaixador' && (
                        <button onClick={() => openNetwork(r)} className="inline-flex items-center justify-center gap-1 h-9 px-3 min-w-[120px] bg-cta text-white rounded-md hover:bg-opacity-90"><Network className="w-4 h-4" />Ver Rede</button>
                      )}
                      <button onClick={() => openEdit(r)} className="inline-flex items-center justify-center gap-1 h-9 px-3 min-w-[120px] bg-accent text-white rounded-md hover:bg-opacity-90"><Pencil className="w-4 h-4" />Editar</button>
                      <button onClick={() => blockRow(r)} className="inline-flex items-center justify-center gap-1 h-9 px-3 min-w-[120px] bg-primary text-white rounded-md hover:bg-opacity-90"><Ban className="w-4 h-4" />Bloquear</button>
                      <button onClick={() => deleteRow(r)} className="inline-flex items-center justify-center gap-1 h-9 px-3 min-w-[120px] bg-red-600 text-white rounded-md hover:bg-red-700"><Trash2 className="w-4 h-4" />Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {openId != null && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-end">
            <div className="w-full max-w-md bg-white h-full p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-poppins font-semibold text-lg text-primary flex items-center gap-2"><Users className="w-4 h-4" />Rede do Afiliado</h2>
                <button onClick={close} className="text-primary">Fechar</button>
              </div>
              {children.length === 0 ? (
                <p className="text-text-light">Sem indicados no nível 1.</p>
              ) : (
                <div className="space-y-3">
                  {children.map(c => (
                    <div key={c.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-primary">{c.full_name}</div>
                          <div className="text-sm text-text-light">Plano {c.plan}</div>
                        </div>
                        <div className="text-sm text-text-light">{formatDate(c.created_at)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {editing && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-lg p-6">
              <h2 className="font-poppins font-semibold text-lg text-primary mb-4">Editar Afiliado</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-text-light text-sm mb-1">Nome</label>
                  <input value={editForm.full_name} onChange={e => setEditForm({ ...editForm, full_name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-text-light text-sm mb-1">E-mail</label>
                  <input value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-text-light text-sm mb-1">CPF</label>
                  <input value={editForm.cpf} onChange={e => setEditForm({ ...editForm, cpf: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-text-light text-sm mb-1">Chave Pix</label>
                  <input value={editForm.pix_key} onChange={e => setEditForm({ ...editForm, pix_key: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-text-light text-sm mb-1">Endereço</label>
                  <input value={editForm.address} onChange={e => setEditForm({ ...editForm, address: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-text-light text-sm mb-1">Plano</label>
                  <select value={editForm.plan} onChange={e => setEditForm({ ...editForm, plan: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md">
                    <option value="assinante">Assinante</option>
                    <option value="associado">Associado</option>
                    <option value="embaixador">Embaixador</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={saveEdit} className="px-4 py-2 bg-primary text-white rounded-md">Salvar</button>
                <button onClick={() => setEditing(null)} className="px-4 py-2 bg-gray-200 text-primary rounded-md">Cancelar</button>
              </div>
            </div>
          </div>
        )}
        </main>
      </div>
    </div>
  )
}

