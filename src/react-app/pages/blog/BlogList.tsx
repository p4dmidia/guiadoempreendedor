import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { orgSelect } from '@/react-app/lib/orgQueries'
import Navbar from '@/react-app/components/Navbar'
import Footer from '@/react-app/components/Footer'

type Post = { id: number; title: string; slug: string; cover_url?: string | null; intro?: string | null; created_at: string }

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const load = async () => {
      const res: any = await (orgSelect('blog_posts', 'id, title, slug, cover_url, intro, created_at') as any)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
      setPosts(((res?.data as any) || []) as any)
    }
    load()
  }, [])

  const filtered = posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen bg-body">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="font-poppins font-bold text-3xl text-primary mb-6">Blog</h1>
        <div className="mb-6">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar pelo título" className="w-full max-w-xl px-4 py-2 border border-gray-300 rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map(p => (
            <div key={p.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {p.cover_url && <img src={p.cover_url} alt={p.title} className="w-full h-40 object-cover" />}
              <div className="p-5">
                <h2 className="font-poppins font-semibold text-xl text-primary mb-2">{p.title}</h2>
                <p className="text-text-light mb-4">{(p.intro || '').slice(0, 120)}...</p>
                <Link to={`/blog/${p.slug}`} className="inline-block bg-cta text-white px-4 py-2 rounded-md font-medium hover:bg-opacity-90 transition-all">Saiba Mais</Link>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-text-light">Nenhum post encontrado</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

