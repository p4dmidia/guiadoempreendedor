import { useEffect, useState } from 'react'
import { Copy } from 'lucide-react'
import { getSupabase } from '@/react-app/lib/supabaseClient'
import { orgSelect } from '@/react-app/lib/orgQueries'

type Affiliate = {
  id: number
  plan: 'assinante' | 'associado' | 'embaixador'
  referral_code: string | null
}

export default function ReferralCard() {
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const load = async () => {
      const supabase = getSupabase()
      const { data: u } = await supabase.auth.getUser()
      const uid = u.user?.id
      if (!uid) return
      const { data } = await orgSelect('affiliates', 'id, plan, referral_code').eq('user_id', uid).maybeSingle()
      let aff = data as Affiliate | null
      if (aff && !aff.referral_code) {
        const code = `REF-${uid.slice(0,8)}-${Math.random().toString(36).slice(2,6).toUpperCase()}`
        const { error } = await getSupabase()
          .from('affiliates')
          .update({ referral_code: code })
          .eq('id', aff.id)
        if (!error) {
          aff = { ...aff, referral_code: code }
        }
      }
      setAffiliate(aff)
    }
    load()
  }, [])

  if (!affiliate || !affiliate.referral_code) return null

  const link = `${window.location.origin}/cadastro?ref=${affiliate.referral_code}`
  const isAmbassador = affiliate.plan === 'embaixador'
  const title = isAmbassador ? 'Sua Rede de Expansão' : 'Link de Venda Direta'
  const text = isAmbassador
    ? 'Compartilhe este link para cadastrar novos parceiros na sua rede e ganhe comissões em até 3 níveis.'
    : 'Envie este link para interessados. Você ganha 10% de comissão na venda direta.'
  const waMessage = isAmbassador
    ? `Olá! Quero te convidar para fazer parte do Guia do Empreendedor e construir um negócio digital comigo. Cadastre-se aqui: ${link}`
    : `Olá! Descobri o Guia do Empreendedor e lembrei de você. Dá uma olhada nesse conteúdo: ${link}`

  const copy = async () => {
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="font-poppins font-semibold text-xl text-primary mb-2">{title}</h3>
      <p className="text-text-light mb-4">{text}</p>

      <div className="mb-4">
        <div className="text-sm text-text-light">Código de Indicação</div>
        <div className="font-poppins font-bold text-2xl text-primary tracking-wide">{affiliate.referral_code}</div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          value={link}
          readOnly
          className="flex-1 px-4 py-3 border border-gray-300 rounded-md bg-gray-50"
        />
        <button
          onClick={copy}
          className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
        >
          <Copy className="w-5 h-5" />
          {copied ? 'Copiado!' : 'Copiar Link'}
        </button>
        <a
          className="bg-accent text-white px-6 py-3 rounded-md font-medium hover:bg-opacity-90 transition-all text-center"
          href={`https://wa.me/?text=${encodeURIComponent(waMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Enviar no WhatsApp
        </a>
      </div>
    </div>
  )
}

