
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatisticsSummaryProps {
  totalAttempts: number;
  totalOrders: number;
  averageAttempts: number;
}

const StatisticsSummary = ({ totalAttempts, totalOrders, averageAttempts }: StatisticsSummaryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total de Tentativas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAttempts}</div>
          <p className="text-xs text-muted-foreground">Todas as tentativas de pagamento</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalOrders}</div>
          <p className="text-xs text-muted-foreground">Pedidos com pelo menos uma tentativa</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Média de Tentativas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageAttempts.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Média de tentativas por pedido</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsSummary;
