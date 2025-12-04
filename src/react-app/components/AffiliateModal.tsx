import { X, Mail, Calendar, TrendingUp } from 'lucide-react';

interface Referral {
  id: number;
  level: number;
  full_name: string;
  email: string;
  plan: string;
  status: string;
  member_created_at: string;
}

interface AffiliateModalProps {
  referral: Referral | null;
  onClose: () => void;
}

export default function AffiliateModal({ referral, onClose }: AffiliateModalProps) {
  if (!referral) return null;

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

  const getPlanName = (plan: string) => {
    switch (plan) {
      case 'assinante':
        return 'Assinante';
      case 'associado':
        return 'Associado';
      case 'embaixador':
        return 'Embaixador';
      default:
        return plan;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="font-poppins font-bold text-xl text-primary">
            Detalhes do Afiliado
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Avatar and Name */}
          <div className="flex items-center gap-4">
            <div className={`w-20 h-20 rounded-full ${getPlanColor(referral.plan)} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
              {getInitials(referral.full_name)}
            </div>
            <div className="flex-1">
              <h4 className="font-poppins font-semibold text-lg text-primary">
                {referral.full_name}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-3 h-3 rounded-full ${getPlanColor(referral.plan)}`}></div>
                <span className="text-sm font-medium text-text-light">
                  Plano {getPlanName(referral.plan)}
                </span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-center">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              referral.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {referral.status === 'active' ? 'Ativo' : 'Pendente'}
            </span>
          </div>

          {/* Info Grid */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-body rounded-lg">
              <Mail className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-600 mb-1">E-mail</div>
                <div className="text-sm font-medium text-primary break-all">
                  {referral.email}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-body rounded-lg">
              <TrendingUp className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-600 mb-1">Nível na Rede</div>
                <div className="text-sm font-medium text-primary">
                  Nível {referral.level}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-body rounded-lg">
              <Calendar className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-600 mb-1">Data de Entrada</div>
                <div className="text-sm font-medium text-primary">
                  {formatDate(referral.member_created_at)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-primary text-white py-3 rounded-md font-medium hover:bg-opacity-90 transition-all"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
