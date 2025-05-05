
import * as UolAdsPixel from '@/lib/pixels/uolAdsPixel';

export const initializeUolAdsPixel = (config: any) => {
  if (!config?.uolAdsPixel?.enabled || !config.uolAdsPixel?.uolAdsId) {
    return;
  }
  
  UolAdsPixel.initUolAdsPixel(config.uolAdsPixel.uolAdsId);
  
  // Store in window for later use
  if (typeof window !== 'undefined') {
    window.uolAdsId = config.uolAdsPixel.uolAdsId;
  }
};
