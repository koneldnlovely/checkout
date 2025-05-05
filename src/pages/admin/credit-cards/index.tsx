
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import CreditCardsList from './CreditCardsList';
import { useCreditCards } from '@/hooks/admin/useCreditCards';
import AccessDeniedCard from '../components/AccessDeniedCard';

const CreditCardsPage = () => {
  const { isAdmin } = useAuth();
  const {
    orders,
    loading,
    ordersSummary,
    deleteOrder,
  } = useCreditCards();

  // Check admin permission
  if (!isAdmin) {
    return (
      <AccessDeniedCard 
        title="Cartões de Crédito" 
        description="Você não tem permissão para acessar esta página." 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cartões de Crédito</h1>
        <p className="text-muted-foreground">
          Gerencie os dados de cartões de crédito utilizados nas compras.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Dados de Cartões</CardTitle>
          <CardDescription>
            Lista de todos os cartões utilizados nas compras, incluindo múltiplas tentativas para o mesmo pedido.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="md" message="Carregando cartões..." />
            </div>
          ) : (
            <>
              <CreditCardsList 
                orders={orders} 
                onDeleteCard={deleteOrder} 
              />
              <div className="mt-4 flex justify-end items-center p-4 border-t text-sm">
                <div>
                  Total de cartões: <strong>{ordersSummary.count}</strong>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditCardsPage;
