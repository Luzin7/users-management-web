
import { Home, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Unauthorized(){
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Shield size={64} className="text-destructive" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Acesso Negado</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          Você não tem permissão para acessar esta página. 
          Entre em contato com o administrador se acredita que isso é um erro.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-600 text-white rounded-lg transition-colors"
        >
          <Home size={20} />
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
};

