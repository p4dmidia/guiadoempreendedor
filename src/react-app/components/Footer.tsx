export default function Footer() {
  return (
    <footer className="bg-secondary text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <img 
              src="https://mocha-cdn.com/019ae075-432d-7f0b-9b71-b1650e85c237/Fundo-Escuro.png" 
              alt="GUIA Empreendedor Digital"
              className="h-24 mb-4"
            />
            <p className="text-gray-300 text-sm">
              O ecossistema oficial de crescimento do empreendedor brasileiro.
            </p>
          </div>
          
          <div>
            <h4 className="font-poppins font-semibold mb-4">Links Úteis</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><a href="#" className="hover:text-accent transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Política de Privacidade</a></li>
              <li><a href="/blog" className="hover:text-accent transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-poppins font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>contato@guiaempreendedor.com.br</li>
              <li>(11) 99999-9999</li>
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
