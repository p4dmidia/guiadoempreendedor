import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/react-app/auth/AuthProvider'
import DashboardNavbar from '@/react-app/components/DashboardNavbar'
import { getSupabase } from '@/react-app/lib/supabaseClient'
import { ORG_ID } from '@/react-app/lib/org'
import { orgUpdate } from '@/react-app/lib/orgQueries'

type AffRow = {
  id: number
  full_name: string
  email: string
  whatsapp?: string | null
  cpf?: string | null
  pix_key?: string | null
}

export default function Perfil() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [member, setMember] = useState<{ plan: string; full_name: string } | null>(null)
  const [affId, setAffId] = useState<number | null>(null)
  const [form, setForm] = useState<{ full_name: string; whatsapp: string; email: string; cpf: string; pix_key: string; pix_type: string }>({
    full_name: '', whatsapp: '', email: '', cpf: '', pix_key: '', pix_type: 'Email'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = getSupabase()
      const { data: auth } = await supabase.auth.getUser()
      const uid = auth.user?.id
      if (!uid) { navigate('/login'); return }
      const { data: aff } = await supabase
        .from('affiliates')
        .select('id, full_name, email, whatsapp, cpf, pix_key, plan')
        .eq('organization_id', ORG_ID)
        .eq('user_id', uid)
        .maybeSingle()
      if (!aff) { navigate('/cadastro'); return }
      setAffId(aff.id)
      setMember({ plan: aff.plan, full_name: aff.full_name })
      setForm({
        full_name: aff.full_name || '',
        whatsapp: aff.whatsapp || '',
        email: aff.email || '',
        cpf: aff.cpf || '',
        pix_key: aff.pix_key || '',
        pix_type: 'Email'
      })
      setLoading(false)
    }
    load()
  }, [navigate])

  const handleChange = (key: keyof typeof form, val: string) => {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  const save = async () => {
    if (!affId) return
    const payload: Partial<AffRow> & { pix_type?: string } = {
      full_name: form.full_name,
      whatsapp: form.whatsapp,
      pix_key: form.pix_key,
    }
    let { error } = await orgUpdate('affiliates', { id: affId }, payload as any)
    if (error) {
      alert('Erro ao salvar perfil');
      return
    }
    alert('Perfil atualizado com sucesso!')
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  if (loading || !member) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-text-light">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-body">
      <DashboardNavbar member={member} onLogout={handleLogout} />
      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="font-poppins font-bold text-2xl text-primary mb-6">Meu Perfil</h1>
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="font-poppins font-semibold text-lg text-primary mb-4">Dados Pessoais</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-text-light font-medium mb-2">Nome Completo</label>
              <input value={form.full_name} onChange={e => handleChange('full_name', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-text-light font-medium mb-2">WhatsApp</label>
              <input value={form.whatsapp} onChange={e => handleChange('whatsapp', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="(11) 99999-9999" />
            </div>
            <div>
              <label className="block text-text-light font-medium mb-2">Email</label>
              <input value={form.email} disabled className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100" />
            </div>
            <div>
              <label className="block text-text-light font-medium mb-2">CPF</label>
              <input value={form.cpf} disabled className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-poppins font-semibold text-lg text-primary mb-4">Dados Bancários</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-text-light font-medium mb-2">Tipo de Chave Pix</label>
              <select value={form.pix_type} onChange={e => handleChange('pix_type', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md">
                <option>CPF</option>
                <option>Email</option>
                <option>Telefone</option>
                <option>Aleatória</option>
              </select>
            </div>
            <div>
              <label className="block text-text-light font-medium mb-2">Chave Pix</label>
              <input value={form.pix_key} onChange={e => handleChange('pix_key', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
            </div>
          </div>
          <div className="mt-6">
            <button onClick={save} className="px-6 py-3 bg-cta text-white rounded-md font-medium hover:bg-opacity-90 transition-all">Salvar Alterações</button>
            <button onClick={() => alert('Em breve: alteração de senha')} className="ml-3 px-6 py-3 bg-gray-200 text-primary rounded-md font-medium hover:bg-gray-300 transition-all">Alterar Senha</button>
          </div>
        </div>
      </div>
    </div>
  )
}

