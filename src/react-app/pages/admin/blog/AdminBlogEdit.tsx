import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminSidebar from '@/react-app/components/AdminSidebar'
import { orgSelect, orgUpdate } from '@/react-app/lib/orgQueries'
import { getSupabase } from '@/react-app/lib/supabaseClient'

function slugify(s: string) {
  return s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function AdminBlogEdit() {
  const navigate = useNavigate()
  const params = useParams()
  const id = params.id as string
  const [toast, setToast] = useState<{ type: 'error'|'success'|'warn'; message: string } | null>(null)
  const [form, setForm] = useState({
    title: '',
    slug: '',
    cover_url: '',
    intro: '',
    body: '',
    conclusion: '',
    keywords: '',
    meta_description: '',
    cta_text: '',
    cta_link: '',
    status: 'draft'
  })
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      const res: any = await (orgSelect('blog_posts', '*') as any).eq('id', id).maybeSingle()
      const data = (res?.data as any) || null
      if (!data || (typeof data === 'string' && (data as any)?.error)) return
      setForm({
        title: data.title || '',
        slug: data.slug || '',
        cover_url: data.cover_url || '',
        intro: data.intro || '',
        body: data.body || '',
        conclusion: data.conclusion || '',
        keywords: data.keywords || '',
        meta_description: data.meta_description || '',
        cta_text: data.cta_text || '',
        cta_link: data.cta_link || '',
        status: data.status || 'draft'
      })
    }
    if (id) load()
  }, [id])

  const onTitleChange = (v: string) => {
    const sl = slugify(v)
    setForm(prev => ({ ...prev, title: v, slug: sl }))
  }

  const uploadCoverIfNeeded = async () => {
    if (!coverFile) return form.cover_url
    const supabase = getSupabase()
    const name = `cover-${Date.now()}-${Math.random().toString(36).slice(2)}.${coverFile.name.split('.').pop()}`
    const { data, error } = await supabase.storage.from('blog-images').upload(name, coverFile)
    if (error) return form.cover_url
    const { data: pub } = await supabase.storage.from('blog-images').getPublicUrl(data.path)
    return pub.publicUrl
  }

  const save = async () => {
    if (!form.title.trim() || !form.body.trim()) {
      setToast({ type: 'warn', message: 'Preencha os campos obrigatórios: Título e Corpo.' })
      return
    }
    setSaving(true)
    const cover = await uploadCoverIfNeeded()
    const payload = { ...form, cover_url: cover }
    const { error } = await orgUpdate('blog_posts', { id }, payload)
    setSaving(false)
    if (!error) {
      setToast({ type: 'success', message: 'Post atualizado com sucesso.' })
      setTimeout(() => navigate('/admin/blog'), 800)
    } else {
      console.error('Erro ao atualizar post:', error)
      setToast({ type: 'error', message: 'Erro ao salvar post: ' + (error?.message || 'Falha desconhecida') })
    }
  }

  return (
    <div className="min-h-screen bg-body">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          {toast && (
            <div className={`fixed top-4 right-4 px-4 py-3 rounded-md shadow-sm text-white ${toast.type === 'error' ? 'bg-red-600' : toast.type === 'success' ? 'bg-green-600' : 'bg-orange-500'}`}>{toast.message}</div>
          )}
          <h1 className="font-poppins font-bold text-2xl text-primary mb-6">Editar Post</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-text-light mb-1">Título</label>
                <input value={form.title} onChange={e => onTitleChange(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm text-text-light mb-1">Slug</label>
                <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm text-text-light mb-1">Imagem de Capa (URL)</label>
                <input value={form.cover_url} onChange={e => setForm({ ...form, cover_url: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                <div className="mt-2">
                  <input type="file" accept="image/*" onChange={e => setCoverFile(e.target.files?.[0] || null)} />
                </div>
              </div>
              <div>
                <label className="block text-sm text-text-light mb-1">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md">
                  <option value="draft">Rascunho</option>
                  <option value="published">Publicado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-text-light mb-1">CTA • Texto</label>
                <input value={form.cta_text} onChange={e => setForm({ ...form, cta_text: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm text-text-light mb-1">CTA • Link</label>
                <input value={form.cta_link} onChange={e => setForm({ ...form, cta_link: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-text-light mb-1">Introdução</label>
                <textarea value={form.intro} onChange={e => setForm({ ...form, intro: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md h-24" />
              </div>
              <div>
                <label className="block text-sm text-text-light mb-1">Corpo (HTML básico permitido)</label>
                <textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md h-40" />
              </div>
              <div>
                <label className="block text-sm text-text-light mb-1">Conclusão</label>
                <textarea value={form.conclusion} onChange={e => setForm({ ...form, conclusion: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md h-24" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-light mb-1">Palavras-chave</label>
                  <input value={form.keywords} onChange={e => setForm({ ...form, keywords: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm text-text-light mb-1">Meta Descrição</label>
                  <input value={form.meta_description} onChange={e => setForm({ ...form, meta_description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <button onClick={save} disabled={saving} className="px-4 py-2 bg-primary text-white rounded-md">{saving ? 'Salvando...' : 'Salvar'}</button>
            <button onClick={() => navigate('/admin/blog')} className="px-4 py-2 bg-gray-200 text-primary rounded-md">Cancelar</button>
          </div>
        </main>
      </div>
    </div>
  )
}

