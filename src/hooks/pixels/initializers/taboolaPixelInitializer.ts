
import * as TaboolaPixel from '@/lib/pixels/taboolaPixel';

export const initializeTaboolaPixel = (config: any) => {
  if (!config?.taboolaPixel?.enabled || !config.taboolaPixel?.taboolaAccountId) {
    return;
  }
  
  TaboolaPixel.initTaboolaPixel(config.taboolaPixel.taboolaAccountId);
  
  // Store in window for later use
  if (typeof window !== 'undefined') {
    window.taboolaAccountId = config.taboolaPixel.taboolaAccountId;
  }
};
