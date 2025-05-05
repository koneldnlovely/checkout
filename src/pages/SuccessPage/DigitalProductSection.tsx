
import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DigitalProductSectionProps {
  isDigital?: boolean;
}

export const DigitalProductSection: React.FC<DigitalProductSectionProps> = ({ isDigital = false }) => {
  if (!isDigital) return null;

  return (
    <div className="p-5 bg-purple-50 rounded-lg border border-purple-100 my-4 flex items-start">
      <div className="bg-purple-100 p-3 rounded-full mr-4 mt-1">
        <Lock className="h-5 w-5 text-purple-600" />
      </div>
      <div className="text-left">
        <p className="text-gray-800 font-medium text-lg">Seus dados de acesso estão prontos!</p>
        <p className="text-gray-600 mt-1">Clique no botão abaixo para ver seus dados de acesso ao produto digital.</p>
      </div>
    </div>
  );
};

export const DigitalProductButton: React.FC<DigitalProductSectionProps> = ({ isDigital = false }) => {
  if (!isDigital) return null;

  return (
    <Button 
      asChild 
      className="w-full bg-green-600 hover:bg-green-700 transition-colors px-6 py-3 h-auto text-white border-0 text-lg rounded-lg shadow-md"
    >
      <Link to="/access-data" className="flex items-center justify-center">
        Ver dados de acesso
        <Lock className="ml-2 h-5 w-5" />
      </Link>
    </Button>
  );
};
