import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Youtube, Heart } from 'lucide-react'
export default function Footer() {
  return (
    <footer id="contato" className="bg-secondary text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <img 
              src="/Logo%20Oficial.png" 
              alt="GUIA Empreendedor Digital"
              className="h-24 mb-4"
            />
            <p className="text-gray-300 text-sm">
              Unindo empreendedores brasileiros, gerando oportunidades e moldando o futuro dos negócios no Brasil e no exterior por meio do digital.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a href="https://www.facebook.com/guiaempreendedordigital" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#104473] text-white hover:bg-[#104473] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/guia.empreendedordigital" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#104473] text-white hover:bg-[#104473] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/company/guia-portal-empreendedor" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#104473] text-white hover:bg-[#104473] transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/@guiaempreendedordigital" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#104473] text-white hover:bg-[#104473] transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="https://www.tiktok.com/@guiaempreendedordigital" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#104473] text-white hover:bg-[#104473] transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.5 6.5c1.2 1.2 2.7 1.9 4.5 2v3c-1.9-.1-3.4-.7-4.5-1.6v6.1c0 3.4-2.7 6-6.1 6-3.1 0-5.7-2.3-6-5.3-.4-3.7 2.5-6.7 6.1-6.7.5 0 1 .1 1.5.2v3.2c-.4-.2-.9-.3-1.5-.3-1.7 0-3.1 1.4-3.1 3.1s1.4 3 3.1 3c1.7 0 3.1-1.3 3.1-3V3h3.9c.2 1.4 1 2.7 2.1 3.5z"/>
                </svg>
              </a>
            </div>
          </div>
        
        

        
          
          <div>
            <h4 className="font-poppins font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-cta" /> contato@guiaportalempreendedor.com.br</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-cta" /> (11) 5196-5828</li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-cta" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 12.286c-.297-.149-1.758-.867-2.031-.967-.273-.099-.472-.149-.672.149-.198.297-.769.966-.943 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.476-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.149-.173.198-.297.298-.496.099-.198.05-.372-.025-.521-.075-.149-.672-1.621-.922-2.221-.243-.584-.487-.505-.672-.513l-.573-.01c-.198 0-.521.074-.794.372-.273.297-1.04 1.017-1.04 2.479 0 1.462 1.064 2.876 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.227 1.362.195 1.875.118.571-.085 1.758-.718 2.006-1.412.248-.694.248-1.289.173-1.412-.074-.124-.272-.198-.571-.347z"/>
                  <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.373 0 0 5.373 0 12c0 2.11.551 4.092 1.516 5.81L0 24l6.29-1.653A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12 0-3.193-1.243-6.167-3.48-8.52ZM12 22.08c-1.86 0-3.597-.54-5.061-1.468l-.363-.229-3.735.983.998-3.645-.237-.374A10.08 10.08 0 1 1 22.08 12 10.07 10.07 0 0 1 12 22.08Z"/>
                </svg>
                (11) 95808-0801
              </li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-cta" /> São Paulo, SP - Brasil</li>
            </ul>
            <a
              href="https://api.whatsapp.com/send/?text=Oi%2C+tudo+bem%3F+Lembrei+de+voc%C3%AA+e+pensei+que+essa+oportunidade+seria+perfeita+para+o+seu+neg%C3%B3cio%21+Estou+participando+de+um+projeto+incr%C3%ADvel+que+tem+ajudado+muitos+empreendedores+a+se+destacarem+no+digital%2C+atrair+mais+clientes+e+fazer+conex%C3%B5es+valiosas.+Ao+se+cadastrar+e+ter+sua+empresa+aprovada+no+Guia+Portal+Empreendedor%2C+voc%C3%AA+vai+ter+acesso+a+diversas+oportunidades+para+crescer+ainda+mais.+%2AE+o+melhor+de+tudo%3A+o+cadastro+%C3%A9+100%25+GRATUITO%21%2A+%2AImportante%3A%2A+N%C3%A3o+se+esque%C3%A7a+de+colocar+meu+nome+na+parte+de+%2AIndica%C3%A7%C3%A3o%2A+e+capriche+nas+informa%C3%A7%C3%B5es+e+na+%2Afoto+profissional%2A+%E2%80%93+ela+ser%C3%A1+sua+vitrine+para+atrair+novos+parceiros+e+clientes%21+D%C3%A1+uma+olhada+e+se+cadastra+aqui%3A+https%3A%2F%2Fwww.guiaportalempreendedor.com.br%2F&type=custom_url&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-cta hover:bg-cta text-white px-4 py-2 font-poppins"
              aria-label="Apoie Negócios Locais"
            >
              <Heart className="w-5 h-5" />
              Apoie Negócios Locais
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 text-gray-400 text-sm md:flex md:items-center md:justify-between">
          <p className="mb-4 md:mb-0">© 2025 Guia Portal Empreendedor. Todos os direitos reservados. Desenvolvido por P4D Mídia</p>
          <div className="space-x-4 text-right">
            <a href="https://www.guiaportalempreendedor.com.br/pg/termos-de-uso.html" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Termos de uso</a>
            <a href="https://www.guiaportalempreendedor.com.br/pg/politica-de-privacidade.html" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Políticas de Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
