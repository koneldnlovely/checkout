
import * as GooglePixel from '@/lib/pixels/googlePixel';

export const initializeGoogleAdsPixels = (config: any) => {
  if (!config?.googleAdsPixels || !config.googleAdsPixels.length) {
    return;
  }
  
  config.googleAdsPixels.forEach((pixel: any) => {
    if (pixel.enabled && pixel.googleAdsId) {
      GooglePixel.initGooglePixel(pixel.googleAdsId);
      
      // Store in window for later use
      if (typeof window !== 'undefined') {
        window.googleAdsPixels = window.googleAdsPixels || [];
        window.googleAdsPixels.push({
          googleAdsId: pixel.googleAdsId,
          conversionLabel: pixel.conversionLabel || ''
        });
      }
    }
  });
};
