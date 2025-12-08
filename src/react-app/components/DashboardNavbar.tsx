import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, DollarSign, User, Home, MessageSquare } from 'lucide-react';

interface Member {
  plan: string;
  full_name: string;
}

interface DashboardNavbarProps {
  member: Member;
  onLogout: () => void;
}

export default function DashboardNavbar({ member, onLogout }: DashboardNavbarProps) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'assinante':
        return 'bg-blue-500';
      case 'associado':
        return 'bg-green-500';
      case 'embaixador':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <nav className="bg-primary px-6 py-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <img 
          src="https://mocha-cdn.com/019ae075-432d-7f0b-9b71-b1650e85c237/Fundo-Escuro.png" 
          alt="GUIA Empreendedor Digital"
          className="h-20 cursor-pointer"
          onClick={() => navigate('/')}
        />
        
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-3 text-white">
            <div className={`w-3 h-3 rounded-full ${getPlanColor(member.plan)}`}></div>
            <span className="font-medium">{member.full_name}</span>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-white hover:text-accent transition-colors"
          >
            <Home className="w-5 h-5" />
            Visão Geral
          </button>
          <button 
            onClick={() => navigate('/dashboard/financeiro')}
            className="flex items-center gap-2 text-white hover:text-accent transition-colors"
          >
            <DollarSign className="w-5 h-5" />
            Financeiro
          </button>
          {member.plan !== 'assinante' && (
            <button 
              onClick={() => navigate('/dashboard/comunidade')}
              className="flex items-center gap-2 text-white hover:text-accent transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              Comunidade
            </button>
          )}
          <button 
            onClick={() => navigate('/dashboard/perfil')}
            className="flex items-center gap-2 text-white hover:text-accent transition-colors"
          >
            <User className="w-5 h-5" />
            Meu Perfil
          </button>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 text-white hover:text-accent transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>

        <button 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-gray-700">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-white">
              <div className={`w-3 h-3 rounded-full ${getPlanColor(member.plan)}`}></div>
              <span className="font-medium">{member.full_name}</span>
            </div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-white hover:text-accent transition-colors"
            >
              <Home className="w-5 h-5" />
              Visão Geral
            </button>
            <button 
              onClick={() => navigate('/dashboard/financeiro')}
              className="flex items-center gap-2 text-white hover:text-accent transition-colors"
            >
              <DollarSign className="w-5 h-5" />
              Financeiro
            </button>
            {member.plan !== 'assinante' && (
              <button 
                onClick={() => navigate('/dashboard/comunidade')}
                className="flex items-center gap-2 text-white hover:text-accent transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                Comunidade
              </button>
            )}
            <button 
              onClick={() => navigate('/dashboard/perfil')}
              className="flex items-center gap-2 text-white hover:text-accent transition-colors"
            >
              <User className="w-5 h-5" />
              Meu Perfil
            </button>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 text-white hover:text-accent transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
