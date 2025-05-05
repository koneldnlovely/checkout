
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const NoDataDisplay = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados insuficientes</CardTitle>
        <CardDescription>
          Não há dados suficientes para gerar análises de tentativas de pagamento.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center py-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p>Nenhuma tentativa de pagamento registrada ainda.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoDataDisplay;
