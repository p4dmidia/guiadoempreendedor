import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Lock, ArrowRight } from 'lucide-react';
import type { User } from '@supabase/supabase-js'
import { getSupabase } from '../lib/supabaseClient'
import { orgSelect } from '../lib/orgQueries'
import { ORG_ID } from '../lib/org'

const PLANS = {
  assinante: {
    name: 'Assinante',
    price: 'R$ 997,00',
    benefits: [
      'Página Catálogo Profissional',
      'Destaque nas Buscas',
      'Acesso à Comunidade'
    ]
  },
  associado: {
    name: 'Associado',
    price: 'R$ 2.497,00',
    benefits: [
      'Tudo do Plano Assinante',
      'Destaque na Home',
      'Link de Indicação (10%)',
      'Escritório Virtual'
    ]
  },
  embaixador: {
    name: 'Embaixador',
    price: 'R$ 3.997,00',
    benefits: [
      'Tudo do Plano Associado',
      'Painel Global de Negócios',
      'Ganhos em 3 Níveis',
      'Divulgação de Eventos'
    ]
  }
};

export default function Cadastro() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<User | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [planKey, setPlanKey] = useState<string>(searchParams.get('plan') || 'associado')
  const selectedPlan = PLANS[planKey as keyof typeof PLANS] || PLANS.associado;
  const referralCode = searchParams.get('ref');
  const [refCode, setRefCode] = useState<string>(referralCode || '')
  const [referrerName, setReferrerName] = useState<string>('')
  const [buttonLabel, setButtonLabel] = useState('Ir para Pagamento Seguro')
  const [couponCode, setCouponCode] = useState('')
  const [appliedPrice, setAppliedPrice] = useState<string | null>(null)
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null)
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null)

  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    pix: '',
    endereco: '',
    email: '',
    password: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const supabase = getSupabase()
        await supabase.auth.signOut()
        const { data } = await supabase.auth.getUser()
        setUser(data.user ?? null)
      } catch (_e) {
        setUser(null)
      }
    }
    init()
    const loadReferrer = async () => {
      if (referralCode) {
        const res: any = await (orgSelect('affiliates', 'full_name') as any).eq('referral_code', referralCode).maybeSingle()
        const data = res?.data as any
        if (data && typeof data === 'object' && 'full_name' in data) setReferrerName(String(data.full_name))
      }
    }
    loadReferrer()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let supabase
    try {
      supabase = getSupabase()
    } catch (_e) {
      setIsSubmitting(false)
      alert('Configuração do Supabase ausente. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.')
      return
    }
    await supabase.auth.signOut()
    const { data: newAuthData, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password
    })
    if (signUpError) {
      setIsSubmitting(false)
      alert('Erro ao criar conta. Verifique seu email/senha.')
      return
    }
    let uid = newAuthData.user?.id || newAuthData.session?.user?.id || null
    if (!uid) {
      await supabase.auth.signInWithPassword({ email: formData.email, password: formData.password })
      const { data: u2 } = await supabase.auth.getUser()
      uid = u2.user?.id || null
    }
    if (!uid) {
      setIsSubmitting(false)
      alert('Não foi possível obter o usuário após cadastro.')
      return
    }

    setIsSubmitting(true);

    try {
      const supabaseClient = getSupabase()
      const wait = (ms: number) => new Promise(res => setTimeout(res, ms))
      let updated = false
      for (let i = 0; i < 3 && !updated; i++) {
        const { error: profileError } = await supabaseClient
          .from('profiles')
          .update({ organization_id: ORG_ID, full_name: formData.nome, role: 'member' })
          .eq('id', uid)
        if (profileError) {
          alert('Erro ao atualizar seu perfil. Tente novamente.')
          setIsSubmitting(false)
          return
        }
        updated = true
        if (!updated) await wait(300)
      }

      const now = new Date()
      const end = new Date(now)
      end.setFullYear(end.getFullYear() + 1)

      // garantir referral_code único por organização
      let referralCodeValue: string | null = null
      const { data: existingAff } = await supabaseClient
        .from('affiliates')
        .select('id, referral_code')
        .eq('organization_id', ORG_ID)
        .eq('user_id', uid)
        .maybeSingle()
      if (existingAff?.referral_code) {
        referralCodeValue = existingAff.referral_code
      } else {
        referralCodeValue = `REF-${uid.slice(0,8)}-${Math.random().toString(36).slice(2,6).toUpperCase()}`
      }

      const { data: affRow, error } = await supabaseClient
        .from('affiliates')
        .upsert([
          {
            organization_id: ORG_ID,
            user_id: uid,
            plan: planKey,
            full_name: formData.nome,
            email: formData.email,
            cpf: formData.cpf,
            pix_key: formData.pix,
            address: formData.endereco,
            referred_by_code: refCode || null,
            referral_code: referralCodeValue,
            subscription_start_date: now.toISOString(),
            subscription_end_date: end.toISOString()
          }
        ], { onConflict: 'organization_id,user_id' })
        .select('id')
        .maybeSingle()

      if (error) {
        alert('Erro ao criar cadastro. Tente novamente.')
      } else {
        setButtonLabel('Gerando link de pagamento...')
        const title = `Plano ${selectedPlan.name}`
        const unit_price = (() => {
          let s = String(selectedPlan.price)
          s = s.replace(/[R$\s]/gi, '')
          if (s.includes('.') && s.includes(',')) {
            s = s.replace(/\./g, '').replace(',', '.')
          } else {
            s = s.replace(',', '.')
          }
          const n = parseFloat(s)
          return isNaN(n) ? 0 : n
        })()

        const finalUnitPrice = discountedPrice != null ? discountedPrice : (() => {
          let s = String(selectedPlan.price)
          s = s.replace(/[R$\s]/gi, '')
          if (s.includes('.') && s.includes(',')) {
            s = s.replace(/\./g, '').replace(',', '.')
          } else {
            s = s.replace(',', '.')
          }
          const n = parseFloat(s)
          return isNaN(n) ? 0 : n
        })()

        if (finalUnitPrice <= 0) {
          const supabaseClient2 = getSupabase()
          await supabaseClient2
            .from('affiliates')
            .update({ payment_status: 'active', status: 'active' })
            .eq('organization_id', ORG_ID)
            .eq('user_id', uid)
          await supabaseClient2
            .from('orders')
            .insert([{ organization_id: ORG_ID, user_id: uid, amount: 0, status: 'paid', coupon_id: appliedCoupon?.id || null }])
          if (appliedCoupon?.id) {
            await supabaseClient2
              .from('coupons')
              .update({ used_count: Number(appliedCoupon.used_count || 0) + 1 })
              .eq('organization_id', ORG_ID)
              .eq('id', appliedCoupon.id)
          }
          if (planKey === 'assinante') {
            navigate('/')
          } else {
            navigate('/login')
          }
          return
        }

        const prefResp = await fetch('/api/create-mp-preference', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            unit_price: finalUnitPrice,
            quantity: 1,
            email: formData.email,
            user_id: uid,
            plan_type: planKey,
            organization_id: ORG_ID,
            couponCode: couponCode.trim().toUpperCase()
          }),
        })
        const data = await prefResp.json()
        console.log('RESPOSTA MP:', data)
        if (!prefResp.ok) {
          console.error('Erro MP:', data)
          alert(`Erro MP: ${data?.error || (data?.details ? JSON.stringify(data.details) : 'Falha desconhecida')}`)
        } else if (data?.status === 'free_approved' && data?.redirect_url) {
          if (planKey === 'assinante') {
            window.location.href = '/'
          } else {
            window.location.href = '/login'
          }
        } else if (data && data.init_point) {
          window.location.href = data.init_point
        } else {
          console.error('Link de pagamento não encontrado:', data)
          alert('Erro: A API não retornou o link de pagamento.')
        }
      }
    } catch (_error) {
      alert('Erro ao gerar pagamento')
    } finally {
      setIsSubmitting(false)
      setButtonLabel('Ir para Pagamento Seguro')
    }
  };

  const applyCoupon = async () => {
    const code = couponCode.trim().toUpperCase()
    if (!code) { setAppliedPrice(null); setDiscountedPrice(null); setAppliedCoupon(null); return }
    const supabase = getSupabase()
    const { data: c } = await supabase
      .from('coupons')
      .select('id,code,type,value,valid_until,max_uses,used_count,status')
      .eq('organization_id', ORG_ID)
      .eq('code', code)
      .maybeSingle()
    if (!c) { alert('Cupom não encontrado'); return }
    const nowIso = new Date().toISOString()
    const validDate = !c.valid_until || (new Date(c.valid_until).toISOString() >= nowIso)
    const validUses = !c.max_uses || (Number(c.used_count || 0) < Number(c.max_uses))
    const isActive = c.status !== 'inactive'
    if (!(isActive && validDate && validUses)) { alert('Cupom inválido ou expirado'); return }
    let s = String(selectedPlan.price)
    s = s.replace(/[R$\s]/gi, '')
    if (s.includes('.') && s.includes(',')) { s = s.replace(/\./g, '').replace(',', '.') } else { s = s.replace(',', '.') }
    let base = parseFloat(s); if (isNaN(base)) base = 0
    let newPrice = base
    if (c.type === 'percentage') { newPrice = Math.max(0, base * (1 - Number(c.value) / 100)) } else { newPrice = Math.max(0, base - Number(c.value)) }
    const formatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(newPrice)
    setAppliedPrice(formatted)
    setDiscountedPrice(newPrice)
    setAppliedCoupon(c)
    alert('Cupom aplicado!')
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLoginAndContinue = async () => {}

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div 
            className="font-poppins font-bold text-3xl text-primary mb-2 cursor-pointer inline-block"
            onClick={() => navigate('/')}
          >
            GUIA Empreendedor Digital
          </div>
          <p className="text-text-light">Finalize seu cadastro e comece a crescer</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Resumo do Pedido */}
          <div className="bg-white rounded-lg shadow-lg p-8 h-fit">
            <h2 className="font-poppins font-bold text-2xl text-primary mb-6">
              Resumo do Pedido
            </h2>
            
            <div className="mb-6 p-4 bg-body rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Você escolheu:</div>
              <div className="font-poppins font-bold text-2xl text-primary">
                Plano {selectedPlan.name}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-text-light font-medium">Valor Total:</span>
                <span className="font-poppins font-bold text-3xl text-primary">
                  {appliedPrice ? appliedPrice : selectedPlan.price}
                </span>
              </div>
              <div className="text-sm text-gray-600">Cobrança anual</div>
              <div className="mt-3">
                <div className="flex gap-2">
                  <input value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="Possui Cupom?" className="px-4 py-2 border border-gray-300 rounded-md uppercase" />
                  <button type="button" onClick={applyCoupon} className="px-4 py-2 bg-cta text-white rounded-md hover:bg-opacity-90">Aplicar</button>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-poppins font-semibold text-lg text-primary mb-4">
                Benefícios Inclusos:
              </h3>
              <ul className="space-y-3">
                {selectedPlan.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-text-light">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 p-4 bg-accent bg-opacity-10 rounded-lg border border-accent">
              <div className="flex items-start gap-2 text-sm text-primary">
                <Lock className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold mb-1">Ambiente 100% Seguro</div>
                  <div className="text-text-light">
                    Seus dados são protegidos com criptografia de ponta a ponta.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="font-poppins font-bold text-2xl text-primary mb-6">
              Dados Cadastrais
            </h2>
            <div className="mb-4">
              <div className="flex gap-2">
                {(['assinante','associado','embaixador'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlanKey(p)}
                    className={`px-4 py-2 rounded-md border ${planKey===p ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-gray-300'} font-medium`}
                  >
                    {PLANS[p].name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="nome" className="block text-text-light font-medium mb-2">
                    Nome Completo *
                  </label>
                  <input
                    id="nome"
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleChange('nome', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-text-light font-medium mb-2">
                    E-mail *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="seuemail@empresa.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-text-light font-medium mb-2">
                    Senha *
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Crie uma senha segura"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="cpf" className="block text-text-light font-medium mb-2">CPF *</label>
                  <input
                    id="cpf"
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => handleChange('cpf', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="000.000.000-00"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="pix" className="block text-text-light font-medium mb-2">Chave Pix *</label>
                  <input
                    id="pix"
                    type="text"
                    value={formData.pix}
                    onChange={(e) => handleChange('pix', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="email, telefone ou aleatória"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="endereco" className="block text-text-light font-medium mb-2">Endereço *</label>
                  <input
                    id="endereco"
                    type="text"
                    value={formData.endereco}
                    onChange={(e) => handleChange('endereco', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Rua, número, bairro, cidade"
                    required
                  />
                </div>



                <div>
                  <label htmlFor="refcode" className="block text-text-light font-medium mb-2">
                    Código de Indicação
                  </label>
                  <input
                    id="refcode"
                    type="text"
                    value={refCode}
                    onChange={(e) => setRefCode(e.target.value)}
                    readOnly={Boolean(referralCode)}
                    className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${referralCode ? 'bg-gray-100 border-gray-300 text-gray-700' : 'border-gray-300'}`}
                  />
                  {referralCode && referrerName && (
                    <p className="text-sm text-green-600 mt-1">Você está sendo indicado por: {referrerName}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-cta text-white py-4 rounded-md font-bold hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group mt-8 disabled:opacity-50"
                >
                  {buttonLabel}
                  {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </button>

                <div className="flex items-center gap-2 justify-center text-sm text-gray-600 mt-4">
                  <Lock className="w-4 h-4" />
                  <span>Ambiente Criptografado. Acesso liberado após confirmação</span>
                </div>
              </form>
            
            </div>
          </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
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
