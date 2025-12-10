import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { getSupabase } from '../lib/supabaseClient'
import { ORG_ID } from '../lib/org'
import { getPlanMeta } from '../lib/plans'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [pendingPlan, setPendingPlan] = useState<string | null>(null)
  const [retryLoading, setRetryLoading] = useState(false)
  const showToast = (msg: string) => {
    setErrorMsg(msg)
    setTimeout(() => setErrorMsg(null), 5000)
  }

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
    } catch (e) {
      console.error('Erro ao inicializar Supabase:', e)
      showToast('Não foi possível inicializar a autenticação. Tente novamente.')
      setIsPending(false)
      return
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error('Erro de login Supabase:', error)
      const msg = (error as any)?.message || (error as any)?.error_description || 'Erro ao fazer login'
      showToast(msg)
      setIsPending(false)
      return
    }
    const user = data.user || (await supabase.auth.getUser()).data.user
    if (!user?.id) {
      setIsPending(false)
      showToast('Não foi possível identificar o usuário logado.')
      return
    }
    const { data: affRows, error: affErr } = await supabase
      .from('affiliates')
      .select('id,payment_status,plan')
      .eq('organization_id', ORG_ID)
      .eq('user_id', user.id)
      .limit(1)
    if (affErr) {
      console.error('Erro ao consultar status de pagamento:', affErr)
      setIsPending(false)
      showToast('Falha ao validar status de pagamento. Tente novamente.')
      return
    }
    const row = Array.isArray(affRows) ? affRows[0] : null
    const status = row?.payment_status || 'pending_payment'
    if (status === 'active') {
      setIsPending(false)
      navigate('/dashboard')
      return
    }
    setPendingPlan(row?.plan || 'assinante')
    setIsPending(false)
    showToast('Para acessar o escritório virtual é necessário ter um plano ativo.')
  }

  const handleRetryPayment = async () => {
    if (!email) {
      showToast('Informe seu email para prosseguir com o pagamento.')
      return
    }
    setRetryLoading(true)
    try {
      const supabase = getSupabase()
      const { data: userData } = await supabase.auth.getUser()
      const user = userData.user
      if (!user?.id) {
        throw new Error('Usuário não identificado')
      }
      const planMeta = getPlanMeta(pendingPlan)
      const resp = await fetch('/api/create-mp-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          organization_id: ORG_ID,
          plan_type: (pendingPlan || 'assinante'),
          title: planMeta.title,
          unit_price: planMeta.price,
          quantity: 1,
          email,
        })
      })
      const data = await resp.json()
      if (!resp.ok) {
        throw new Error(data?.error || 'Erro ao iniciar pagamento')
      }
      const redirectUrl = data?.init_point || data?.redirect_url
      if (redirectUrl) {
        window.location.href = redirectUrl
        return
      }
      showToast('Não foi possível obter o link de pagamento. Tente novamente.')
    } catch (e: any) {
      console.error('Erro no handleRetryPayment:', e?.message || e)
      showToast(e?.message || 'Erro ao processar pagamento')
    } finally {
      setRetryLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {errorMsg && (
          <div className="fixed top-4 right-4 bg-red-600 text-white px-4 py-3 rounded-md shadow-lg z-50">
            {errorMsg}
          </div>
        )}
        <div className="rounded-lg shadow-lg p-8" style={{ backgroundColor: '#104473' }}>
          {/* Logo */}
          <div className="text-center mb-8">
            <img 
              src="/Logo%20Oficial.png"
              alt="GUIA Empreendedor Digital"
              className="h-24 mx-auto mb-2 cursor-pointer"
              onClick={() => navigate('/')}
            />
            <div className="flex items-center justify-center gap-2 text-white">
              <Lock className="w-5 h-5 text-white" />
              <span className="font-medium text-white">Área Segura</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-poppins font-bold text-2xl text-white text-center mb-8">
            Acesse seu Escritório Virtual
          </h1>

          {/* Email/Senha */}
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handlePasswordLogin(); }}>
            <div>
              <label htmlFor="email" className="block text-white font-medium mb-2">Email</label>
              <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
            <div>
              <label htmlFor="password" className="block text-white font-medium mb-2">Senha</label>
              <div className="relative">
                <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#104473] hover:text-white" aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isPending} className="w-full bg-cta text-white py-3 rounded-md font-bold hover:bg-opacity-90 transition-all disabled:opacity-50">Entrar</button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center">
            <div className="text-white text-sm">
              Não tem conta?{' '}
              <button 
                onClick={() => navigate('/cadastro-guia-comercial')}
                className="text-white hover:underline font-medium"
              >
                Escolha seu plano
              </button>
            </div>
          </div>

          {/* Pagamento pendente */}
          {pendingPlan && (
            <div className="mt-6">
              <div className="bg-white/10 text-white p-4 rounded-md">
                <p className="mb-3 font-medium">Para acessar o escritório virtual é necessário ter um plano ativo.</p>
                <button
                  onClick={handleRetryPayment}
                  disabled={retryLoading}
                  className="w-full bg-cta text-white py-3 rounded-md font-bold hover:bg-opacity-90 transition-all disabled:opacity-50"
                >
                  Clique aqui para efetuar o pagamento do plano {getPlanMeta(pendingPlan).title}
                </button>
              </div>
            </div>
          )}
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
