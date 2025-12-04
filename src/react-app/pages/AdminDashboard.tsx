import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Users,
  TrendingUp,
  DollarSign,
  Clock,
  LogOut,
  UserCheck,
  UserX,
  Download,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Trophy
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface AdminStats {
  totalMembers: number;
  activeMembers: number;
  pendingMembers: number;
  totalSales: number;
  totalCommissionsPaid: number;
  totalCommissionsPending: number;
  pendingWithdrawals: number;
  membersByPlan: {
    assinante: number;
    associado: number;
    embaixador: number;
  };
}

interface Member {
  id: number;
  full_name: string;
  email: string;
  plan: string;
  status: string;
  referral_code: string;
  created_at: string;
  subscription_end_date: string;
  total_referrals: number;
  total_earned: number;
}

interface Commission {
  id: number;
  member_name: string;
  member_email: string;
  amount: number;
  percentage: number;
  status: string;
  payment_date: string | null;
  created_at: string;
}

interface WithdrawalRequest {
  id: number;
  member_name: string;
  member_email: string;
  amount: number;
  status: string;
  requested_at: string;
  processed_at: string | null;
  notes: string | null;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'commissions' | 'withdrawals'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending'>('all');
  const [planFilter, setPlanFilter] = useState<'all' | 'assinante' | 'associado' | 'embaixador'>('all');

  useEffect(() => {
    fetchDashboardData();
    setIsLoading(false);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, membersRes, commissionsRes, withdrawalsRes] = await Promise.all([
        fetch('/api/admin/stats', { credentials: 'include' }),
        fetch('/api/admin/members', { credentials: 'include' }),
        fetch('/api/admin/commissions', { credentials: 'include' }),
        fetch('/api/admin/withdrawals', { credentials: 'include' }),
      ]);

      const statsData = await statsRes.json();
      const membersData = await membersRes.json();
      const commissionsData = await commissionsRes.json();
      const withdrawalsData = await withdrawalsRes.json();

      setStats(statsData);
      setMembers(membersData);
      setCommissions(commissionsData);
      setWithdrawals(withdrawalsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { 
        method: 'POST',
        credentials: 'include',
      });
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleUpdateMemberStatus = async (memberId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/members/${memberId}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error updating member status:', error);
    }
  };

