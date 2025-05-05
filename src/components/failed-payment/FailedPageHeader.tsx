
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const FailedPageHeader = () => {
  return (
    <CardHeader className="text-center pt-8">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-red-100">
        <AlertCircle className="h-10 w-10 text-red-500" />
      </div>
      <CardTitle className="text-2xl font-bold text-gray-800">Pagamento não aprovado</CardTitle>
      <CardDescription className="text-gray-600 text-lg mt-2">
        Houve um problema com seu pagamento
      </CardDescription>
    </CardHeader>
  );
};

export default FailedPageHeader;
