import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '@/react-app/components/AdminSidebar'
import { orgInsert } from '@/react-app/lib/orgQueries'
import { getSupabase } from '@/react-app/lib/supabaseClient'
import { ORG_ID } from '@/react-app/lib/org'

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

export default function AdminBlogNew() {
  const navigate = useNavigate()
  const [toast, setToast] = useState<{ type: 'error'|'success'|'warn'; message: string } | null>(null)
  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: '',
    subcategory: '',
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
    const { data: auth } = await getSupabase().auth.getUser()
    const author_id = auth?.user?.id || null
    const slug = (form.slug || '').trim() || slugify(form.title)
    const dataToSave = { 
      organization_id: ORG_ID, 
      author_id, 
      title: form.title, 
      slug, 
      category: form.category || null, 
      subcategory: form.subcategory || null, 
      cover_url: cover || null, 
      intro: form.intro || null, 
      body: form.body, 
      conclusion: form.conclusion || null, 
      keywords: form.keywords || null, 
      meta_description: form.meta_description || null, 
      cta_text: form.cta_text || null, 
      cta_link: form.cta_link || null, 
      status: form.status || 'draft' 
    }
    console.log('Payload Post:', dataToSave)
    const { error } = await orgInsert('blog_posts', dataToSave)
    setSaving(false)
    if (!error) {
      setToast({ type: 'success', message: 'Post salvo com sucesso.' })
      setTimeout(() => navigate('/admin/blog'), 800)
    } else {
      console.error('Erro ao salvar post:', error)
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
          <h1 className="font-poppins font-bold text-2xl text-primary mb-6">Novo Post</h1>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-light mb-1">Categoria</label>
                  <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Marketing Digital" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm text-text-light mb-1">Subcategoria</label>
                  <input value={form.subcategory} onChange={e => setForm({ ...form, subcategory: e.target.value })} placeholder="Tráfego Pago" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                </div>
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

