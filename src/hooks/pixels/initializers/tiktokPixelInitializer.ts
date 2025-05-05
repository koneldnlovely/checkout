
import * as TiktokPixel from '@/lib/pixels/tiktokPixel';

export const initializeTiktokPixel = (config: any) => {
  if (!config?.tiktokPixel?.enabled || !config.tiktokPixel?.tiktokPixelId) {
    return;
  }
  
  TiktokPixel.initTiktokPixel(config.tiktokPixel.tiktokPixelId);
  
  // Store in window for later use
  if (typeof window !== 'undefined') {
    window.tiktokPixelId = config.tiktokPixel.tiktokPixelId;
  }
};
