import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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
    <nav className="bg-primary px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <img 
          src="https://mocha-cdn.com/019ae075-432d-7f0b-9b71-b1650e85c237/Fundo-Escuro.png" 
          alt="GUIA Empreendedor Digital"
          className="h-24 cursor-pointer"
          onClick={() => navigate('/')}
        />
        
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => scrollToSection('inicio')}
            className="text-white hover:text-accent transition-colors"
          >
            Início
          </button>
          <button 
            onClick={() => scrollToSection('beneficios')}
            className="text-white hover:text-accent transition-colors"
          >
            Benefícios
          </button>
          <button 
            onClick={() => scrollToSection('planos')}
            className="text-white hover:text-accent transition-colors"
          >
            Planos
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="border-2 border-white text-white px-6 py-2 rounded-md hover:bg-white hover:text-primary transition-all font-medium"
          >
            Área do Membro
          </button>
        </div>

        <button 
          className="md:hidden text-white"
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
        <div className="md:hidden mt-4 pt-4 border-t border-white/20">
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => { setMobileMenuOpen(false); scrollToSection('inicio'); }}
              className="text-white text-left hover:text-accent transition-colors"
            >
              Início
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); scrollToSection('beneficios'); }}
              className="text-white text-left hover:text-accent transition-colors"
            >
              Benefícios
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); scrollToSection('planos'); }}
              className="text-white text-left hover:text-accent transition-colors"
            >
              Planos
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
              className="border-2 border-white text-white px-6 py-2 rounded-md hover:bg-white hover:text-primary transition-all font-medium w-full text-left"
            >
              Área do Membro
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
