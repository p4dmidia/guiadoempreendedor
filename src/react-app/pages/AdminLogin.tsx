import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Shield } from 'lucide-react';
import { getSupabase } from '@/react-app/lib/supabaseClient'
import { ORG_ID } from '@/react-app/lib/org'

export default function AdminLogin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const supabase = getSupabase()
      const { error } = await supabase.auth.signInWithPassword({ email: credentials.email, password: credentials.password })
      if (error) { setError('Credenciais inválidas'); setIsSubmitting(false); return }
      const { data } = await supabase.auth.getUser()
      const uid = data.user?.id
      if (!uid) { setError('Falha de autenticação'); setIsSubmitting(false); return }
      const { data: prof } = await supabase
        .from('profiles')
        .select('role, organization_id')
        .eq('id', uid)
        .maybeSingle()
      console.log('DEBUG ADMIN LOGIN:', {
        EncontradoNoBanco: prof,
        ID_Esperado_Pelo_Codigo: ORG_ID,
        Role_Encontrada: prof?.role,
        Org_Encontrada: prof?.organization_id,
      })
      const ok = prof && prof.role === 'admin' && prof.organization_id === ORG_ID
      if (!ok) {
        await supabase.auth.signOut()
        setError('Acesso Negado')
        setIsSubmitting(false)
        return
      }
      navigate('/admin/dashboard')
    } catch (_e) {
      setError('Erro ao fazer login. Tente novamente.')
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-b from-primary to-secondary">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-4">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-poppins font-bold text-2xl text-primary">
              Painel Administrativo
            </h1>
            <div className="flex items-center justify-center gap-2 text-accent mt-2">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">Acesso Restrito</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-text-light font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Digite seu email"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-text-light font-medium mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Digite sua senha"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-3 rounded-md font-bold hover:bg-opacity-90 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Autenticando...' : 'Acessar Painel'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => navigate('/')}
              className="text-primary hover:text-accent transition-colors text-sm"
            >
              ← Voltar para o site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
