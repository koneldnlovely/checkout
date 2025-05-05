
import { format } from 'date-fns';

/**
 * Prepares chart data with color mapping
 */
export const prepareDistributionChartData = (
  counts: Record<string, number>,
  colorMap: Record<string, string>
) => {
  return Object.entries(counts).map(([name, value]) => {
    const color = colorMap[name] || "#6B7280"; // Default gray
    return { name, value, color };
  });
};

/**
 * Creates color mappings for status distribution
 */
export const getStatusColorMap = () => ({
  "PENDING": "#F59E0B", // Amber
  "CONFIRMED": "#10B981", // Green
  "CANCELLED": "#EF4444", // Red
  "REFUNDED": "#6B7280", // Gray
  "OVERDUE": "#EC4899" // Pink
});

/**
 * Creates color mappings for payment methods
 */
export const getPaymentMethodColorMap = () => ({
  "pix": "#10B981", // Green
  "creditCard": "#8B5CF6" // Purple
});

/**
 * Transforms time series data for charts
 */
export const transformTimeSeriesData = (
  dateData: Record<string, { count: number; revenue: number }>,
  type: 'orders' | 'revenue'
) => {
  return Object.entries(dateData).map(([date, data]) => {
    if (type === 'orders') {
      return {
        date,
        count: data.count,
        orders: data.count // Add normalized name for chart
      };
    } else {
      return {
        date,
        value: data.revenue,
        revenue: data.revenue // Add normalized name for chart
      };
    }
  }).reverse();
};

/**
 * Process orders data to extract time series information
 */
export const processOrdersTimeData = (
  orders: any[],
  dateDataPoints: Record<string, { count: number; revenue: number }>,
  startDate: string
) => {
  const result = { ...dateDataPoints };
  
  orders.forEach(order => {
    const orderDate = new Date(order.created_at);
    if (orderDate >= new Date(startDate)) {
      const dateStr = format(orderDate, 'yyyy-MM-dd');
      if (result[dateStr]) {
        result[dateStr].count += 1;
        result[dateStr].revenue += Number(order.product_price);
      }
    }
  });
  
  return result;
};
