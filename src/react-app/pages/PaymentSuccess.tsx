import { useNavigate, useSearchParams } from 'react-router-dom'

export default function PaymentSuccess() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const plan = searchParams.get('plan') || 'associado'
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="font-poppins font-bold text-2xl text-primary mb-4">Pagamento confirmado!</h1>
        <p className="text-text-light mb-6">Estamos liberando seu acesso...</p>
        {plan === 'assinante' ? (
          <button onClick={() => navigate('/')} className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-opacity-90 transition-all">Voltar ao Site</button>
        ) : (
          <button onClick={() => navigate('/dashboard')} className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-opacity-90 transition-all">Acessar Escritório Virtual</button>
        )}
      </div>
    </div>
  )
}

