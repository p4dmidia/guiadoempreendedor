import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const items = [
    {
      question: 'O que é o Programa Conexão Empresarial?',
      answer:
        'O Programa Conexão Empresarial é uma plataforma de desenvolvimento e crescimento de negócios, que oferece visibilidade estratégica, networking qualificado e oportunidades reais de negócios para empreendedores de todo o Brasil. Ele é estruturado em três níveis de acesso, cada um com benefícios progressivos.'
    },
    {
      question: 'Quais são os níveis e os benefícios do Programa Conexão Empresarial?',
      answer:
        'Assinante: Página personalizada com catálogo, destaque nas buscas, acesso à Comunidade Conecta e suporte dedicado. <br><br> Associado: Todos os benefícios do plano Assinante, mais destaque na Home, link exclusivo de indicação, escritório virtual e comissões de 10% em indicações diretas. <br><br> Embaixador: Todos os benefícios do plano Associado, mais espaço para divulgação de eventos, acesso ao Painel de Negócios Global e comissões progressivas de 10%, 5% e 2,5% em três níveis.'
    },
    {
      question: 'Como faço para aderir ao programa?',
      answer:
        'Você pode escolher o plano ideal e realizar o pagamento anual. Após a confirmação do pagamento, você terá acesso imediato ao painel de controle e começará sua jornada no programa.'
    },
    {
      question: 'Como funciona o processo de adesão e ativação?',
      answer:
        'Após a escolha do seu plano, o processo acontece de forma simples e estruturada:<br> 1. Adesão: Escolha do plano e pagamento anual.<br> 2. Onboarding: Acesso imediato ao painel de controle.<br> 3. Design: Agendamento com a equipe de designers para criar sua página exclusiva.<br> 4. Go Live: Ativação oficial da sua empresa no Portal e destaques.<br> 5. Expansão: Liberação do escritório virtual e links de indicação (Associados e Embaixadores).<br> 6. Gestão: Registro de vendas e comissões no painel.<br> 7. Acompanhamento: Suporte contínuo durante toda a vigência do plano.'
    },
    {
      question: 'Como funciona o pagamento de comissões?',
      answer:
        'As comissões são pagas em até 30 dias após a confirmação da venda, de forma transparente e clara. Os valores são registrados automaticamente no painel de controle.'
    },
    {
      question: 'Posso escolher ou mudar de nível do programa a qualquer momento?',
      answer:
        'Sim! Você pode fazer upgrade ou downgrade de nível a qualquer momento durante a vigência do seu plano. <br> No caso de upgrade: Você pagará apenas a diferença proporcional entre os planos pelo período restante. <br> No caso de downgrade: A mudança será efetivada no próximo ciclo de renovação anual.'
    },
    {
      question: 'Quais são as regras e diretrizes para participar?',
      answer:
        'O programa opera com regras claras para garantir a qualidade do ecossistema. São proibidos spam e qualquer forma de divulgação enganosa. O código de conduta exige ética, transparência e profissionalismo em todas as interações.'
    },
    {
      question: 'De que forma o programa ajuda a minha empresa a crescer?',
      answer:
        'O Programa Conexão Empresarial é estruturado para impulsionar o crescimento do seu negócio em quatro pilares fundamentais: <br> - Visibilidade Qualificada <br> - Networking Estratégico <br> - Escalabilidade <br> - Monetização'
    },
    {
      question: 'O que é o Painel Global de Negócios?',
      answer:
        'O Painel Global de Negócios é uma ferramenta exclusiva disponível para membros Embaixadores. Através dele, você pode interagir com outros empreendedores e potenciais parceiros de negócios ao redor do mundo, expandindo sua rede de contatos além das fronteiras nacionais.'
    },
    {
      question: 'Qual é a principal vantagem de ser um Embaixador?',
      answer:
        'O Embaixador é visto como uma autoridade no ecossistema, podendo promover eventos, construir uma equipe de vendas e gerar receita em três níveis diferentes de comissões. É ideal para quem busca expandir sua presença e criar um fluxo contínuo de negócios.'
    },
    {
      question: 'Como funciona o suporte dentro do programa?',
      answer:
        'Oferecemos suporte contínuo durante toda a vigência do seu plano, incluindo ajuda para criação da sua página exclusiva, dúvidas sobre comissões e qualquer outro tipo de orientação relacionada ao programa.'
    },
    {
      question: 'O que acontece se eu não renovar o meu plano?',
      answer:
        'Se não houver renovação do seu plano, sua página será desativada e você perderá o direito de receber comissões futuras. A desativação ocorre no ciclo de renovação.'
    },
    {
      question: 'Quais são as principais diferenças entre o Programa Conexão Empresarial e outras plataformas?',
      answer:
        'O Programa Conexão Empresarial se destaca por ser um ecossistema real, com foco em networking qualificado, visibilidade real e oportunidades de negócios tangíveis. Diferente de outras plataformas, aqui você está em um ambiente B2B com foco total no fechamento de negócios e crescimento real.'
    },
    {
      question: 'Como o programa lida com a ética e o profissionalismo?',
      answer:
        'O programa possui um código de conduta rigoroso que exige ética, transparência e respeito nas interações entre os membros. Spam e práticas enganosas são estritamente proibidos.'
    },
    {
      question: 'O programa oferece alguma forma de treinamento ou suporte para crescimento?',
      answer:
        'Sim! O programa oferece suporte contínuo, conteúdos exclusivos sobre empreendedorismo, eventos de networking, acesso à plataforma EPN Play (Associados e Embaixadores) e descontos em cursos de parceiros.'
    },
    {
      question: 'Posso compartilhar minha página no Portal com outras pessoas?',
      answer:
        'Sim, e isso é altamente recomendado! Sua página personalizada foi criada especificamente para ser compartilhada com clientes, parceiros e redes sociais. Quanto mais você compartilhar, maior será sua visibilidade.'
    }
  ]

  return (
    <section id="faq" className="py-20 px-6" style={{ backgroundColor: '#f8f8f8' }}>
      <div className="max-w-5xl mx-auto">
        <h2 className="font-poppins font-bold text-3xl md:text-4xl text-primary text-center mb-10">
          Dúvidas Frequentes - Programa Conexão Empresarial
        </h2>

        <div className="space-y-4">
          {items.map((item, idx) => {
            const open = openIndex === idx
            return (
              <div key={item.question} className="bg-white rounded-lg shadow-sm">
                <button
                  className="w-full flex items-center justify-between p-4 text-left"
                  onClick={() => setOpenIndex(open ? null : idx)}
                >
                  <span className="font-poppins font-semibold text-primary">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={
                      'w-5 h-5 text-cta transition-transform ' + (open ? 'rotate-180' : 'rotate-0')
                    }
                  />
                </button>

                {open && (
                  <div className="px-4 pb-4">
                    <div
                      className="rounded-md border-l-4 border-cta bg-white p-4 text-gray-700"
                      dangerouslySetInnerHTML={{ __html: item.answer }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
