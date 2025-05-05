
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/utils/formatters';
import { 
  getDateRangeByPeriod, 
  createDateDataPoints 
} from '@/utils/dashboard/dateUtils';
import { 
  processOrdersTimeData, 
  prepareDistributionChartData,
  getStatusColorMap,
  getPaymentMethodColorMap,
  transformTimeSeriesData
} from '@/utils/dashboard/dataTransformUtils';

export interface DashboardData {
  totalOrders: number;
  totalRevenue: string;
  totalRevenueRaw: number;
  confirmedOrders: number;
  confirmedRevenue: string;
  confirmedRevenueRaw: number;
  conversionRate: string;
  todayOrders: number;
  todayRevenue: string;
  thisMonthOrders: number;
  thisMonthRevenue: string;
  statusDistribution: { name: string; value: number; color: string }[];
  paymentDistribution: { name: string; value: number; color: string }[];
  ordersOverTime: any[];
  last7DaysOrders: any[];
  last7DaysRevenue: any[];
  ordersRaw: any[];
}

/**
 * Fetches all dashboard data from Supabase
 */
export const fetchDashboardData = async (period: 'today' | '7days' | '30days' | 'all'): Promise<DashboardData> => {
  const dateRanges = getDateRangeByPeriod(period);
  
  // Fetch all orders
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch dashboard data');
  }

  // Calculate key metrics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.product_price), 0);
  const confirmedOrders = orders.filter(order => order.status === 'CONFIRMED');
  const totalConfirmedRevenue = confirmedOrders.reduce((sum, order) => sum + Number(order.product_price), 0);
  
  // Calculate today's metrics
  const todayOrders = orders.filter(order => 
    new Date(order.created_at) >= new Date(dateRanges.today.start) && 
    new Date(order.created_at) <= new Date(dateRanges.today.end)
  );
  const todayRevenue = todayOrders.reduce((sum, order) => sum + Number(order.product_price), 0);
  
  // Calculate this month's metrics
  const thisMonthOrders = orders.filter(order => 
    new Date(order.created_at) >= new Date(dateRanges.month.start) && 
    new Date(order.created_at) <= new Date(dateRanges.month.end)
  );
  const thisMonthRevenue = thisMonthOrders.reduce((sum, order) => sum + Number(order.product_price), 0);
  
  // Calculate order status distribution
  const statusCounts: Record<string, number> = {};
  orders.forEach(order => {
    const status = order.status;
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });
  
  // Calculate payment method distribution
  const paymentMethodCounts: Record<string, number> = {};
  orders.forEach(order => {
    const method = order.payment_method;
    paymentMethodCounts[method] = (paymentMethodCounts[method] || 0) + 1;
  });
  
  // Prepare time series data for last 7 days
  const last7DaysData = createDateDataPoints(7);
  const processedLast7DaysData = processOrdersTimeData(
    orders, 
    last7DaysData, 
    dateRanges.last7Days.start
  );
  
  // Prepare time series data for last 30 days
  const last30DaysData = createDateDataPoints(30);
  const processedLast30DaysData = processOrdersTimeData(
    orders, 
    last30DaysData, 
    dateRanges.last30Days.start
  );

  // Prepare chart data
  const statusDistribution = prepareDistributionChartData(statusCounts, getStatusColorMap());
  const paymentDistribution = prepareDistributionChartData(paymentMethodCounts, getPaymentMethodColorMap());
  
  const last7DaysOrders = transformTimeSeriesData(processedLast7DaysData, 'orders');
  const last7DaysRevenue = transformTimeSeriesData(processedLast7DaysData, 'revenue');
  
  // Filter orders based on selected period
  const filteredOrders = period === 'today' 
    ? todayOrders 
    : period === '7days' 
      ? orders.filter(order => new Date(order.created_at) >= new Date(dateRanges.last7Days.start))
      : period === '30days'
        ? orders.filter(order => new Date(order.created_at) >= new Date(dateRanges.last30Days.start))
        : orders;
  
  return {
    totalOrders,
    totalRevenue: formatCurrency(totalRevenue),
    totalRevenueRaw: totalRevenue,
    confirmedOrders: confirmedOrders.length,
    confirmedRevenue: formatCurrency(totalConfirmedRevenue),
    confirmedRevenueRaw: totalConfirmedRevenue,
    conversionRate: totalOrders > 0 ? (confirmedOrders.length / totalOrders * 100).toFixed(1) : '0',
    todayOrders: todayOrders.length,
    todayRevenue: formatCurrency(todayRevenue),
    thisMonthOrders: thisMonthOrders.length,
    thisMonthRevenue: formatCurrency(thisMonthRevenue),
    statusDistribution,
    paymentDistribution,
    ordersOverTime: period === '7days' ? last7DaysOrders : [], // Simplified for now
    last7DaysOrders,
    last7DaysRevenue,
    ordersRaw: orders
  };
};
