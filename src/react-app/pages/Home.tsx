import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Eye, Users, TrendingUp, Check, User, Crown, ArrowRight, ArrowDown, Layers, ChevronsUp, X, ShieldCheck, Lock, Headphones, Target, Zap, CreditCard, Scale, LayoutDashboard, RefreshCw } from 'lucide-react';
import Navbar from '@/react-app/components/Navbar';
import Footer from '@/react-app/components/Footer';
import FAQSection from '@/react-app/components/FAQSection';

export default function Home() {
  const navigate = useNavigate();

  const scrollToPlanos = () => {
    const element = document.getElementById('planos');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const scrollToSobre = () => {
    const element = document.getElementById('sobre');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const scrollToBeneficios = () => {
    const element = document.getElementById('beneficios');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const ref = params.get('ref')
      if (ref && ref.trim()) {
        localStorage.setItem('referral_code', ref.trim())
      }
    } catch {}
  }, [])

  return (
    <div className="min-h-screen font-poppins">
      <Navbar />
      

      



      {/* Nossa Essência Section (removida) */}
      {false && (
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center bg-cta text-white px-4 py-2 rounded-md font-semibold">Nossa Essência</span>
          </div>
          <h2 className="font-poppins font-bold text-3xl md:text-4xl text-primary text-center mb-2">Fundamentos que nos Movem</h2>
          <p className="text-center text-text-light mb-12 text-lg">Os princípios que guiam o Programa Conexão Empresarial</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-body rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold">01</div>
                <h3 className="font-poppins font-semibold text-lg text-primary">Networking Verdadeiro</h3>
              </div>
              <p className="text-text-light">Conexões reais e duradouras entre empresários que buscam crescimento mútuo, não apenas troca de cartões.</p>
            </div>

            <div className="bg-body rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold">02</div>
                <h3 className="font-poppins font-semibold text-lg text-primary">Visibilidade Estratégica</h3>
              </div>
              <p className="text-text-light">Posicionamento onde o seu mercado realmente procura, com ferramentas e suporte para destacar seu negócio.</p>
            </div>

            <div className="bg-body rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold">03</div>
                <h3 className="font-poppins font-semibold text-lg text-primary">Crescimento Conjunto</h3>
              </div>
              <p className="text-text-light">Acreditamos que o sucesso é compartilhado. Quanto mais a comunidade cresce, mais todos prosperam.</p>
            </div>

            <div className="bg-body rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold">04</div>
                <h3 className="font-poppins font-semibold text-lg text-primary">Transparência Total</h3>
              </div>
              <p className="text-text-light">Regras claras, benefícios explícitos e sem surpresas. Você sabe exatamente o que esperar em cada nível.</p>
            </div>

            <div className="bg-body rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold">05</div>
                <h3 className="font-poppins font-semibold text-lg text-primary">Oportunidades Reais</h3>
              </div>
              <p className="text-text-light">Geramos negócios concretos através de indicações qualificadas, eventos estratégicos e parcerias sólidas.</p>
            </div>

            <div className="bg-body rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold">06</div>
                <h3 className="font-poppins font-semibold text-lg text-primary">Suporte Contínuo</h3>
              </div>
              <p className="text-text-light">Mentoria, materiais, treinamentos e uma equipe dedicada para garantir que você aproveite ao máximo o programa.</p>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Pilares Section (removida) */}
      {false && (
      <section id="beneficios" className="py-20 px-6 bg-primary">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-poppins font-bold text-3xl md:text-4xl text-white text-center mb-4">
            Pilares Estruturais
          </h2>
          <p className="text-center text-white mb-16 text-lg">
            Crescimento empresarial por meio de posicionamento estratégico, conexões relevantes e oportunidades reais
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-lg bg-white/10 hover:shadow-lg transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cta rounded-full mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-poppins font-semibold text-xl text-white mb-4">
                Visibilidade Qualificada
              </h3>
              <p className="text-white">
                Sua empresa está posicionada onde empresários procuram fornecedores, serviços e parcerias.
              </p>
            </div>

            <div className="text-center p-8 rounded-lg bg-white/10 hover:shadow-lg transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cta rounded-full mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-poppins font-semibold text-xl text-white mb-4">
                Networking Estratégico
              </h3>
              <p className="text-white">
                Acesso à comunidade empresarial, Painel de Negócios e eventos presenciais ou digitais.
              </p>
            </div>

            <div className="text-center p-8 rounded-lg bg-white/10 hover:shadow-lg transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cta rounded-full mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-poppins font-semibold text-xl text-white mb-4">
                Escalabilidade e Monetização
              </h3>
              <p className="text-white">
                Comissionamento claro e transparente para quem deseja expandir e indicar novos participantes.
              </p>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Pricing Section */}
      <section id="niveis" className="py-20 px-6 bg-body">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-poppins font-bold text-3xl md:text-4xl text-primary text-center mb-4">
            Níveis do Programa
          </h2>
          <p className="text-center text-text-light mb-16 text-lg">
            Benefícios progressivos que fortalecem a presença digital, ampliam conexões e possibilitam ganhos por indicação
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card Assinante */}
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <h3 className="font-poppins font-bold text-2xl text-primary">
                  Assinante
                </h3>
              </div>
              <p className="text-text-light text-sm mb-4">Para quem quer visibilidade profissional</p>
              <div className="mb-6">
                <span className="font-poppins font-bold text-4xl text-primary">R$ 997</span>
                <span className="text-gray-600">/ano</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-text-light">Página Personalizada com catálogo</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-text-light">Destaque nas buscas</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-text-light">Acesso à Comunidade Conecta</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-text-light">Suporte dedicado</span>
                </li>
              </ul>
              
              <button 
                onClick={() => navigate('/cadastro-guia-comercial?plan=assinante')}
                className="w-full border-2 border-primary text-primary py-3 rounded-md font-bold hover:bg-primary hover:text-white transition-all"
              >
                Ser Assinante
              </button>
            </div>

            {/* Card Associado - DESTAQUE */}
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-all border-4 border-cta relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-cta text-white px-6 py-1 rounded-full text-sm font-bold">
                  Mais Popular
                </span>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <h3 className="font-poppins font-bold text-2xl text-primary">
                  Associado
                </h3>
              </div>
              <p className="text-text-light text-sm mb-4">Para quem busca visibilidade + ganhos diretos</p>
              <div className="mb-6">
                <span className="font-poppins font-bold text-4xl text-cta">R$ 2.497</span>
                <span className="text-gray-600">/ano</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-cta mt-0.5 flex-shrink-0" />
                  <span className="text-text-light font-semibold">Tudo do Plano Assinante</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-cta mt-0.5 flex-shrink-0" />
                  <span className="text-text-light">Destaque na Home</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-cta mt-0.5 flex-shrink-0" />
                  <span className="text-text-light">Link exclusivo de indicação</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-cta mt-0.5 flex-shrink-0" />
                  <span className="text-text-light">Escritório Virtual</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-cta mt-0.5 flex-shrink-0" />
                  <span className="text-text-light">EPN Play por 1 ano</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-cta mt-0.5 flex-shrink-0" />
                  <span className="text-text-light font-semibold">Comissão de 10% em indicações diretas</span>
                </li>
              </ul>
              
              <button 
                onClick={() => navigate('/cadastro-guia-comercial?plan=associado')}
                className="w-full bg-cta text-white py-3 rounded-md font-bold hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg"
              >
                Ser Associado
              </button>
            </div>

            {/* Card Embaixador */}
            <div className="bg-secondary rounded-lg shadow-md p-8 hover:shadow-xl transition-all text-white">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <h3 className="font-poppins font-bold text-2xl">
                  Embaixador
                </h3>
              </div>
              <p className="text-gray-300 text-sm mb-4">Para quem busca autoridade, expansão e liderança</p>
              <div className="mb-6">
                <span className="font-poppins font-bold text-4xl">R$ 3.997</span>
                <span className="text-gray-300">/ano</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="font-semibold">Tudo do Plano Associado</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Espaço para divulgação de eventos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Acesso ao Painel de Negócios Global</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="font-semibold">Comissões progressivas em 3 níveis:</span>
                </li>
                <li className="pl-7 text-sm">
                  <div>• 1º nível: 10%</div>
                  <div>• 2º nível: 5%</div>
                  <div>• 3º nível: 2,5%</div>
                </li>
              </ul>
              
              <button 
                onClick={() => navigate('/cadastro-guia-comercial?plan=embaixador')}
                className="w-full bg-accent text-white py-3 rounded-md font-bold hover:bg-opacity-90 transition-all"
              >
                Aplicar para Embaixador
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Passo a Passo Section (removida) */}
      {false && (
      <section className="py-20 px-6 bg-body">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center bg-cta text-white px-4 py-2 rounded-md font-semibold">Passo a Passo</span>
          </div>
          <h2 className="font-poppins font-bold text-3xl md:text-4xl text-primary text-center mb-2">Jornada do Participante</h2>
          <p className="text-center text-text-light mb-12 text-lg">Do início ao sucesso: veja como funciona sua entrada e crescimento no programa</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { n: '01', t: 'Escolha do Plano', d: 'Selecione o nível que melhor se adequa ao seu momento: Assinante, Associado ou Embaixador.' },
              { n: '02', t: 'Pagamento e Confirmação', d: 'Realize o pagamento seguro e receba confirmação imediata por email.' },
              { n: '03', t: 'Acesso Imediato', d: 'Entre na plataforma e acesse sua área exclusiva de membro.' },
              { n: '04', t: 'Onboarding Personalizado', d: 'Receba orientações completas sobre como aproveitar todos os benefícios do seu nível.' },
              { n: '05', t: 'Criação do Perfil', d: 'Monte seu perfil profissional com o apoio da equipe de designers.' },
              { n: '06', t: 'Acesso ao Grupo Exclusivo', d: 'Entre no grupo de WhatsApp/Telegram da comunidade para networking imediato.' },
              { n: '07', t: 'Publicação e Ativação', d: 'Seu perfil entra no ar e você começa a receber visibilidade no portal.' },
              { n: '08', t: 'Treinamento de Ferramentas', d: 'Aprenda a usar todas as funcionalidades: link de indicação, painel de controle, materiais de divulgação.' },
              { n: '09', t: 'Primeiras Conexões', d: 'Comece a fazer networking ativo com outros membros do programa.' },
              { n: '10', t: 'Primeiras Indicações', d: 'Divulgue seu link personalizado e comece a gerar comissões.' },
              { n: '11', t: 'Suporte Contínuo', d: 'Acesse suporte técnico, consultoria estratégica e acompanhamento de resultados.' },
              { n: '12', t: 'Crescimento e Evolução', d: 'Monitore seus resultados, evolua de nível quando quiser e escale sua receita.' }
            ].map((s) => (
              <div key={s.n} className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold">{s.n}</div>
                  <h3 className="font-poppins font-semibold text-lg text-primary">{s.t}</h3>
                </div>
                <p className="text-text-light">{s.d}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-text-light text-lg mb-6">Tudo começa com uma escolha. Selecione seu plano e inicie sua jornada hoje!</p>
            <button onClick={() => navigate('/cadastro-guia-comercial')} className="bg-cta text-white px-8 py-4 rounded-md font-bold hover:bg-opacity-90 transition-all">Começar Agora</button>
          </div>
        </div>
      </section>
      )}

      {/* Comparativo de Níveis (removida) */}
      {false && (
      <section id="planos" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-poppins font-bold text-3xl md:text-4xl text-primary text-center mb-2">Compare os Níveis</h2>
          <p className="text-center text-text-light mb-6 text-lg">Qual Plano é Melhor Para Você?</p>
          <p className="text-center text-text-light mb-12">Veja lado a lado os benefícios e escolha o nível ideal para o seu momento</p>

          <div className="overflow-x-auto bg-body rounded-lg">
            <table className="min-w-full">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="px-4 py-3 text-cta">Benefícios</th>
                  <th className="px-4 py-3 text-cta text-center">
                    <span className="inline-flex justify-center mb-1"><User className="w-5 h-5 text-cta" /></span>
                    <span className="text-white">Assinante</span><br /><span className="text-gray-200 text-sm">R$ 997/ano</span><br /><span className="text-green-300 text-xs">em até 12x*</span>
                  </th>
                  <th className="px-4 py-3 text-cta text-center">
                    <span className="inline-flex justify-center mb-1"><Users className="w-5 h-5 text-cta" /></span>
                    <span className="text-white">Associado</span><br /><span className="text-gray-200 text-sm">R$ 2.497/ano</span> <span className="ml-2 bg-cta text-white px-2 py-0.5 rounded-full text-xs">Mais Popular</span><br /><span className="text-green-300 text-xs">em até 12x*</span>
                  </th>
                  <th className="px-4 py-3 text-cta text-center">
                    <span className="inline-flex justify-center mb-1"><Crown className="w-5 h-5 text-cta" /></span>
                    <span className="text-white">Embaixador</span><br /><span className="text-gray-200 text-sm">R$ 3.997/ano</span><br /><span className="text-green-300 text-xs">em até 12x*</span>
                    <div className="mt-1 inline-block bg-blue-200 text-primary px-2 py-0.5 rounded text-xs">Destaque</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  { b: 'Perfil Profissional', a: 'v', s: 'v', e: 'v' },
                  { b: 'Página Personalizada com Catálogo', a: 'v', s: 'v', e: 'v' },
                  { b: 'Destaque em Buscas', a: 'v', s: 'v', e: 'v' },
                  { b: 'Comunidade Conecta', a: 'v', s: 'v', e: 'v' },
                  { b: 'Suporte humanizado', a: 'v', s: 'v', e: 'v' },
                  { b: 'Destaque na Home', a: 'x', s: 'v', e: 'v' },
                  { b: 'Link de Indicação Exclusivo', a: 'x', s: 'v', e: 'v' },
                  { b: 'Escritório Virtual', a: 'x', s: 'v', e: 'v' },
                  { b: 'EPN Play (1 ano)', a: 'x', s: 'v', e: 'v' },
                ].map((row) => (
                  <tr key={row.b} className="bg-white">
                    <td className="px-4 py-3 text-primary font-medium">{row.b}</td>
                    <td className="px-4 py-3"><div className="w-full flex items-center justify-center">{row.a === 'v' ? <Check className="w-5 h-5 text-accent mx-auto" /> : <X className="w-5 h-5 text-gray-400 mx-auto" />}</div></td>
                    <td className="px-4 py-3"><div className="w-full flex items-center justify-center">{row.s === 'v' ? <Check className="w-5 h-5 text-accent mx-auto" /> : <X className="w-5 h-5 text-gray-400 mx-auto" />}</div></td>
                    <td className="px-4 py-3"><div className="w-full flex items-center justify-center">{row.e === 'v' ? <Check className="w-5 h-5 text-accent mx-auto" /> : <X className="w-5 h-5 text-gray-400 mx-auto" />}</div></td>
                  </tr>
                ))}

                <tr className="bg-white">
                  <td className="px-4 py-3 text-primary font-medium">Comissões (1º nível)</td>
                  <td className="px-4 py-3"><div className="w-full flex items-center justify-center"><X className="w-5 h-5 text-gray-400 mx-auto" /></div></td>
                  <td className="px-4 py-3"><div className="w-full flex items-center justify-center"><span className="text-primary font-semibold">10%</span></div></td>
                  <td className="px-4 py-3"><div className="w-full flex items-center justify-center"><span className="text-primary font-semibold">10%</span></div></td>
                </tr>

                {[
                  { b: 'Espaço para divulgar seus Eventos', a: 'x', s: 'x', e: 'v' },
                  { b: 'Painel Global de Negócios e Networking global', a: 'x', s: 'x', e: 'v' },
                  { b: 'Destaque Premium', a: 'x', s: 'x', e: 'v' },
                  { b: 'Construção de Autoridade de Marca', a: 'x', s: 'x', e: 'v' },
                ].map((row) => (
                  <tr key={row.b} className="bg-white">
                    <td className="px-4 py-3 text-primary font-medium">{row.b}</td>
                    <td className="px-4 py-3"><div className="w-full flex items-center justify-center">{row.a === 'v' ? <Check className="w-5 h-5 text-accent mx-auto" /> : <X className="w-5 h-5 text-gray-400 mx-auto" />}</div></td>
                    <td className="px-4 py-3"><div className="w-full flex items-center justify-center">{row.s === 'v' ? <Check className="w-5 h-5 text-accent mx-auto" /> : <X className="w-5 h-5 text-gray-400 mx-auto" />}</div></td>
                    <td className="px-4 py-3"><div className="w-full flex items-center justify-center">{row.e === 'v' ? <Check className="w-5 h-5 text-accent mx-auto" /> : <X className="w-5 h-5 text-gray-400 mx-auto" />}</div></td>
                  </tr>
                ))}

                <tr className="bg-white">
                  <td className="px-4 py-3 text-primary font-medium">Comissão Exponencial até 3º Nível</td>
                  <td className="px-4 py-3"><div className="w-full flex items-center justify-center"><X className="w-5 h-5 text-gray-400" /></div></td>
                  <td className="px-4 py-3"><div className="w-full flex items-center justify-center"><X className="w-5 h-5 text-gray-400" /></div></td>
                  <td className="px-4 py-3"><span className="text-primary font-semibold">10% + 5% + 2,5%</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button onClick={() => navigate('/cadastro-guia-comercial?plan=assinante')} className="border-2 border-primary text-primary px-6 py-3 rounded-md font-bold hover:bg-primary hover:text-white transition-all">Escolher</button>
            <button onClick={() => navigate('/cadastro-guia-comercial?plan=associado')} className="bg-cta text-white px-6 py-3 rounded-md font-bold hover:bg-opacity-90 transition-all">Escolher</button>
            <button onClick={() => navigate('/cadastro-guia-comercial?plan=embaixador')} className="bg-accent text-white px-6 py-3 rounded-md font-bold hover:bg-opacity-90 transition-all">Escolher</button>
          </div>
        </div>
      </section>
      )}

      {/* Garantia Total (removida) */}
      {false && (
      <section className="py-10 px-6 bg-blue-100/60">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 rounded-lg p-6 text-center">
            <div className="inline-flex items-center justify-center gap-3">
              <ShieldCheck className="w-24 h-24 text-primary" />
              <span className="font-poppins font-semibold text-primary">
                Garantia Total: Todos os planos incluem garantia de 7 dias. Teste sem riscos e cancele quando quiser, sem burocracias.
              </span>
            </div>
          </div>
        </div>
      </section>
      )}

      


      {false && (
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="flex justify-center bg-cta text-white px-4 py-2 rounded-md font-semibold w-fit mx-auto text-center">
            Por Que Somos o Ecossistema Digital Nº 1
          </h2>
          <h3 className="font-poppins font-bold text-2xl md:text-3xl text-primary text-center mt-4">
            Diferenciais do Maior Ecossistema Empresarial Digital do Brasil
          </h3>
          <p className="text-center text-text-light mb-12 text-lg">
            O que torna o Programa Conexão Empresarial o principal ecossistema de networking qualificado e oportunidades de negócios do Brasil
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="bg-blue-100/60 rounded-lg p-8">
              <div className="text-5xl md:text-6xl font-poppins font-extrabold text-primary">500+</div>
              <div className="mt-2 font-poppins font-semibold text-primary text-xl">Empreendedores Conectados</div>
              <p className="mt-3 text-text-light">
                Uma comunidade ativa e engajada gerando negócios reais todos os dias
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-body rounded-lg p-6">
                <h4 className="font-poppins font-semibold text-lg text-primary mb-2">Ecossistema Real e Ativo</h4>
                <p className="text-text-light">Comunidade engajada gerando oportunidades concretas</p>
              </div>
              <div className="bg-body rounded-lg p-6">
                <h4 className="font-poppins font-semibold text-lg text-primary mb-2">Networking Guiado</h4>
                <p className="text-text-light">Conexões estratégicas com estrutura e ferramentas</p>
              </div>
              <div className="bg-body rounded-lg p-6">
                <h4 className="font-poppins font-semibold text-lg text-primary mb-2">Visibilidade Estratégica</h4>
                <p className="text-text-light">Seu negócio onde realmente importa</p>
              </div>
              <div className="bg-body rounded-lg p-6">
                <h4 className="font-poppins font-semibold text-lg text-primary mb-2">Páginas Profissionais</h4>
                <p className="text-text-light">Design profissional incluído, sem custos extras</p>
              </div>
              <div className="bg-body rounded-lg p-6">
                <h4 className="font-poppins font-semibold text-lg text-primary mb-2">Modelo Sustentável</h4>
                <p className="text-text-light">Crescimento real e escalável da sua receita</p>
              </div>
              <div className="bg-body rounded-lg p-6">
                <h4 className="font-poppins font-semibold text-lg text-primary mb-2">Comissionamento Transparente</h4>
                <p className="text-text-light">Regras claras, pagamentos em até 30 dias</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* CTA Final Section (removida) */}
      {false && <FAQSection />}
      {false && (
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="flex justify-center bg-cta text-white px-4 py-2 rounded-md font-semibold w-fit mx-auto text-center">Transparência Total</h2>
          <h3 className="font-poppins font-bold text-2xl md:text-3xl text-primary text-center">Termos e Condições do Programa</h3>
          <p className="text-center text-text-light mb-12 text-lg">Tudo o que você precisa saber sobre como funciona o Programa Conexão Empresarial</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-body rounded-lg p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-cta rounded-full mb-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-poppins font-semibold text-lg text-primary mb-2">Acesso Imediato</h4>
              <p className="text-text-light">Confirmação de pagamento = ativação instantânea. Comece a usar todos os benefícios do seu plano imediatamente após o pagamento ser processado.</p>
            </div>
            <div className="bg-body rounded-lg p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-cta rounded-full mb-3">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-poppins font-semibold text-lg text-primary mb-2">Pagamento de Comissões</h4>
              <p className="text-text-light">As comissões são calculadas e pagas em até 30 dias após a confirmação da venda. Todas as transações podem ser acompanhadas em tempo real no seu painel.</p>
            </div>
            <div className="bg-body rounded-lg p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-cta rounded-full mb-3">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-poppins font-semibold text-lg text-primary mb-2">Conduta Ética</h4>
              <p className="text-text-light">Proibido spam, práticas enganosas ou uso indevido da marca. Mantenha sempre uma postura profissional e ética em todas as interações.</p>
            </div>
            <div className="bg-body rounded-lg p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-cta rounded-full mb-3">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-poppins font-semibold text-lg text-primary mb-2">Criação de Páginas</h4>
              <p className="text-text-light">Todas as páginas são desenvolvidas com apoio de designers profissionais. Você fornece o conteúdo e nós criamos o design que converte.</p>
            </div>
            <div className="bg-body rounded-lg p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-cta rounded-full mb-3">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-poppins font-semibold text-lg text-primary mb-2">Renovação e Upgrades</h4>
              <p className="text-text-light">Os planos são anuais com renovação automática (pode ser cancelada a qualquer momento). Upgrades entre níveis podem ser feitos a qualquer hora.</p>
            </div>
            <div className="bg-body rounded-lg p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-cta rounded-full mb-3">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-poppins font-semibold text-lg text-primary mb-2">Suporte Humanizado</h4>
              <p className="text-text-light">Você terá suporte técnico completo e humanizado. O tempo de resposta pode variar de 12h a 48h conforme demanda.</p>
            </div>
          </div>
        </div>
      </section>
      )}
      {false && (
      <section className="py-20 px-6 bg-gradient-to-b from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-poppins font-bold text-3xl md:text-4xl mb-6">
            Pronto para Transformar Seu Negócio?
          </h2>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Junte-se a centenas de empreendedores que já estão crescendo com o Portal Empreendedor
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button 
              onClick={scrollToPlanos}
              className="bg-white text-primary px-6 py-3 rounded-md font-bold hover:bg-opacity-90 transition-all"
            >
              Escolher Meu Plano
            </button>
            <button 
              onClick={() => window.open('https://www.guiaportalempreendedor.com.br/cadastro-guia-comercial', '_blank')}
              className="bg-cta text-white px-6 py-3 rounded-md font-bold hover:bg-opacity-90 transition-all"
            >
              CADASTRE-SE NO GUIA
            </button>
            <button 
              onClick={() => { const m = 'Olá, gostaria de ter mais detalhes sobre os planos do Guia Portal Empreendedor'; window.open(`https://wa.me/5511958080801?text=${encodeURIComponent(m)}`, '_blank') }}
              className="bg-green-600 text-white px-6 py-3 rounded-md font-bold hover:bg-opacity-90 transition-all"
            >
              Falar no WhatsApp
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cta" />
              <span className="text-white/90 text-sm">Garantia de 7 dias</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-cta" />
              <span className="text-white/90 text-sm">Pagamento seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <Headphones className="w-5 h-5 text-cta" />
              <span className="text-white/90 text-sm">Suporte humanizado</span>
            </div>
          </div>
        </div>
      </section>
      )}

      <Footer />
    </div>
  );
}
