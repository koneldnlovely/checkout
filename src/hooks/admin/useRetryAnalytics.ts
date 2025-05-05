
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AttemptStats {
  attemptNumber: number;
  count: number;
  successCount: number;
  successRate: number;
}

interface BrandStats {
  brand: string;
  count: number;
  value: number;
}

interface RetryAnalyticsData {
  attemptStats: AttemptStats[];
  brandStats: BrandStats[];
  totalAttempts: number;
  totalOrders: number;
  averageAttempts: number;
}

export const useRetryAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RetryAnalyticsData>({
    attemptStats: [],
    brandStats: [],
    totalAttempts: 0,
    totalOrders: 0,
    averageAttempts: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        // Fetch all card data
        const { data: cardData, error: cardError } = await supabase
          .from('card_data')
          .select('*, orders!fk_card_order(*)');

        if (cardError) throw cardError;

        if (!cardData) {
          setData({
            attemptStats: [],
            brandStats: [],
            totalAttempts: 0,
            totalOrders: 0,
            averageAttempts: 0
          });
          setLoading(false);
          return;
        }

        // Calculate total attempts and orders
        const totalAttempts = cardData.length;

        // Get unique order IDs to calculate total orders
        const uniqueOrderIds = new Set();
        cardData.forEach(card => {
          if (card.order_id) uniqueOrderIds.add(card.order_id);
        });
        const totalOrders = uniqueOrderIds.size;

        // Calculate average attempts per order
        const averageAttempts = uniqueOrderIds.size > 0 ? cardData.length / uniqueOrderIds.size : 0;

        // Process card data to get attempt statistics
        const attemptsMap = new Map<string, { attempts: number; status: string }>();

        // First pass: count attempts per order
        cardData.forEach(card => {
          const orderId = card.order_id;
          if (!orderId) return;

          if (!attemptsMap.has(orderId)) {
            attemptsMap.set(orderId, { attempts: 1, status: card.orders?.status || 'PENDING' });
          } else {
            const current = attemptsMap.get(orderId)!;
            attemptsMap.set(orderId, { 
              attempts: current.attempts + 1,
              status: card.orders?.status || current.status
            });
          }
        });

        // Calculate attempt stats
        const attemptCounts: { [key: number]: { total: number; success: number } } = {};
        
        attemptsMap.forEach(({ attempts, status }) => {
          if (!attemptCounts[attempts]) {
            attemptCounts[attempts] = { total: 0, success: 0 };
          }
          
          attemptCounts[attempts].total++;
          
          if (status === 'CONFIRMED' || status === 'RECEIVED') {
            attemptCounts[attempts].success++;
          }
        });

        // Convert to array format for the chart
        const attemptStatsArray: AttemptStats[] = [];
        for (const [attempt, counts] of Object.entries(attemptCounts)) {
          attemptStatsArray.push({
            attemptNumber: parseInt(attempt, 10),
            count: counts.total,
            successCount: counts.success,
            successRate: counts.total > 0 ? (counts.success / counts.total) * 100 : 0
          });
        }

        // Sort by attempt number
        attemptStatsArray.sort((a, b) => a.attemptNumber - b.attemptNumber);

        // Process brand statistics
        const brandMap = new Map<string, { count: number; value: number }>();
        
        cardData.forEach(card => {
          const brand = card.brand || 'Unknown';
          const value = card.orders?.product_price || 0;
          
          if (!brandMap.has(brand)) {
            brandMap.set(brand, { count: 1, value });
          } else {
            const current = brandMap.get(brand)!;
            brandMap.set(brand, { 
              count: current.count + 1,
              value: current.value + value
            });
          }
        });

        // Convert to array format for the chart
        const brandStatsArray: BrandStats[] = [];
        brandMap.forEach((stats, brand) => {
          brandStatsArray.push({
            brand,
            count: stats.count,
            value: stats.value
          });
        });

        // Sort by count
        brandStatsArray.sort((a, b) => b.count - a.count);

        setData({
          attemptStats: attemptStatsArray,
          brandStats: brandStatsArray,
          totalAttempts,
          totalOrders,
          averageAttempts
        });

      } catch (error) {
        console.error('Error fetching analytics data:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os dados de análise',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [toast]);

  return { ...data, loading };
};
