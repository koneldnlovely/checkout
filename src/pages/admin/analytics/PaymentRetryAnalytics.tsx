
import React from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import RetryPaymentHeader from '@/components/admin/analytics/retry-payment/RetryPaymentHeader';
import NoDataDisplay from '@/components/admin/analytics/retry-payment/NoDataDisplay';
import StatisticsSummary from '@/components/admin/analytics/retry-payment/StatisticsSummary';
import AttemptDistributionChart from '@/components/admin/analytics/retry-payment/AttemptDistributionChart';
import BrandDistributionChart from '@/components/admin/analytics/retry-payment/BrandDistributionChart';
import { useRetryAnalytics } from '@/hooks/admin/useRetryAnalytics';

const PaymentRetryAnalytics = () => {
  const { 
    loading, 
    attemptStats, 
    brandStats, 
    totalAttempts, 
    totalOrders, 
    averageAttempts 
  } = useRetryAnalytics();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" message="Carregando dados de análise..." />
      </div>
    );
  }

  if (attemptStats.length === 0) {
    return (
      <div className="space-y-6">
        <RetryPaymentHeader title="Análise de Retry Payment" />
        <NoDataDisplay />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RetryPaymentHeader 
        title="Análise de Retry Payment" 
        description="Visualize e analise as tentativas de pagamento e conversões."
      />

      <StatisticsSummary 
        totalAttempts={totalAttempts}
        totalOrders={totalOrders}
        averageAttempts={averageAttempts}
      />

      <AttemptDistributionChart data={attemptStats} />
      <BrandDistributionChart data={brandStats} />
    </div>
  );
};

export default PaymentRetryAnalytics;
