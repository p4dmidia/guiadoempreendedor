import { useEffect, useState } from 'react'
import AdminSidebar from '@/react-app/components/AdminSidebar'
import { orgSelect, orgInsert, orgUpdate } from '@/react-app/lib/orgQueries'
import { getSupabase } from '@/react-app/lib/supabaseClient'
import { ORG_ID } from '@/react-app/lib/org'
import { Pencil, Save, Trash2 } from 'lucide-react'

type CouponRow = { id: number | string; code: string; type: 'percentage' | 'fixed'; value: number; valid_until?: string | null; max_uses?: number | null; used_count?: number | null; status?: 'active' | 'inactive'; created_at?: string }

export default function AdminCoupons() {
  const [rows, setRows] = useState<CouponRow[]>([])
  const [form, setForm] = useState({ code: '', type: 'percentage', value: 0, valid_until: '', max_uses: '' })
  const [editing, setEditing] = useState<CouponRow | null>(null)
  const [editForm, setEditForm] = useState({ code: '', type: 'percentage', value: 0, valid_until: '', max_uses: '', status: 'active' })
  const [toast, setToast] = useState<{ type: 'error'|'success'|'warn'; message: string } | null>(null)

  useEffect(() => {
    const load = async () => {
      const res: any = await (orgSelect('coupons', 'id,code,type,value,valid_until,max_uses,used_count,status,created_at') as any).order('created_at', { ascending: false })
      setRows(((res?.data as any) || []) as any)
    }
    load()
  }, [])

  const normalizeCode = (s: string) => s.replace(/\s+/g, '').toUpperCase()
  const create = async () => {
    const code = normalizeCode(form.code)
    if (!code || Number(form.value) <= 0) { setToast({ type: 'warn', message: 'Informe código e valor válido.' }); return }
    const payload = {
      code,
      type: form.type,
      value: Number(form.value),
      valid_until: form.valid_until ? new Date(form.valid_until).toISOString() : null,
      max_uses: form.max_uses ? Number(form.max_uses) : null,
      used_count: 0,
      status: 'active'
    }
    const { error } = await (orgInsert as any)('coupons', payload)
    if (!error) {
      setToast({ type: 'success', message: 'Cupom criado.' })
      const res: any = await (orgSelect('coupons', 'id,code,type,value,valid_until,max_uses,used_count,status,created_at') as any).order('created_at', { ascending: false })
      setRows(((res?.data as any) || []) as any)
      setForm({ code: '', type: 'percentage', value: 0, valid_until: '', max_uses: '' })
    } else {
      setToast({ type: 'error', message: 'Erro ao criar cupom.' })
    }
  }

  const openEdit = (row: CouponRow) => {
    setEditing(row)
    setEditForm({
      code: row.code || '',
      type: (row.type as any) || 'percentage',
      value: Number(row.value || 0),
      valid_until: row.valid_until ? String(row.valid_until).slice(0, 10) : '',
      max_uses: row.max_uses ? String(row.max_uses) : '',
      status: (row.status as any) || 'active'
    })
  }

  const saveEdit = async () => {
    if (!editing) return
    const code = normalizeCode(editForm.code)
    const payload = {
      code,
      type: editForm.type,
      value: Number(editForm.value),
      valid_until: editForm.valid_until ? new Date(editForm.valid_until).toISOString() : null,
      max_uses: editForm.max_uses ? Number(editForm.max_uses) : null,
      status: editForm.status
    }
    const { error } = await (orgUpdate as any)('coupons', { id: editing.id }, payload)
    if (!error) {
      setRows(prev => prev.map(r => r.id === editing.id ? { ...r, ...payload } as any : r))
      setToast({ type: 'success', message: 'Cupom atualizado.' })
      setEditing(null)
    } else {
      setToast({ type: 'error', message: 'Erro ao salvar.' })
    }
  }

  const deleteRow = async (row: CouponRow) => {
    const ok = window.confirm('Tem certeza que deseja excluir este cupom?')
    if (!ok) return
    const supabase = getSupabase()
    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('organization_id', ORG_ID)
      .eq('id', row.id)
    if (error) {
      setToast({ type: 'error', message: error.message || 'Não foi possível excluir.' })
      return
    }
    setRows(prev => prev.filter(r => String(r.id) !== String(row.id)))
    setToast({ type: 'success', message: 'Cupom excluído com sucesso' })
  }

  const formatDiscount = (r: CouponRow) => r.type === 'percentage' ? `${Number(r.value)}%` : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(r.value))
  const formatDate = (s?: string | null) => s ? new Date(s).toLocaleDateString('pt-BR') : '-'

  return (
    <div className="min-h-screen bg-body">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          {toast && (
            <div className={`fixed top-4 right-4 px-4 py-3 rounded-md shadow-sm text-white ${toast.type === 'error' ? 'bg-red-600' : toast.type === 'success' ? 'bg-green-600' : 'bg-orange-500'}`}>{toast.message}</div>
          )}
          <h1 className="font-poppins font-bold text-2xl text-primary mb-6">Gestão de Cupons</h1>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="font-poppins font-semibold text-lg text-primary mb-4">Criar Cupom</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm text-text-light mb-1">Código</label>
                <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="PROMO100" className="w-full px-3 py-2 border border-gray-300 rounded-md uppercase" />
              </div>
              <div>
                <label className="block text-sm text-text-light mb-1">Tipo</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="percentage">Porcentagem</option>
                  <option value="fixed">Valor Fixo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-text-light mb-1">Valor</label>
                <input type="number" value={form.value} onChange={e => setForm({ ...form, value: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm text-text-light mb-1">Validade</label>
                <input type="date" value={form.valid_until} onChange={e => setForm({ ...form, valid_until: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm text-text-light mb-1">Limite de Uso</label>
                <input type="number" value={form.max_uses} onChange={e => setForm({ ...form, max_uses: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
            </div>
            <div className="mt-4">
              <button onClick={create} className="px-4 py-2 bg-cta text-white rounded-md hover:bg-opacity-90">Salvar</button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-poppins font-semibold text-lg text-primary">Cupons</h2>
            </div>
            <table className="w-full">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm">Código</th>
                  <th className="px-4 py-3 text-left text-sm">Desconto</th>
                  <th className="px-4 py-3 text-left text-sm">Usos</th>
                  <th className="px-4 py-3 text-left text-sm">Validade</th>
                  <th className="px-4 py-3 text-left text-sm">Status</th>
                  <th className="px-4 py-3 text-left text-sm">Ações</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={String(r.id)} className="border-b">
                    <td className="px-4 py-3 text-sm text-primary">{r.code}</td>
                    <td className="px-4 py-3 text-sm">{formatDiscount(r)}</td>
                    <td className="px-4 py-3 text-sm text-text-light">{Number(r.used_count || 0)} / {r.max_uses ?? '∞'}</td>
                    <td className="px-4 py-3 text-sm text-text-light">{formatDate(r.valid_until)}</td>
                    <td className="px-4 py-3 text-sm">{r.status === 'inactive' ? 'Inativo' : 'Ativo'}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-wrap items-center gap-2">
                        <button onClick={() => openEdit(r)} className="inline-flex items-center justify-center gap-1 h-9 px-3 min-w-[120px] bg-accent text-white rounded-md hover:bg-opacity-90"><Pencil className="w-4 h-4" />Editar</button>
                        <button onClick={() => deleteRow(r)} className="inline-flex items-center justify-center gap-1 h-9 px-3 min-w-[120px] bg-red-600 text-white rounded-md hover:bg-red-700"><Trash2 className="w-4 h-4" />Excluir</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {editing && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
              <div className="w-full max-w-lg bg-white rounded-lg p-6">
                <h2 className="font-poppins font-semibold text-lg text-primary mb-4">Editar Cupom</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-text-light mb-1">Código</label>
                    <input value={editForm.code} onChange={e => setEditForm({ ...editForm, code: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md uppercase" />
                  </div>
                  <div>
                    <label className="block text-sm text-text-light mb-1">Tipo</label>
                    <select value={editForm.type} onChange={e => setEditForm({ ...editForm, type: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option value="percentage">Porcentagem</option>
                      <option value="fixed">Valor Fixo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-text-light mb-1">Valor</label>
                    <input type="number" value={editForm.value} onChange={e => setEditForm({ ...editForm, value: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm text-text-light mb-1">Validade</label>
                    <input type="date" value={editForm.valid_until} onChange={e => setEditForm({ ...editForm, valid_until: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm text-text-light mb-1">Limite de Uso</label>
                    <input type="number" value={editForm.max_uses} onChange={e => setEditForm({ ...editForm, max_uses: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm text-text-light mb-1">Status</label>
                    <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option value="active">Ativo</option>
                      <option value="inactive">Inativo</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button onClick={saveEdit} className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2"><Save className="w-4 h-4" />Salvar</button>
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
