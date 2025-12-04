import { useNavigate } from 'react-router-dom';
import { Eye, Users, TrendingUp, Check } from 'lucide-react';
import Navbar from '@/react-app/components/Navbar';
import Footer from '@/react-app/components/Footer';

export default function Home() {
  const navigate = useNavigate();

  const scrollToPlanos = () => {
    const element = document.getElementById('planos');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section id="inicio" className="bg-gradient-to-b from-primary to-secondary py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-poppins font-bold text-4xl md:text-5xl text-white mb-6 leading-tight">
            Programa Conexão Empresarial
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-8 font-medium">
            O modelo oficial de entrada, desenvolvimento e crescimento dentro do Guia Portal Empreendedor. Visibilidade estratégica, networking qualificado e oportunidades reais de negócios para empreendedores de todo o Brasil.
          </p>
          <button 
            onClick={scrollToPlanos}
            className="bg-cta text-white px-8 py-4 rounded-md font-bold text-lg hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Escolher meu Nível
          </button>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-poppins font-bold text-3xl md:text-4xl text-primary mb-6">
            Seja bem-vindo ao Programa Conexão Empresarial
          </h2>
          <p className="text-text-light text-lg mb-6 leading-relaxed">
            O modelo oficial de entrada, desenvolvimento e aceleração de negócios dentro do ecossistema do Guia Portal Empreendedor.
          </p>
          <p className="text-text-light text-lg mb-6 leading-relaxed">
            Mais do que uma plataforma de cadastro, este programa é um hub estratégico que reúne visibilidade qualificada, networking de alto nível e oportunidades reais de negócios para empreendedores visionários de todo o Brasil.
          </p>
          <p className="text-text-light text-lg leading-relaxed">
            Estruturado meticulosamente em três níveis de acesso — Assinante, Associado e Embaixador — o programa foi desenhado para oferecer uma jornada de benefícios progressivos. Aqui, fortalecemos sua presença digital, ampliamos sua rede de contatos e desbloqueamos novas fontes de receita através de um sistema inteligente de ganhos por indicação.
          </p>
        </div>
      </section>

      {/* Purpose Section */}
      <section className="py-16 px-6 bg-body">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-poppins font-bold text-3xl md:text-4xl text-primary text-center mb-12">
            Propósito do Programa
          </h2>
          <p className="text-center text-text-light mb-12 text-lg">
            Nosso norte estratégico é claro e focado no sucesso do membro:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-md">
              <h3 className="font-poppins font-bold text-xl text-accent mb-4">
                Missão
              </h3>
              <p className="text-text-light leading-relaxed">
                Proporcionar crescimento empresarial tangível através de um posicionamento estratégico impecável, conexões relevantes entre decisores e geração de oportunidades reais de faturamento.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md">
              <h3 className="font-poppins font-bold text-xl text-accent mb-4">
                Visão
              </h3>
              <p className="text-text-light leading-relaxed">
                Consolidar-se como o principal e mais confiável ecossistema digital brasileiro focado em conexões empresariais e colaboração empreendedora genuína.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md">
              <h3 className="font-poppins font-bold text-xl text-accent mb-4">
                Valores Inegociáveis
              </h3>
              <ul className="text-text-light leading-relaxed space-y-2">
                <li>• Ética em primeiro lugar</li>
                <li>• Transparência absoluta</li>
                <li>• Crescimento coletivo</li>
                <li>• Empreendedorismo real</li>
                <li>• Oportunidades legítimas</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pilares Section */}
      <section id="beneficios" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-poppins font-bold text-3xl md:text-4xl text-primary text-center mb-4">
            Pilares Estruturais
          </h2>
          <p className="text-center text-text-light mb-16 text-lg">
            Crescimento empresarial por meio de posicionamento estratégico, conexões relevantes e oportunidades reais
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-lg bg-body hover:shadow-lg transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent bg-opacity-10 rounded-full mb-6">
                <Eye className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-poppins font-semibold text-xl text-primary mb-4">
                Visibilidade Qualificada
              </h3>
              <p className="text-text-light">
                Sua empresa está posicionada onde empresários procuram fornecedores, serviços e parcerias.
              </p>
            </div>

            <div className="text-center p-8 rounded-lg bg-body hover:shadow-lg transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent bg-opacity-10 rounded-full mb-6">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-poppins font-semibold text-xl text-primary mb-4">
                Networking Estratégico
              </h3>
              <p className="text-text-light">
                Acesso à comunidade empresarial, Painel de Negócios e eventos presenciais ou digitais.
              </p>
            </div>

            <div className="text-center p-8 rounded-lg bg-body hover:shadow-lg transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent bg-opacity-10 rounded-full mb-6">
                <TrendingUp className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-poppins font-semibold text-xl text-primary mb-4">
                Escalabilidade e Monetização
              </h3>
              <p className="text-text-light">
                Comissionamento claro e transparente para quem deseja expandir e indicar novos participantes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="planos" className="py-20 px-6 bg-body">
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
                onClick={() => navigate('/cadastro?plan=assinante')}
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
                onClick={() => navigate('/cadastro?plan=associado')}
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
                onClick={() => navigate('/cadastro?plan=embaixador')}
                className="w-full bg-accent text-white py-3 rounded-md font-bold hover:bg-opacity-90 transition-all"
              >
                Aplicar para Embaixador
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Diretrizes Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-poppins font-bold text-3xl md:text-4xl text-primary text-center mb-12">
            Diretrizes e Regras de Funcionamento
          </h2>
          <p className="text-center text-text-light mb-12 text-lg">
            Para manter a qualidade do ecossistema, operamos com regras claras:
          </p>
          
          <div className="space-y-6">
            <div className="bg-body rounded-lg p-6 border-l-4 border-accent">
              <h3 className="font-poppins font-semibold text-xl text-primary mb-2">
                Acesso Imediato
              </h3>
              <p className="text-text-light">
                Liberado automaticamente após a confirmação do pagamento.
              </p>
            </div>

            <div className="bg-body rounded-lg p-6 border-l-4 border-accent">
              <h3 className="font-poppins font-semibold text-xl text-primary mb-2">
                Pagamento de Comissões
              </h3>
              <p className="text-text-light">
                Transparência total. Valores pagos em até 30 dias após a confirmação da venda.
              </p>
            </div>

            <div className="bg-body rounded-lg p-6 border-l-4 border-accent">
              <h3 className="font-poppins font-semibold text-xl text-primary mb-2">
                Código de Conduta
              </h3>
              <p className="text-text-light">
                Prezamos pela ética. É estritamente proibido spam e qualquer forma de divulgação enganosa.
              </p>
            </div>

            <div className="bg-body rounded-lg p-6 border-l-4 border-accent">
              <h3 className="font-poppins font-semibold text-xl text-primary mb-2">
                Profissionalismo Visual
              </h3>
              <p className="text-text-light">
                A criação da sua página é assistida pelo nosso time de suporte e designers, garantindo o padrão de qualidade.
              </p>
            </div>

            <div className="bg-body rounded-lg p-6 border-l-4 border-accent">
              <h3 className="font-poppins font-semibold text-xl text-primary mb-2">
                Ciclo de Ativação
              </h3>
              <p className="text-text-light">
                Em caso de não renovação, a página é desativada e o direito às comissões futuras é encerrado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fluxo Operacional Section */}
      <section className="py-20 px-6 bg-body">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-poppins font-bold text-3xl md:text-4xl text-primary text-center mb-12">
            Fluxo Operacional: Sua Jornada
          </h2>
          <p className="text-center text-text-light mb-12 text-lg">
            Como funciona do momento da decisão até a ativação:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="font-poppins font-semibold text-lg text-primary">
                  Adesão
                </h3>
              </div>
              <p className="text-text-light">
                Escolha do plano ideal e realização do pagamento anual.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="font-poppins font-semibold text-lg text-primary">
                  Onboarding
                </h3>
              </div>
              <p className="text-text-light">
                Acesso imediato ao painel de controle.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="font-poppins font-semibold text-lg text-primary">
                  Design
                </h3>
              </div>
              <p className="text-text-light">
                Agendamento com nossa equipe de designers para criação da sua Página Exclusiva.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                  4
                </div>
                <h3 className="font-poppins font-semibold text-lg text-primary">
                  Go Live
                </h3>
              </div>
              <p className="text-text-light">
                Ativação oficial da sua empresa no Portal e Destaques.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                  5
                </div>
                <h3 className="font-poppins font-semibold text-lg text-primary">
                  Expansão
                </h3>
              </div>
              <p className="text-text-light">
                Liberação do Escritório Virtual e dos Links de Indicação (Associados/Embaixadores).
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                  6
                </div>
                <h3 className="font-poppins font-semibold text-lg text-primary">
                  Gestão
                </h3>
              </div>
              <p className="text-text-light">
                Registro automático das suas vendas e recebimento de comissões (ciclo de 30 dias).
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md md:col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                  7
                </div>
                <h3 className="font-poppins font-semibold text-lg text-primary">
                  Acompanhamento
                </h3>
              </div>
              <p className="text-text-light">
                Suporte contínuo durante toda a vigência do plano.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cenário de Mercado Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-poppins font-bold text-3xl md:text-4xl text-primary text-center mb-6">
            Cenário de Mercado e Oportunidade
          </h2>
          <p className="text-center text-accent text-xl font-semibold mb-12">
            Por que aderir agora?
          </p>
          
          <div className="bg-body rounded-lg p-8 mb-8">
            <p className="text-text-light text-lg leading-relaxed mb-6">
              Os empreendedores estão saturados de promessas vazias. O mercado busca, hoje, soluções que entreguem:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-poppins font-semibold text-primary mb-1">Visibilidade Real</h4>
                  <p className="text-text-light">Fugir do algoritmo das redes sociais e ser encontrado por quem busca serviços.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-poppins font-semibold text-primary mb-1">Networking Qualificado</h4>
                  <p className="text-text-light">Fugir de grupos de "curiosos" e falar com quem decide.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 md:col-span-2">
                <Check className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-poppins font-semibold text-primary mb-1">Plataformas Confiáveis</h4>
                  <p className="text-text-light">Ambientes seguros e profissionais.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-8 text-white text-center">
            <p className="text-lg leading-relaxed">
              O Programa Conexão Empresarial destaca-se justamente por oferecer um <span className="font-semibold text-accent">ecossistema sólido, ativo e mensurável</span> — entregando muito além da simples exposição digital: entregamos <span className="font-semibold text-accent">pertencimento e negócios</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Personas Section */}
      <section className="py-20 px-6 bg-body">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-poppins font-bold text-3xl md:text-4xl text-primary text-center mb-12">
            Qual é o seu Perfil?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <h3 className="font-poppins font-bold text-xl text-primary">
                  Você é Assinante se:
                </h3>
              </div>
              <p className="text-text-light leading-relaxed">
                Seu foco atual é organizar a casa, ter um link profissional para enviar a clientes e ser encontrado no Google e no Portal.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md border-2 border-cta">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <h3 className="font-poppins font-bold text-xl text-primary">
                  Você é Associado se:
                </h3>
              </div>
              <p className="text-text-light leading-relaxed">
                Já está estabelecido, quer aparecer na vitrine principal e tem uma boa rede de contatos que pode monetizar indicando para o Portal.
              </p>
            </div>

            <div className="bg-secondary rounded-lg p-8 shadow-md text-white">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <h3 className="font-poppins font-bold text-xl">
                  Você é Embaixador se:
                </h3>
              </div>
              <p className="leading-relaxed">
                É um líder nato. Quer ser visto como autoridade, promover seus eventos e construir uma equipe de vendas abaixo de você, gerando escala financeira em múltiplos níveis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciais Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-poppins font-bold text-3xl md:text-4xl text-primary text-center mb-12">
            Nossos Diferenciais Competitivos
          </h2>
          <p className="text-center text-text-light mb-12 text-lg">
            O que nos torna únicos:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3 bg-body rounded-lg p-6">
              <Check className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-poppins font-semibold text-lg text-primary mb-2">
                  Ecossistema Real
                </h4>
                <p className="text-text-light">
                  Não somos um robô, somos uma comunidade de empresas ativas.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-body rounded-lg p-6">
              <Check className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-poppins font-semibold text-lg text-primary mb-2">
                  Networking Guiado
                </h4>
                <p className="text-text-light">
                  Oportunidades contínuas de conexão.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-body rounded-lg p-6">
              <Check className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-poppins font-semibold text-lg text-primary mb-2">
                  Ambiente B2B
                </h4>
                <p className="text-text-light">
                  Foco total em fechamento de negócios.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-body rounded-lg p-6">
              <Check className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-poppins font-semibold text-lg text-primary mb-2">
                  Comissionamento Transparente
                </h4>
                <p className="text-text-light">
                  Modelo simples, sem letras miúdas.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-body rounded-lg p-6">
              <Check className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-poppins font-semibold text-lg text-primary mb-2">
                  Suporte de Design
                </h4>
                <p className="text-text-light">
                  Entregamos páginas profissionais, não apenas um login.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-body rounded-lg p-6">
              <Check className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-poppins font-semibold text-lg text-primary mb-2">
                  Sustentabilidade
                </h4>
                <p className="text-text-light">
                  Modelo escalável que cresce junto com você.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-poppins font-bold text-3xl md:text-4xl mb-6">
            Seu negócio merece presença, reconhecimento e espaço
          </h2>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            O Programa Conexão Empresarial é a porta de entrada para ampliar sua visibilidade, construir relacionamentos estratégicos e acessar novas oportunidades dentro de um ecossistema empresarial forte e em evolução constante.
          </p>
          <p className="text-xl font-semibold mb-8 text-accent">
            Dê o passo que vai posicionar sua empresa no cenário certo.
          </p>
          <p className="text-lg mb-6">
            Escolha o nível que acompanha seu momento de crescimento:
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button 
              onClick={() => navigate('/cadastro?plan=assinante')}
              className="bg-white text-primary px-6 py-3 rounded-md font-bold hover:bg-opacity-90 transition-all flex items-center gap-2"
            >
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              Assinante
            </button>
            <button 
              onClick={() => navigate('/cadastro?plan=associado')}
              className="bg-cta text-white px-6 py-3 rounded-md font-bold hover:bg-opacity-90 transition-all flex items-center gap-2"
            >
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              Associado
            </button>
            <button 
              onClick={() => navigate('/cadastro?plan=embaixador')}
              className="bg-accent text-white px-6 py-3 rounded-md font-bold hover:bg-opacity-90 transition-all flex items-center gap-2"
            >
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              Embaixador
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
