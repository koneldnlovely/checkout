
import * as FacebookPixel from '@/lib/pixels/facebookPixel';

export const initializeFacebookPixels = (config: any) => {
  if (!config?.facebookPixels || !config.facebookPixels.length) {
    return;
  }
  
  config.facebookPixels.forEach((pixel: any) => {
    if (pixel.enabled && pixel.facebookPixelId) {
      FacebookPixel.initFacebookPixel(pixel.facebookPixelId, pixel.facebookToken);
      
      // Store in window for later use
      if (typeof window !== 'undefined') {
        window.facebookPixels = window.facebookPixels || [];
        window.facebookPixels.push({
          facebookPixelId: pixel.facebookPixelId,
          facebookToken: pixel.facebookToken || ''
        });
      }
    }
  });
};
