import { useEffect, useState } from 'react'
import AdminSidebar from '@/react-app/components/AdminSidebar'
import { orgSelect, orgInsert, orgDelete } from '@/react-app/lib/orgQueries'
import { getSupabase } from '@/react-app/lib/supabaseClient'
import { Trash2 } from 'lucide-react'

type Channel = { id: number | string; name: string; slug: string; read_only: boolean }
type PostRow = { id: number | string; channel_id: number | string; content: string; file_url?: string | null; author_role: string; is_pinned?: boolean; created_at: string }

export default function AdminCommunity() {
  const [channels, setChannels] = useState<Channel[]>([])
  const [posts, setPosts] = useState<PostRow[]>([])
  const [form, setForm] = useState<{ channel_id: number | string | null; content: string; is_pinned: boolean }>({ channel_id: null, content: '', is_pinned: false })
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [toast, setToast] = useState<{ type: 'error'|'success'|'warn'; message: string } | null>(null)

  useEffect(() => {
    const init = async () => {
      const resCh: any = await (orgSelect('community_channels', 'id,name,slug,read_only') as any)
      const chs = ((resCh?.data as any) || []) as Channel[]
      if (!chs.length) {
        const created = await orgInsert('community_channels', [
          { name: 'Avisos Oficiais', slug: 'avisos-oficiais', read_only: true },
          { name: 'Material de Apoio', slug: 'material-de-apoio', read_only: true },
          { name: 'Networking', slug: 'networking', read_only: false }
        ])
        if ((created as any)?.error) {
          setToast({ type: 'warn', message: 'Nenhum canal encontrado. Clique para criar canais padrão.' })
          setChannels([])
        } else {
          const r2: any = await (orgSelect('community_channels', 'id,name,slug,read_only') as any)
          const arr = ((r2?.data as any) || []) as Channel[]
          setChannels(arr)
        }
      } else {
        setChannels(chs)
      }
      await loadPosts()
      setLoading(false)
    }
    init()
  }, [])

  const loadPosts = async () => {
    const res: any = await (orgSelect('community_posts', 'id,channel_id,content,file_url,author_role,is_pinned,created_at') as any)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
    setPosts(((res?.data as any) || []) as any)
  }

  useEffect(() => {
    if (channels.length && !form.channel_id) {
      setForm(prev => ({ ...prev, channel_id: Number(channels[0].id) }))
    }
  }, [channels])

  const createDefaultChannels = async () => {
    const created = await orgInsert('community_channels', [
      { name: 'Avisos Oficiais', slug: 'avisos-oficiais', read_only: true },
      { name: 'Material de Apoio', slug: 'material-de-apoio', read_only: true },
      { name: 'Networking', slug: 'networking', read_only: false }
    ])
    if ((created as any)?.error) {
      setToast({ type: 'error', message: 'Erro ao criar canais: ' + ((created as any)?.error?.message || 'Falha desconhecida') })
      return
    }
    const r2: any = await (orgSelect('community_channels', 'id,name,slug,read_only') as any)
    const arr = ((r2?.data as any) || []) as Channel[]
    setChannels(arr)
    setToast({ type: 'success', message: 'Canais criados.' })
  }

  const uploadFileIfNeeded = async () => {
    if (!file) return null
    const supabase = getSupabase()
    const name = `post-${Date.now()}-${Math.random().toString(36).slice(2)}.${file.name.split('.').pop()}`
    const { data, error } = await supabase.storage.from('community-files').upload(name, file)
    if (error) return null
    const { data: pub } = await supabase.storage.from('community-files').getPublicUrl(data.path)
    return pub.publicUrl
  }

  const publish = async () => {
    if (!form.channel_id) { setToast({ type: 'warn', message: 'Selecione um canal.' }); return }
    if (!form.content.trim()) { setToast({ type: 'warn', message: 'Escreva o conteúdo do post.' }); return }
    setPublishing(true)
    const fileUrl = await uploadFileIfNeeded()
    const payload = { channel_id: Number(form.channel_id), content: form.content.trim(), file_url: fileUrl, author_role: 'admin', is_pinned: form.is_pinned }
    const { error } = await orgInsert('community_posts', payload)
    setPublishing(false)
    if (!error) {
      setToast({ type: 'success', message: 'Post publicado.' })
      setForm({ channel_id: null, content: '', is_pinned: false })
      setFile(null)
      await loadPosts()
    } else {
      console.error('Erro ao publicar post:', error)
      setToast({ type: 'error', message: 'Erro ao publicar: ' + (error?.message || 'Falha desconhecida') })
    }
  }

  const removePost = async (row: PostRow) => {
    const { error } = await orgDelete('community_posts', { id: row.id })
    if (!error) {
      setPosts(prev => prev.filter(p => p.id !== row.id))
    }
  }

  const channelName = (id: number | string) => channels.find(c => String(c.id) === String(id))?.name || '—'

  if (loading) {
    return (
      <div className="min-h-screen bg-body flex items-center justify-center">
        <div className="text-text-light">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-body">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          {toast && (
            <div className={`fixed top-4 right-4 px-4 py-3 rounded-md shadow-sm text-white ${toast.type === 'error' ? 'bg-red-600' : toast.type === 'success' ? 'bg-green-600' : 'bg-orange-500'}`}>{toast.message}</div>
          )}
          <h1 className="font-poppins font-bold text-2xl text-primary mb-6">Comunidade</h1>

          {channels.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between">
              <div className="text-text-light">Nenhum canal encontrado.</div>
              <button onClick={createDefaultChannels} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90">Criar Canais Padrão</button>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm text-text-light mb-1">Canal</label>
                <select value={String(form.channel_id || '')} onChange={e => setForm({ ...form, channel_id: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="">Selecione</option>
                  {channels.map(c => (
                     <option key={String(c.id)} value={String(c.id)}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-text-light mb-1">Conteúdo</label>
                <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="No que você está pensando ou o que deseja compartilhar?" className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md"></textarea>
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm text-text-light mb-1">Anexo (imagem/PDF)</label>
                <input type="file" accept="image/*,application/pdf" onChange={e => setFile(e.target.files?.[0] || null)} />
                <div className="mt-3 flex items-center gap-2">
                  <input id="pin" type="checkbox" checked={form.is_pinned} onChange={e => setForm({ ...form, is_pinned: e.target.checked })} />
                  <label htmlFor="pin" className="text-sm text-text-light">Fixar Post</label>
                </div>
                <button onClick={publish} disabled={publishing} className="mt-4 w-full bg-cta text-white px-4 py-2 rounded-md hover:bg-opacity-90">
                  {publishing ? 'Publicando...' : 'Publicar'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <h2 className="font-poppins font-semibold text-lg text-primary">Posts</h2>
            </div>
            <div>
              {posts.length === 0 && (
                <div className="p-6 text-text-light">Nenhum post ainda</div>
              )}
              {posts.map(p => (
                <div key={String(p.id)} className="p-6 border-b">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm text-text-light">{channelName(p.channel_id)} • {new Date(p.created_at).toLocaleString('pt-BR')}</div>
                      <div className="mt-1 text-primary">{p.author_role === 'admin' ? 'Admin' : 'Afiliado'}</div>
                    </div>
                    <button onClick={() => removePost(p)} className="text-red-600 hover:text-red-700 flex items-center gap-1"><Trash2 className="w-4 h-4" />Excluir</button>
                  </div>
                  <div className="mt-3 text-text">{p.content}</div>
                  {p.file_url && (
                    p.file_url.match(/\.pdf($|\?)/i) ? (
                      <a href={p.file_url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-accent">Abrir PDF</a>
                    ) : (
                      <img src={p.file_url} alt="Anexo" className="mt-3 max-w-full rounded-lg shadow-sm" />
                    )
                  )}
                  {p.is_pinned && (
                    <div className="mt-2 inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs">Fixado</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
