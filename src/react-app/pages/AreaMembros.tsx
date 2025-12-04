import { useNavigate } from 'react-router'

export default function AreaMembros() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="font-poppins font-bold text-2xl text-primary mb-4">Área do Membro</h1>
        <p className="text-text-light mb-6">Você está no plano Assinante. Para acessar o Escritório Virtual, faça upgrade para Associado ou Embaixador.</p>
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => navigate('/cadastro/associado')} className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-opacity-90 transition-all">Fazer Upgrade para Associado</button>
          <button onClick={() => navigate('/cadastro/embaixador')} className="bg-accent text-white px-6 py-3 rounded-md font-medium hover:bg-opacity-90 transition-all">Fazer Upgrade para Embaixador</button>
        </div>
      </div>
    </div>
  )
}

