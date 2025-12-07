import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getSupabase } from '@/react-app/lib/supabaseClient'
import { ORG_ID } from '@/react-app/lib/org'

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const [plan, setPlan] = useState<string>(searchParams.get('plan') || '')

  useEffect(() => {
    const load = async () => {
      const supabase = getSupabase()
      const { data: auth } = await supabase.auth.getUser()
      const uid = auth.user?.id
      if (!uid) return
      const { data } = await supabase
        .from('affiliates')
        .select('plan')
        .eq('organization_id', ORG_ID)
        .eq('user_id', uid)
        .maybeSingle()
      if (data?.plan) setPlan(data.plan)
    }
    load()
  }, [])

  const isAssinante = plan === 'assinante'

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="font-poppins font-bold text-2xl text-primary mb-4">Pagamento Confirmado!</h1>
        <p className="text-text-light mb-6">Estamos liberando seu acesso...</p>
        {isAssinante ? (
          <a href="/" className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-opacity-90 transition-all">Voltar ao Site Principal</a>
        ) : (
          <a href="/login" className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-opacity-90 transition-all">Acessar Escritório Virtual</a>
        )}
      </div>
    </div>
  )
}

