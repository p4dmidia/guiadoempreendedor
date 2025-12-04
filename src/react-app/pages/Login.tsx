import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { getSupabase } from '../lib/supabaseClient'
import { ORG_ID } from '../lib/org'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      try {
        const supabase = getSupabase()
        const { data } = await supabase.auth.getUser()
        setUserId(data.user?.id ?? null)
      } catch (_e) {
        setUserId(null)
      }
    }
    init()
  }, [])

  const handlePasswordLogin = async () => {
    setIsPending(true)
    let supabase
    try {
      supabase = getSupabase()
    } catch (_e) {
      setIsPending(false)
      return
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setIsPending(false)
      return
    }
    await supabase.auth.getSession()
    setIsPending(false)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <img 
              src="https://mocha-cdn.com/019ae075-432d-7f0b-9b71-b1650e85c237/Fundo-Escuro.png"
              alt="GUIA Empreendedor Digital"
              className="h-24 mx-auto mb-2 cursor-pointer"
              onClick={() => navigate('/')}
            />
            <div className="flex items-center justify-center gap-2 text-accent">
              <Lock className="w-5 h-5" />
              <span className="font-medium">Área Segura</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-poppins font-bold text-2xl text-primary text-center mb-8">
            Acesse seu Escritório Virtual
          </h1>

          {/* Email/Senha */}
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handlePasswordLogin(); }}>
            <div>
              <label htmlFor="email" className="block text-text-light font-medium mb-2">Email</label>
              <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
            <div>
              <label htmlFor="password" className="block text-text-light font-medium mb-2">Senha</label>
              <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
            <button type="submit" disabled={isPending} className="w-full bg-cta text-white py-3 rounded-md font-bold hover:bg-opacity-90 transition-all disabled:opacity-50">Entrar</button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center">
            <div className="text-text-light text-sm">
              Não tem conta?{' '}
              <button 
                onClick={() => navigate('/cadastro')}
                className="text-accent hover:underline font-medium"
              >
                Escolha seu plano
              </button>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button 
            onClick={() => navigate('/')}
            className="text-primary hover:text-accent transition-colors"
          >
            ← Voltar para página inicial
          </button>
        </div>
      </div>
    </div>
  );
}
