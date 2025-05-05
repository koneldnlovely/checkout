
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  actionLink?: string;
  actionLabel?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Erro',
  message = 'Ocorreu um erro inesperado.',
  actionLink = '/',
  actionLabel = 'Voltar para a página inicial',
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12">
      <div className="rounded-full bg-red-100 p-3 mb-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600 max-w-md mb-6">{message}</p>
      <Link 
        to={actionLink}
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
      >
        {actionLabel}
      </Link>
    </div>
  );
};
