import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/react-app/auth/AuthProvider';
import { getSupabase } from '@/react-app/lib/supabaseClient'
import { ORG_ID } from '@/react-app/lib/org'
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Clock,
  Copy,
  Check,
  LogOut,
  Menu,
  X,
  Network
} from 'lucide-react';
import DashboardNavbar from '@/react-app/components/DashboardNavbar';
import NetworkTree from '@/react-app/components/NetworkTree';
import AffiliateModal from '@/react-app/components/AffiliateModal';
import ReferralCard from '@/react-app/components/ReferralCard';

interface Stats {
  directReferrals: number;
  totalReferrals: number;
  totalEarned: number;
  pendingEarnings: number;
}

interface Member {
  id: number;
  plan: string;
  status: string;
  referral_code: string;
  full_name: string;
  subscription_end_date: string;
}

interface Referral {
  id: number;
  level: number;
  full_name: string;
  email: string;
  plan: string;
  status: string;
  member_created_at: string;
}

interface Commission {
  id: number;
  amount: number;
  percentage: number;
  status: string;
  payment_date: string | null;
  full_name: string;
  plan: string;
  created_at: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut, isPending } = useAuth();
  const [member, setMember] = useState<Member | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'referrals' | 'commissions'>('overview');
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree');

  useEffect(() => {
    if (!isPending && !user) {
      navigate('/login');
    }
  }, [user, isPending, navigate]);

  useEffect(() => {
    if (user) {
      fetchMemberData();
    }
  }, [user]);

  // Check if member has access to dashboard (associado or embaixador only)
  useEffect(() => {
    if (member && member.plan === 'assinante') {
      // Assinantes don't have access to the dashboard
      alert('Assinantes não têm acesso ao Escritório Virtual. Para ter acesso, faça upgrade para Associado ou Embaixador.');
      navigate('/');
    }
  }, [member, navigate]);

  const fetchMemberData = async () => {
    try {
      const supabase = getSupabase()
      const { data: auth } = await supabase.auth.getUser()
      const uid = auth.user?.id
      if (!uid) {
        navigate('/login')
        return
      }

      const { data: aff } = await supabase
        .from('affiliates')
        .select('*')
        .eq('organization_id', ORG_ID)
        .eq('user_id', uid)
        .maybeSingle()

      let affiliate = aff
      if (!affiliate) {
        const { data: anyAff } = await supabase
          .from('affiliates')
          .select('*')
          .eq('user_id', uid)
          .maybeSingle()
        if (anyAff) {
          if (!anyAff.organization_id) {
            await supabase
              .from('affiliates')
              .update({ organization_id: ORG_ID })
              .eq('id', anyAff.id)
          }
          affiliate = { ...anyAff, organization_id: anyAff.organization_id ?? ORG_ID }
        } else {
          navigate('/cadastro')
          return
        }
      }

      const mappedMember: Member = {
        id: affiliate.id,
        plan: affiliate.plan,
        status: affiliate.status ?? 'pending',
        referral_code: affiliate.referral_code ?? '',
        full_name: affiliate.full_name,
        subscription_end_date: affiliate.subscription_end_date
      }

      if (mappedMember.plan === 'assinante') {
        alert('Assinantes não têm acesso ao Escritório Virtual. Para ter acesso, faça upgrade para Associado ou Embaixador.')
        navigate('/area-membros')
        return
      }

      const { data: comRows } = await supabase
        .from('commissions')
        .select('amount,status')
        .eq('organization_id', ORG_ID)
        .eq('affiliate_id', mappedMember.id)

      const totalEarned = (comRows || [])
        .filter(r => r.status === 'paid')
        .reduce((sum, r) => sum + (Number(r.amount) || 0), 0)
      const pendingEarnings = (comRows || [])
        .filter(r => r.status === 'pending')
        .reduce((sum, r) => sum + (Number(r.amount) || 0), 0)

      let directReferrals = 0
      let referralsList: Referral[] = []
      const baseCode = (mappedMember.referral_code || '').trim()
      if (baseCode) {
        const { data: lvl1 } = await supabase
          .from('affiliates')
          .select('id, full_name, email, plan, status, created_at, referral_code')
          .eq('organization_id', ORG_ID)
          .eq('referred_by_code', baseCode)

        const level1 = lvl1 || []
        directReferrals = level1.length
        referralsList = level1.map(r => ({
          id: r.id,
          level: 1,
          full_name: r.full_name,
          email: r.email,
          plan: r.plan,
          status: r.status ?? 'pending',
          member_created_at: r.created_at,
        }))

        if (mappedMember.plan === 'embaixador') {
          const lvl1Codes = level1.map(r => (r.referral_code || '').trim()).filter((c: string) => !!c)
          let level2: any[] = []
          if (lvl1Codes.length) {
            const { data: lvl2 } = await supabase
              .from('affiliates')
              .select('id, full_name, email, plan, status, created_at, referral_code')
              .eq('organization_id', ORG_ID)
              .in('referred_by_code', lvl1Codes)
            level2 = lvl2 || []
            referralsList = referralsList.concat(level2.map(r => ({
              id: r.id,
              level: 2,
              full_name: r.full_name,
              email: r.email,
              plan: r.plan,
              status: r.status ?? 'pending',
              member_created_at: r.created_at,
            })))
          }

          const lvl2Codes = level2.map(r => (r.referral_code || '').trim()).filter((c: string) => !!c)
          if (lvl2Codes.length) {
            const { data: lvl3 } = await supabase
              .from('affiliates')
              .select('id, full_name, email, plan, status, created_at, referral_code')
              .eq('organization_id', ORG_ID)
              .in('referred_by_code', lvl2Codes)
            const level3 = lvl3 || []
            referralsList = referralsList.concat(level3.map(r => ({
              id: r.id,
              level: 3,
              full_name: r.full_name,
              email: r.email,
              plan: r.plan,
              status: r.status ?? 'pending',
              member_created_at: r.created_at,
            })))
          }
        }
      }

      const statsData: Stats = {
        directReferrals,
        totalReferrals: referralsList.length,
        totalEarned,
        pendingEarnings,
      }

      setMember(mappedMember)
      setStats(statsData)
      setReferrals(referralsList)

      const { data: comList } = await supabase
        .from('commissions')
        .select('id, amount, percentage, status, payment_date, created_at')
        .eq('organization_id', ORG_ID)
        .eq('affiliate_id', mappedMember.id)
        .order('created_at', { ascending: false })

      setCommissions((comList || []).map(c => ({
        id: c.id,
        amount: c.amount,
        percentage: c.percentage ?? 0,
        status: c.status,
        payment_date: c.payment_date,
        full_name: mappedMember.full_name,
        plan: mappedMember.plan,
        created_at: c.created_at,
      })))
    } catch (error) {
      console.error('Error fetching member data:', error)
      navigate('/cadastro')
    }
  }

  const copyReferralLink = () => {
    if (member) {
      const link = `${window.location.origin}/cadastro?ref=${member.referral_code}`;
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (isPending || !user || !member || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-text-light">Carregando...</p>
        </div>
      </div>
    );
  }

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-body">
      <DashboardNavbar member={member} onLogout={handleLogout} />
      <AffiliateModal 
        referral={selectedReferral} 
        onClose={() => setSelectedReferral(null)} 
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="font-poppins font-bold text-3xl text-primary mb-2">
            Bem-vindo, {member.full_name}!
          </h1>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getPlanColor(member.plan)}`}></div>
            <p className="text-text-light">
              Plano {getPlanName(member.plan)} • Válido até {formatDate(member.subscription_end_date)}
            </p>
          </div>
        </div>

        <ReferralCard />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-primary mb-1">{stats.directReferrals}</div>
            <div className="text-text-light text-sm">Indicações Diretas</div>
          </div>

          {member.plan === 'embaixador' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-primary mb-1">{stats.totalReferrals}</div>
              <div className="text-text-light text-sm">Total na Rede</div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-accent bg-opacity-10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-accent" />
              </div>
            </div>
            <div className="text-3xl font-bold text-primary mb-1">{formatCurrency(stats.totalEarned)}</div>
            <div className="text-text-light text-sm">Total Recebido</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-cta" />
              </div>
            </div>
            <div className="text-3xl font-bold text-primary mb-1">{formatCurrency(stats.pendingEarnings)}</div>
            <div className="text-text-light text-sm">A Receber</div>
          </div>
        </div>


        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                Visão Geral
              </button>
              {member.plan === 'embaixador' && (
                <button
                  onClick={() => setActiveTab('referrals')}
                  className={`flex-1 px-6 py-4 font-medium transition-colors ${
                    activeTab === 'referrals'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  Minha Rede ({referrals.length})
                </button>
              )}
              <button
                onClick={() => setActiveTab('commissions')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'commissions'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                Comissões ({commissions.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h3 className="font-poppins font-semibold text-xl text-primary mb-4">
                  Resumo da Conta
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-text-light">Nome Completo</span>
                    <span className="font-medium">{member.full_name}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-text-light">E-mail</span>
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-text-light">Plano Atual</span>
                    <span className="font-medium flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getPlanColor(member.plan)}`}></div>
                      {getPlanName(member.plan)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-text-light">Status</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {member.status === 'active' ? 'Ativo' : 'Pendente'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-text-light">Validade</span>
                    <span className="font-medium">{formatDate(member.subscription_end_date)}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'referrals' && member.plan === 'embaixador' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-poppins font-semibold text-xl text-primary">Minha Rede</h3>
                  {referrals.length > 0 && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewMode('tree')}
                        className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
                          viewMode === 'tree'
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        <Network className="w-4 h-4" />
                        Árvore
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
                          viewMode === 'list'
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        <Users className="w-4 h-4" />
                        Lista
                      </button>
                    </div>
                  )}
                </div>

                {viewMode === 'tree' ? (
                  <NetworkTree 
                    referrals={referrals} 
                    onNodeClick={setSelectedReferral}
                  />
                ) : (
                  <>
                    {referrals.length === 0 ? (
                      <div className="text-center py-12">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-text-light">Você ainda não tem indicações</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {referrals.map((referral) => (
                          <div 
                            key={referral.id} 
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => setSelectedReferral(referral)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-primary">{referral.full_name}</h4>
                                <p className="text-sm text-text-light">{referral.email}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${getPlanColor(referral.plan)}`}></div>
                                <span className="text-sm font-medium">{getPlanName(referral.plan)}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-text-light">
                                Nível {referral.level} • {formatDate(referral.member_created_at)}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                referral.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {referral.status === 'active' ? 'Ativo' : 'Pendente'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'commissions' && (
              <div>
                <h3 className="font-poppins font-semibold text-xl text-primary mb-4">
                  Histórico de Comissões
                </h3>
                {commissions.length === 0 ? (
                  <div className="text-center py-12">
                    <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-text-light">Você ainda não tem comissões</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {commissions.map((commission) => (
                      <div key={commission.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-primary">{commission.full_name}</h4>
                            <p className="text-sm text-text-light">
                              Plano {getPlanName(commission.plan)} • {commission.percentage}% de comissão
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-accent text-lg">
                              {formatCurrency(commission.amount)}
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              commission.status === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {commission.status === 'paid' ? 'Pago' : 'Pendente'}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-text-light">
                          {commission.payment_date 
                            ? `Pago em ${formatDate(commission.payment_date)}`
                            : `Criado em ${formatDate(commission.created_at)}`}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
