import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { orgSelect, orgInsert } from '@/react-app/lib/orgQueries'
import Navbar from '@/react-app/components/Navbar'
import Footer from '@/react-app/components/Footer'

type Post = {
  id: number
  title: string
  slug: string
  cover_url?: string | null
  intro?: string | null
  body?: string | null
  conclusion?: string | null
  cta_text?: string | null
  cta_link?: string | null
}

type CommentRow = { id: number; author_name: string; content: string; created_at: string }

export default function BlogPost() {
  const params = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<CommentRow[]>([])
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const contentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const load = async () => {
      const slug = params.slug as string
      const res: any = await (orgSelect('blog_posts', 'id,title,slug,cover_url,intro,body,conclusion,cta_text,cta_link') as any).eq('slug', slug).eq('status', 'published').maybeSingle()
      const data = (res?.data as any) || null
      if (!data || (typeof data === 'string' && (data as any)?.error)) { setPost(null); return }
      setPost(data as Post)
      const rc: any = await (orgSelect('blog_comments', 'id,author_name,content,created_at') as any).eq('post_id', data.id).order('created_at', { ascending: false })
      setComments(((rc?.data as any) || []) as any)
    }
    load()
  }, [params.slug])

  useEffect(() => {
    const root = contentRef.current
    if (!root) return
    const imgs = root.querySelectorAll('img')
    imgs.forEach((img: any) => {
      img.style.maxWidth = '100%'
      img.style.height = 'auto'
      img.classList.add('rounded-lg')
      img.classList.add('shadow-sm')
      img.classList.add('my-4')
    })
  }, [post])

  const shareWhatsApp = () => `https://wa.me/?text=${encodeURIComponent(`${post?.title} • ${window.location.href}`)}`
  const shareLinkedIn = () => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`

  const submitComment = async () => {
    if (!post) return
    if (!author.trim() || !content.trim()) return
    setSubmitting(true)
    const { error } = await orgInsert('blog_comments', { post_id: post.id, author_name: author, content })
    setSubmitting(false)
    if (!error) {
      setAuthor('')
      setContent('')
      const rc: any = await (orgSelect('blog_comments', 'id,author_name,content,created_at') as any).eq('post_id', post.id).order('created_at', { ascending: false })
      setComments(((rc?.data as any) || []) as any)
    }
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-body">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="text-text-light">Post não encontrado</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-body">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-poppins font-bold text-4xl text-primary mb-4">{post.title}</h1>
        {post.cover_url && <img src={post.cover_url} alt={post.title} className="w-full rounded-lg shadow-sm mb-6" />}
        {post.intro && <p className="text-lg italic text-text-light mb-6">{post.intro}</p>}
        {post.body && (
          <div className="prose max-w-none">
            <div ref={contentRef} dangerouslySetInnerHTML={{ __html: post.body }} />
          </div>
        )}

        {post.conclusion && (
          <div className="mt-8 p-6 bg-gray-100 rounded-lg">
            <div className="text-primary font-poppins font-semibold mb-2">Conclusão</div>
            <p className="text-text-light">{post.conclusion}</p>
          </div>
        )}

        {(post.cta_text && post.cta_link) && (
          <div className="mt-6 p-6 bg-secondary text-white rounded-lg flex items-center justify-between">
            <div className="font-poppins font-semibold">{post.cta_text}</div>
            <a href={post.cta_link} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white text-secondary rounded-md">Saiba Mais</a>
          </div>
        )}

        <div className="mt-6 flex items-center gap-3">
          <a href={shareWhatsApp()} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-accent text-white rounded-md">Compartilhar no WhatsApp</a>
          <a href={shareLinkedIn()} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-primary text-white rounded-md">Compartilhar no LinkedIn</a>
        </div>

        <div className="mt-10">
          <h3 className="font-poppins font-semibold text-2xl text-primary mb-4">Comentários</h3>
          <div className="space-y-4 mb-6">
            {comments.map(c => (
              <div key={c.id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="font-medium text-primary">{c.author_name}</div>
                <div className="text-sm text-text-light">{new Date(c.created_at).toLocaleString('pt-BR')}</div>
                <div className="mt-2 text-text">{c.content}</div>
              </div>
            ))}
            {comments.length === 0 && (
              <div className="text-text-light">Seja o primeiro a comentar</div>
            )}
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Seu nome" className="px-4 py-2 border border-gray-300 rounded-md" />
              <input value={content} onChange={e => setContent(e.target.value)} placeholder="Seu comentário" className="px-4 py-2 border border-gray-300 rounded-md" />
            </div>
            <div className="mt-3">
              <button onClick={submitComment} disabled={submitting} className="px-4 py-2 bg-primary text-white rounded-md">{submitting ? 'Enviando...' : 'Enviar Comentário'}</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

