import { useEffect, useMemo, useState } from 'react'
import { orgSelect, orgInsert, orgDelete } from '@/react-app/lib/orgQueries'
import { getSupabase } from '@/react-app/lib/supabaseClient'
import { ThumbsUp, MessageSquare, Trash2 } from 'lucide-react'

type Channel = { id: number | string; name: string; slug: string; read_only: boolean }
type PostRow = { id: number | string; channel_id: number | string; content: string; file_url?: string | null; author_role: 'admin'|'member'; affiliate_id?: number | null; is_pinned?: boolean; created_at: string }
type CommentRow = { id: number | string; author_name: string; content: string; created_at: string }

export default function CommunityFeed({ isAdmin, affiliateId }: { isAdmin: boolean; affiliateId?: number | null }) {
  const [channels, setChannels] = useState<Channel[]>([])
  const [current, setCurrent] = useState<string>('')
  const [posts, setPosts] = useState<PostRow[]>([])
  const [affiliateNames, setAffiliateNames] = useState<Record<string, string>>({})
  const [content, setContent] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [publishing, setPublishing] = useState(false)
  const [expComments, setExpComments] = useState<Record<string, boolean>>({})
  const [comments, setComments] = useState<Record<string, CommentRow[]>>({})
  const [likesCount, setLikesCount] = useState<Record<string, number>>({})
  const [likedByMe, setLikedByMe] = useState<Record<string, boolean>>({})
  const [toast, setToast] = useState<{ type: 'error'|'success'|'warn'; message: string } | null>(null)

  useEffect(() => {
    const init = async () => {
      const resCh: any = await (orgSelect('community_channels', 'id,name,slug,read_only') as any)
      const chs = ((resCh?.data as any) || []) as Channel[]
      if (!chs.length) {
        await orgInsert('community_channels', [
          { name: 'Avisos Oficiais', slug: 'avisos-oficiais', read_only: true },
          { name: 'Material de Apoio', slug: 'material-de-apoio', read_only: true },
          { name: 'Networking', slug: 'networking', read_only: false }
        ])
        const r2: any = await (orgSelect('community_channels', 'id,name,slug,read_only') as any)
        setChannels(((r2?.data as any) || []) as any)
      } else {
        setChannels(chs)
      }
    }
    init()
  }, [])

  useEffect(() => {
    if (!channels.length) return
    const avisos = channels.find(c => c.slug === 'avisos-oficiais')
    const first = (avisos?.id ?? channels[0].id) as any
    setCurrent(String(first))
  }, [channels])

  const currentChannel = useMemo(() => channels.find(c => String(c.id) === String(current)) || null, [channels, current])
  const canPost = !!currentChannel && (isAdmin || !currentChannel.read_only)

  const uploadFileIfNeeded = async () => {
    if (!file) return null
    const supabase = getSupabase()
    const name = `post-${Date.now()}-${Math.random().toString(36).slice(2)}.${file.name.split('.').pop()}`
    const { data, error } = await supabase.storage.from('community-files').upload(name, file)
    if (error) return null
    const { data: pub } = await supabase.storage.from('community-files').getPublicUrl(data.path)
    return pub.publicUrl
  }

  const loadPosts = async (channelId?: string) => {
    const id = channelId ?? current
    if (!id) return
    const res: any = await (orgSelect('community_posts', 'id,channel_id,content,file_url,author_role,affiliate_id,is_pinned,created_at') as any)
      .eq('channel_id', Number(id))
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
    const list = ((res?.data as any) || []) as PostRow[]
    setPosts(list)
    const ids = Array.from(new Set(list.map(p => p.affiliate_id).filter((v): v is number => typeof v === 'number')))
    if (ids.length) {
      const supabase = getSupabase()
      const { data } = await supabase.from('affiliates').select('id,full_name').in('id', ids)
      const map: Record<string, string> = {}
      (data || []).forEach((r: any) => { map[String(r.id)] = r.full_name })
      setAffiliateNames(map)
    } else {
      setAffiliateNames({})
    }
    await Promise.all(list.map(async (p) => {
      const rc: any = await (orgSelect('community_likes', 'id,affiliate_id') as any).eq('post_id', p.id)
      const arr = ((rc?.data as any) || []) as any[]
      setLikesCount(prev => ({ ...prev, [String(p.id)]: arr.length }))
      setLikedByMe(prev => ({ ...prev, [String(p.id)]: arr.some(r => String(r.affiliate_id) === String(affiliateId || '')) }))
    }))
  }

  useEffect(() => { if (current) loadPosts(current) }, [current])

  const publish = async () => {
    if (!currentChannel) return
    if (!canPost) { setToast({ type: 'warn', message: 'Apenas admins podem postar neste canal.' }); return }
    if (!content.trim()) { setToast({ type: 'warn', message: 'Escreva o conteúdo do post.' }); return }
    setPublishing(true)
    const fileUrl = await uploadFileIfNeeded()
    const payload = { channel_id: Number(current), content: content.trim(), file_url: fileUrl, author_role: (isAdmin ? 'admin' : 'member') as 'admin'|'member', affiliate_id: isAdmin ? null : (affiliateId || null) }
    const { error } = await orgInsert('community_posts', payload)
    setPublishing(false)
    if (!error) {
      setToast({ type: 'success', message: 'Post publicado.' })
      setContent('')
      setFile(null)
      await loadPosts(current)
    } else {
      console.error('Erro ao publicar post:', error)
      setToast({ type: 'error', message: 'Erro ao publicar: ' + (error?.message || 'Falha desconhecida') })
    }
  }

  const toggleLike = async (post: PostRow) => {
    if (!affiliateId) { setToast({ type: 'warn', message: 'Somente afiliados podem curtir.' }); return }
    const liked = likedByMe[String(post.id)]
    if (liked) {
      const { error } = await orgDelete('community_likes', { post_id: post.id, affiliate_id: affiliateId })
      if (!error) {
        setLikedByMe(prev => ({ ...prev, [String(post.id)]: false }))
        setLikesCount(prev => ({ ...prev, [String(post.id)]: Math.max(0, (prev[String(post.id)] || 0) - 1) }))
      }
    } else {
      const { error } = await orgInsert('community_likes', { post_id: post.id, affiliate_id: affiliateId })
      if (!error) {
        setLikedByMe(prev => ({ ...prev, [String(post.id)]: true }))
        setLikesCount(prev => ({ ...prev, [String(post.id)]: (prev[String(post.id)] || 0) + 1 }))
      }
    }
  }

  const loadComments = async (post: PostRow) => {
    const rc: any = await (orgSelect('community_comments', 'id,author_name,content,created_at') as any).eq('post_id', post.id).order('created_at', { ascending: false })
    setComments(prev => ({ ...prev, [String(post.id)]: ((rc?.data as any) || []) as CommentRow[] }))
  }

  const addComment = async (post: PostRow, text: string) => {
    const msg = text.trim()
    if (!msg) return
    const authorName = isAdmin ? 'Admin' : 'Membro'
    const { error } = await orgInsert('community_comments', { post_id: post.id, author_name: authorName, content: msg })
    if (!error) {
      await loadComments(post)
    }
  }

  return (
    <div>
      {toast && (
        <div className={`mb-4 px-4 py-3 rounded-md shadow-sm text-white ${toast.type === 'error' ? 'bg-red-600' : toast.type === 'success' ? 'bg-green-600' : 'bg-orange-500'}`}>{toast.message}</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="md:col-span-1 bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-poppins font-semibold text-primary mb-3">Canais</h3>
          <div className="space-y-2">
            {channels.map(c => (
              <button key={String(c.id)} onClick={() => { setCurrent(String(c.id)); loadPosts(String(c.id)) }} className={`w-full text-left px-3 py-2 rounded-md ${String(current) === String(c.id) ? 'bg-primary text-white' : 'bg-gray-100 text-primary hover:bg-gray-200'}`}>{c.name}</button>
            ))}
          </div>
        </aside>

        <main className="md:col-span-3">
          {canPost ? (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h3 className="font-poppins font-semibold text-primary mb-3">Novo Post</h3>
              <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="No que você está pensando ou o que deseja compartilhar?" className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md"></textarea>
              <div className="mt-3 flex items-center justify-between">
                <input type="file" accept="image/*,application/pdf" onChange={e => setFile(e.target.files?.[0] || null)} />
                <button onClick={publish} disabled={publishing} className="bg-cta text-white px-4 py-2 rounded-md hover:bg-opacity-90">{publishing ? 'Publicando...' : 'Publicar'}</button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 text-text-light">Apenas admins podem postar aqui.</div>
          )}

          <div className="space-y-4">
            {posts.map(p => (
              <div key={String(p.id)} className={`bg-white rounded-lg shadow-sm p-4 border ${p.is_pinned ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-text-light">{new Date(p.created_at).toLocaleString('pt-BR')}</div>
                    {p.author_role === 'admin' ? (
                      <div className="font-medium text-accent">ADMIN</div>
                    ) : (
                      <div className="font-medium text-primary">{affiliateNames[String(p.affiliate_id || '')] || 'Membro'}</div>
                    )}
                  </div>
                </div>
                <div className="mt-3 text-text">{p.content}</div>
                {p.file_url && (
                  p.file_url.match(/\.pdf($|\?)/i) ? (
                    <a href={p.file_url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-accent">Abrir PDF</a>
                  ) : (
                    <img src={p.file_url} alt="Anexo" className="mt-3 max-w-full rounded-lg shadow-sm" />
                  )
                )}
                <div className="mt-4 flex items-center gap-4">
                  <button onClick={() => toggleLike(p)} className={`flex items-center gap-2 px-3 py-2 rounded-md ${likedByMe[String(p.id)] ? 'bg-primary text-white' : 'bg-gray-100 text-primary hover:bg-gray-200'}`}>
                    <ThumbsUp className="w-4 h-4" />
                    Curtir ({likesCount[String(p.id)] || 0})
                  </button>
                  <button onClick={async () => { const opened = expComments[String(p.id)]; const next = !opened; setExpComments(prev => ({ ...prev, [String(p.id)]: next })); if (next) await loadComments(p) }} className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 text-primary hover:bg-gray-200">
                    <MessageSquare className="w-4 h-4" />
                    Comentários
                  </button>
                </div>
                {expComments[String(p.id)] && (
                  <div className="mt-4">
                    <div className="space-y-3 mb-3">
                      {(comments[String(p.id)] || []).map(c => (
                        <div key={String(c.id)} className="border border-gray-200 rounded-md p-3">
                          <div className="text-sm text-text-light">{new Date(c.created_at).toLocaleString('pt-BR')}</div>
                          <div className="font-medium text-primary">{c.author_name}</div>
                          <div className="text-text">{c.content}</div>
                        </div>
                      ))}
                      {(comments[String(p.id)] || []).length === 0 && (
                        <div className="text-text-light">Seja o primeiro a comentar</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="text" placeholder="Escreva um comentário" className="flex-1 px-3 py-2 border border-gray-300 rounded-md" onKeyDown={e => { if (e.key === 'Enter') { const v = (e.target as HTMLInputElement).value; addComment(p, v); (e.target as HTMLInputElement).value = '' } }} />
                      <button className="px-4 py-2 bg-primary text-white rounded-md">Enviar</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

