import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { getSupabase } from '@/react-app/lib/supabaseClient'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = getSupabase()
        const { data } = await supabase.auth.getSession()
        if (data.session) {
          navigate('/dashboard')
        } else {
          navigate('/login')
        }
      } catch (_e) {
        navigate('/login')
      }
    }
    handleCallback()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-text-light">Autenticando...</p>
      </div>
    </div>
  );
}
