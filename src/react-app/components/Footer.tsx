import { Mail, Phone, MapPin } from 'lucide-react'
export default function Footer() {
  return (
    <footer className="bg-secondary text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <img 
              src="https://mocha-cdn.com/019ae075-432d-7f0b-9b71-b1650e85c237/Fundo-Escuro.png" 
              alt="GUIA Empreendedor Digital"
              className="h-24 mb-4"
            />
            <p className="text-gray-300 text-sm">
              Unindo empreendedores brasileiros, gerando oportunidades e moldando o futuro dos negócios no Brasil e no exterior por meio do digital.
            </p>
          </div>
        
        <div>
          <h4 className="font-poppins font-semibold mb-4">Programa</h4>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><a href="#sobre" className="hover:text-accent transition-colors">Sobre</a></li>
            <li><a href="#beneficios" className="hover:text-accent transition-colors">Benefícios</a></li>
            <li><a href="#planos" className="hover:text-accent transition-colors">Níveis</a></li>
            <li><a href="#contato" className="hover:text-accent transition-colors">Contato</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-poppins font-semibold mb-4">Links Úteis</h4>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><a href="/" className="hover:text-accent transition-colors">Portal Principal</a></li>
            <li><a href="#planos" className="hover:text-accent transition-colors">Planos</a></li>
            <li><a href="/cadastro?plan=embaixador" className="hover:text-accent transition-colors">Embaixadores</a></li>
            <li><a href="#faq" className="hover:text-accent transition-colors">FAQ</a></li>
          </ul>
        </div>
          
          <div>
            <h4 className="font-poppins font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-accent" /> contato@guiaportalempreendedor.com.br</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-accent" /> (11) 5196-5828</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-accent" /> (11) 95808-0801</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-accent" /> São Paulo, SP - Brasil</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} GUIA Empreendedor Digital. Todos os direitos reservados. Desenvolvido por <a href="https://www.p4dmidia.com.br/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">P4D Mídia</a>
        </div>
      </div>
    </footer>
  );
}