  const handleProcessWithdrawal = async (withdrawalId: number, approve: boolean) => {
    try {
      const response = await fetch(`/api/admin/withdrawals/${withdrawalId}/process`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approve }),
      });

      if (response.ok) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error processing withdrawal:', error);
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

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    const matchesPlan = planFilter === 'all' || member.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const topAffiliates = [...members]
    .sort((a, b) => b.total_earned - a.total_earned)
    .slice(0, 10);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-text-light">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const planDistributionData = [
    { name: 'Assinante', value: stats.membersByPlan.assinante, color: '#3b82f6' },
    { name: 'Associado', value: stats.membersByPlan.associado, color: '#22c55e' },
    { name: 'Embaixador', value: stats.membersByPlan.embaixador, color: '#eab308' },
  ];

  return (
    <div className="min-h-screen bg-body">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-poppins font-bold text-2xl text-primary">
            Painel Administrativo
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-text-light hover:text-primary transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-primary mb-1">{stats.totalMembers}</div>
            <div className="text-text-light text-sm">Total de Membros</div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="text-green-600 flex items-center gap-1">
                <UserCheck className="w-3 h-3" />
                {stats.activeMembers} ativos
              </span>
              <span className="text-yellow-600 flex items-center gap-1">
                <UserX className="w-3 h-3" />
                {stats.pendingMembers} pendentes
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-primary mb-1">{stats.totalSales}</div>
            <div className="text-text-light text-sm">Vendas Totais</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-accent bg-opacity-10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-accent" />
              </div>
            </div>
            <div className="text-3xl font-bold text-primary mb-1">
              {formatCurrency(stats.totalCommissionsPaid)}
            </div>
            <div className="text-text-light text-sm">Comissões Pagas</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-cta" />
              </div>
            </div>
            <div className="text-3xl font-bold text-primary mb-1">
              {formatCurrency(stats.totalCommissionsPending)}
            </div>
            <div className="text-text-light text-sm">Comissões Pendentes</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-poppins font-semibold text-xl text-primary mb-4">
              Distribuição por Plano
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={planDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {planDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-poppins font-semibold text-xl text-primary mb-4">
              Top 10 Afiliados
            </h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {topAffiliates.map((affiliate, index) => (
                <div key={affiliate.id} className="flex items-center justify-between p-3 bg-body rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-primary">{affiliate.full_name}</div>
                      <div className="text-sm text-text-light">
                        {affiliate.total_referrals} indicações
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-accent">{formatCurrency(affiliate.total_earned)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                Visão Geral
              </button>
              <button
                onClick={() => setActiveTab('members')}
                className={`flex-1 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'members'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                Membros ({members.length})
              </button>
              <button
                onClick={() => setActiveTab('commissions')}
                className={`flex-1 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'commissions'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                Comissões ({commissions.length})
              </button>
              <button
                onClick={() => setActiveTab('withdrawals')}
                className={`flex-1 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'withdrawals'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                Saques ({stats.pendingWithdrawals})
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h3 className="font-poppins font-semibold text-xl text-primary mb-6">
                  Resumo Geral do Sistema
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-text-light">Membros Ativos</span>
                      <span className="font-bold text-green-600">{stats.activeMembers}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-text-light">Membros Pendentes</span>
                      <span className="font-bold text-yellow-600">{stats.pendingMembers}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-text-light">Total de Vendas</span>
                      <span className="font-bold">{stats.totalSales}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-text-light">Comissões Pagas</span>
                      <span className="font-bold text-green-600">{formatCurrency(stats.totalCommissionsPaid)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-text-light">Comissões Pendentes</span>
                      <span className="font-bold text-yellow-600">{formatCurrency(stats.totalCommissionsPending)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-text-light">Solicitações de Saque</span>
                      <span className="font-bold text-cta">{stats.pendingWithdrawals}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'members' && (
              <div>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Buscar por nome ou e-mail..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">Todos os Status</option>
                    <option value="active">Ativos</option>
                    <option value="pending">Pendentes</option>
                  </select>
                  <select
                    value={planFilter}
                    onChange={(e) => setPlanFilter(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">Todos os Planos</option>
                    <option value="assinante">Assinante</option>
                    <option value="associado">Associado</option>
                    <option value="embaixador">Embaixador</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-body">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Nome</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-primary">E-mail</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Plano</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Indicações</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Ganhos</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMembers.map((member) => (
                        <tr key={member.id} className="border-b hover:bg-body">
                          <td className="px-4 py-3">
                            <div className="font-medium text-primary">{member.full_name}</div>
                            <div className="text-xs text-text-light">{formatDate(member.created_at)}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-text-light">{member.email}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${getPlanColor(member.plan)}`}></div>
                              <span className="text-sm font-medium">{getPlanName(member.plan)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              member.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {member.status === 'active' ? 'Ativo' : 'Pendente'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">{member.total_referrals}</td>
                          <td className="px-4 py-3 text-sm font-medium text-accent">
                            {formatCurrency(member.total_earned)}
                          </td>
                          <td className="px-4 py-3">
                            {member.status === 'pending' && (
                              <button
                                onClick={() => handleUpdateMemberStatus(member.id, 'active')}
                                className="text-green-600 hover:text-green-700 text-sm font-medium"
                              >
                                Aprovar
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'commissions' && (
              <div>
                <h3 className="font-poppins font-semibold text-xl text-primary mb-6">
                  Histórico de Comissões
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-body">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Afiliado</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Valor</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-primary">%</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commissions.map((commission) => (
                        <tr key={commission.id} className="border-b hover:bg-body">
                          <td className="px-4 py-3">
                            <div className="font-medium text-primary">{commission.member_name}</div>
                            <div className="text-xs text-text-light">{commission.member_email}</div>
                          </td>
                          <td className="px-4 py-3 font-bold text-accent">
                            {formatCurrency(commission.amount)}
                          </td>
                          <td className="px-4 py-3 text-sm">{commission.percentage}%</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              commission.status === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {commission.status === 'paid' ? 'Pago' : 'Pendente'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-text-light">
                            {commission.payment_date 
                              ? formatDate(commission.payment_date)
                              : formatDate(commission.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'withdrawals' && (
              <div>
                <h3 className="font-poppins font-semibold text-xl text-primary mb-6">
                  Solicitações de Saque
                </h3>
                <div className="space-y-4">
                  {withdrawals.map((withdrawal) => (
                    <div key={withdrawal.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-primary">{withdrawal.member_name}</h4>
                          <p className="text-sm text-text-light">{withdrawal.member_email}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-accent text-xl">
                            {formatCurrency(withdrawal.amount)}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            withdrawal.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : withdrawal.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {withdrawal.status === 'approved' ? 'Aprovado' : 
                             withdrawal.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-text-light mb-3">
                        Solicitado em {formatDate(withdrawal.requested_at)}
                        {withdrawal.processed_at && ` • Processado em ${formatDate(withdrawal.processed_at)}`}
                      </div>
                      {withdrawal.notes && (
                        <div className="text-sm bg-body p-2 rounded mb-3">
                          <strong>Observações:</strong> {withdrawal.notes}
                        </div>
                      )}
                      {withdrawal.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleProcessWithdrawal(withdrawal.id, true)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Aprovar
                          </button>
                          <button
                            onClick={() => handleProcessWithdrawal(withdrawal.id, false)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                          >
                            <XCircle className="w-4 h-4" />
                            Rejeitar
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {withdrawals.length === 0 && (
                    <div className="text-center py-12">
                      <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-text-light">Nenhuma solicitação de saque</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
