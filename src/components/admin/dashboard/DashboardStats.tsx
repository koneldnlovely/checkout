
import React from 'react';
import { CreditCard, DollarSign, ShoppingCart, Users } from 'lucide-react';
import StatCard from './StatCard';

interface DashboardStatsProps {
  stats: {
    totalOrders: number;
    totalRevenue: number;
    cardsCaptures: number;
    visitors: number;
  };
  loading: boolean;
  period: string;
}

const DashboardStats = ({ stats, loading, period }: DashboardStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Pedidos Totais" 
        value={loading ? "..." : stats?.totalOrders}
        description={`No período selecionado`}
        icon={ShoppingCart}
      />
      <StatCard 
        title="Faturamento" 
        value={loading ? "..." : `R$ ${stats?.totalRevenue.toFixed(2)}`}
        description={`Receita no período selecionado`}
        icon={DollarSign}
      />
      <StatCard 
        title="Cartões Capturados" 
        value={loading ? "..." : stats?.cardsCaptures}
        description={`No período selecionado`}
        icon={CreditCard}
      />
      <StatCard 
        title="Visitantes" 
        value={loading ? "..." : stats?.visitors}
        description={`Estimativa no período selecionado`}
        icon={Users}
      />
    </div>
  );
};

export default DashboardStats;
