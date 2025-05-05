
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDashboardData } from '@/services/dashboard/dashboardService';

export const useDashboardData = () => {
  const [period, setPeriod] = useState<'today' | '7days' | '30days' | 'all'>('7days');

  const queryResult = useQuery({
    queryKey: ['dashboardData', period],
    queryFn: () => fetchDashboardData(period),
    refetchInterval: 300000, // Refetch every 5 minutes
    refetchOnWindowFocus: true,
  });
  
  const { data, isLoading } = queryResult;
  
  return {
    period,
    setPeriod,
    stats: {
      totalOrders: data?.totalOrders || 0,
      totalRevenue: data?.totalRevenueRaw || 0,
      cardsCaptures: data?.ordersRaw?.filter(order => order.payment_method === 'creditCard').length || 0,
      visitors: data?.totalOrders ? Math.round(data.totalOrders * 2.5) : 0
    },
    statsLoading: isLoading,
    ordersOverTime: data?.ordersOverTime || [],
    paymentDistribution: data?.paymentDistribution || [],
    statusDistribution: data?.statusDistribution || []
  };
};
