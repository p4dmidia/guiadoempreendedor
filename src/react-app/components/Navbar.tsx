import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LanguageSwitcher from '@/react-app/components/LanguageSwitcher';

export default function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-white px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <img 
          src="/Logo%20Oficial.png" 
          alt="GUIA Empreendedor Digital"
          className="h-24 cursor-pointer"
          onClick={() => navigate('/')}
        />
        
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => scrollToSection('sobre')}
            className="text-primary hover:text-accent transition-colors"
          >
            Sobre
          </button>
          <button 
            onClick={() => navigate('/embaixadores')}
            className="text-primary hover:text-accent transition-colors"
          >
            Embaixadores
          </button>
          <button 
            onClick={() => scrollToSection('proposito')}
            className="text-primary hover:text-accent transition-colors"
          >
            Benefícios
          </button>
          <button 
            onClick={() => scrollToSection('planos')}
            className="text-primary hover:text-accent transition-colors"
          >
            Níveis
          </button>
          <button 
            onClick={() => scrollToSection('contato')}
            className="text-primary hover:text-accent transition-colors"
          >
            Contato
          </button>
          <button 
            onClick={() => scrollToSection('niveis')}
            className="bg-[#104473] text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-all font-medium"
          >
            Assine agora
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="border-2 border-primary text-primary px-6 py-2 rounded-md hover:bg-primary hover:text-white transition-all font-medium"
          >
            Entrar
          </button>
          <LanguageSwitcher />
        </div>

        <button 
          className="md:hidden text-primary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label="Abrir menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-primary/20">
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => { setMobileMenuOpen(false); scrollToSection('sobre'); }}
              className="text-primary text-left hover:text-accent transition-colors"
            >
              Sobre
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); scrollToSection('beneficios'); }}
              className="text-primary text-left hover:text-accent transition-colors"
            >
              Benefícios
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); scrollToSection('planos'); }}
              className="text-primary text-left hover:text-accent transition-colors"
            >
              Níveis
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); scrollToSection('contato'); }}
              className="text-primary text-left hover:text-accent transition-colors"
            >
              Contato
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); navigate('/embaixadores'); }}
              className="text-primary text-left hover:text-accent transition-colors"
            >
              Embaixadores
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); scrollToSection('niveis'); }}
              className="bg-[#104473] text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-all font-medium w-full text-left"
            >
              Assine agora
            </button>
          <button 
            onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
            className="border-2 border-primary text-primary px-6 py-2 rounded-md hover:bg-primary hover:text-white transition-all font-medium w-full text-left"
          >
            Entrar
          </button>
          <div className="pt-2 border-t border-primary/20">
            <LanguageSwitcher />
          </div>
        </div>
        </div>
      )}
    </nav>
  );
}
