import { useNavigate } from 'react-router-dom'
import { LineChart as LineIcon, Users, DollarSign, Settings, LogOut, Percent } from 'lucide-react'
import { useState } from 'react'

export default function AdminSidebar() {
  const navigate = useNavigate()
  const logout = () => { window.location.href = '/admin/login' }
  return (
    <aside className="w-64 bg-primary text-white shadow-sm min-h-screen p-6 sticky top-0">
      {/* Logo with fallback text */}
      <SidebarLogo />
      <nav className="space-y-2">
        <button onClick={() => navigate('/admin/dashboard')} className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md bg-white/10 hover:bg-white/20"><LineIcon className="w-4 h-4" />Visão Geral</button>
        <button onClick={() => navigate('/admin/cupons')} className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10"><Percent className="w-4 h-4" />Cupons</button>
        <button onClick={() => navigate('/admin/afiliados')} className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10"><Users className="w-4 h-4" />Gerenciar Afiliados</button>
        <button onClick={() => navigate('/admin/saques')} className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10"><DollarSign className="w-4 h-4" />Financeiro / Saques</button>
        <button onClick={() => navigate('/admin/configuracoes')} className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10"><Settings className="w-4 h-4" />Configurações</button>
        <button onClick={logout} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-cta/20 text-cta w-full"><LogOut className="w-4 h-4" />Sair</button>
      </nav>
    </aside>
  )
}

function SidebarLogo() {
  const [failed, setFailed] = useState(false)
  const logoSrc = 'https://mocha-cdn.com/019ae075-432d-7f0b-9b71-b1650e85c237/Fundo-Escuro.png'
  return (
    <>
      {!failed && (
        <img src={logoSrc} alt="Guia Empreendedor Digital" className="mb-6" onError={() => setFailed(true)} />
      )}
      {failed && (
        <div className="font-poppins font-bold text-white text-xl mb-6">Admin • Guia</div>
      )}
    </>
  )
}

