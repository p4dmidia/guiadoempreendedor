import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '@/react-app/components/AdminSidebar'
import { orgSelect, orgDelete } from '@/react-app/lib/orgQueries'
import { Plus, Pencil, Trash2 } from 'lucide-react'

type PostRow = { id: number; title: string; slug: string; status: string; created_at: string; category?: string | null; subcategory?: string | null }

export default function AdminBlogList() {
  const navigate = useNavigate()
  const [rows, setRows] = useState<PostRow[]>([])
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState<{ type: 'error'|'success'|'warn'; message: string } | null>(null)
  

  useEffect(() => {
    const load = async () => {
      const res: any = await (orgSelect('blog_posts', '*') as any).order('created_at', { ascending: false })
      setRows(((res?.data as any) || []) as any)
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    const t = search.trim().toLowerCase()
    const list = rows
    if (!t) return list
    return list.filter(r => r.title.toLowerCase().includes(t) || r.slug.toLowerCase().includes(t))
  }, [rows, search])

  const formatDate = (s: string) => new Date(s).toLocaleDateString('pt-BR')

  const deleteRow = async (row: PostRow) => {
    const ok = window.confirm('Deseja excluir este post?')
    if (!ok) return
    const { error } = await orgDelete('blog_posts', { id: row.id })
    if (error) {
      console.error('Erro ao deletar:', error)
      setToast({ type: 'error', message: 'Não foi possível excluir: ' + (error?.message || 'Falha desconhecida') })
      return
    }
    setRows(prev => prev.filter(r => r.id !== row.id))
    setToast({ type: 'success', message: 'Post excluído com sucesso' })
  }

  return (
    <div className="min-h-screen bg-body">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          {toast && (
            <div className={`fixed top-4 right-4 px-4 py-3 rounded-md shadow-sm text-white ${toast.type === 'error' ? 'bg-red-600' : toast.type === 'success' ? 'bg-green-600' : 'bg-orange-500'}`}>{toast.message}</div>
          )}
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-poppins font-bold text-2xl text-primary">Blog • Administração</h1>
            <button onClick={() => navigate('/admin/blog/novo')} className="px-4 py-2 bg-cta text-white rounded-md hover:bg-opacity-90 flex items-center gap-2"><Plus className="w-4 h-4" />Novo Post</button>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar por título ou slug" className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md" />
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm">Título</th>
                  <th className="px-4 py-3 text-left text-sm">Slug</th>
                  <th className="px-4 py-3 text-left text-sm">Categoria</th>
                  <th className="px-4 py-3 text-left text-sm">Status</th>
                  <th className="px-4 py-3 text-left text-sm">Data</th>
                  <th className="px-4 py-3 text-left text-sm">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className="border-b">
                    <td className="px-4 py-3 text-sm text-primary">{r.title}</td>
                    <td className="px-4 py-3 text-sm text-text-light">{r.slug}</td>
                    <td className="px-4 py-3 text-sm text-text-light">{r.category ? (r.subcategory ? `${r.category} > ${r.subcategory}` : r.category) : '-'}</td>
                    <td className="px-4 py-3 text-sm">
                      {r.status === 'published' ? (
                        <span className="inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-700 text-xs">Publicado</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs">Rascunho</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-light">{formatDate(r.created_at)}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button onClick={() => navigate(`/admin/blog/${r.id}/editar`)} className="px-3 py-2 bg-accent text-white rounded-md hover:bg-opacity-90 flex items-center gap-1"><Pencil className="w-4 h-4" />Editar</button>
                        <button onClick={() => deleteRow(r)} className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1"><Trash2 className="w-4 h-4" />Excluir</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  )
}

